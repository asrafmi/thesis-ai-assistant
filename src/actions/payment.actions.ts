'use server'

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { STARTER_PLAN_PRICE, FULL_PLAN_PRICE, PLAN_DURATION_MONTHS } from '@/lib/limits'
import type { Plan } from '@/lib/limits'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

const PLAN_PRICES: Record<Exclude<Plan, 'free'>, number> = {
  starter: STARTER_PLAN_PRICE,
  full: FULL_PLAN_PRICE,
}

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return { error: auth.error } as const

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
    return { error: 'Akses ditolak' } as const
  }

  return { userId: auth.userId, email: user.email } as const
}

// ── User: submit payment request ──────────────────────────────

export async function submitPaymentRequestAction(
  targetPlan: Exclude<Plan, 'free'>,
  proofImageUrl: string,
): Promise<{ data?: { id: string }; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  // Check not already on target plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', auth.userId)
    .single()

  if (!profile) return { error: 'Profil tidak ditemukan' }
  if (profile.plan === targetPlan) return { error: `Kamu sudah di plan ${targetPlan}!` }
  if (profile.plan === 'full') return { error: 'Kamu sudah di plan tertinggi!' }

  // Check no pending request exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('payment_requests')
    .select('id')
    .eq('user_id', auth.userId)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) return { error: 'Kamu sudah memiliki permintaan pembayaran yang sedang diproses.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('payment_requests')
    .insert({
      user_id: auth.userId,
      plan: targetPlan,
      amount: PLAN_PRICES[targetPlan],
      proof_image_url: proofImageUrl,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating payment request:', error)
    return { error: 'Gagal membuat permintaan pembayaran' }
  }

  return { data: { id: data.id } }
}

// ── User: upload proof image ──────────────────────────────────

export async function uploadPaymentProofAction(
  formData: FormData,
): Promise<{ data?: { url: string }; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const file = formData.get('file') as File | null
  if (!file) return { error: 'File tidak ditemukan' }

  const ext = file.name.split('.').pop()
  const path = `${auth.userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('payment-proofs')
    .upload(path, file)

  if (error) {
    console.error('Error uploading proof:', error)
    return { error: 'Gagal upload bukti pembayaran' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(path)

  return { data: { url: publicUrl } }
}

// ── User: poll payment status ─────────────────────────────────

export async function getPaymentRequestStatusAction(): Promise<{
  data?: { status: 'pending' | 'approved' | 'rejected'; reject_reason: string | null; plan: string } | null
  error?: string
}> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('payment_requests')
    .select('status, reject_reason, plan')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching payment status:', error)
    return { error: 'Gagal mengambil status pembayaran' }
  }

  return { data: data ?? null }
}

// ── Admin: list all payment requests ──────────────────────────

export interface PaymentRequestRow {
  id: string
  user_id: string
  plan: string
  amount: number
  proof_image_url: string
  status: 'pending' | 'approved' | 'rejected'
  reject_reason: string | null
  created_at: string
  reviewed_at: string | null
  user_name: string | null
  user_email: string | null
}

export async function getPaymentRequestsAction(
  statusFilter?: 'pending' | 'approved' | 'rejected',
): Promise<{ data?: PaymentRequestRow[]; error?: string }> {
  const supabase = await createClient()
  const admin = await assertAdmin(supabase)
  if ('error' in admin) return admin

  const serviceDb = getServiceSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (serviceDb as any)
    .from('payment_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data: requests, error } = await query

  if (error) {
    console.error('Error fetching payment requests:', error)
    return { error: 'Gagal mengambil data' }
  }

  // Enrich with user info
  const userIds = [...new Set((requests as PaymentRequestRow[]).map((r) => r.user_id))]
  const { data: profiles } = await serviceDb
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)

  const { data: { users: authUsers } } = await serviceDb.auth.admin.listUsers()

  const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]))
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? null]))

  const enriched: PaymentRequestRow[] = (requests as PaymentRequestRow[]).map((r) => ({
    ...r,
    user_name: profileMap.get(r.user_id) ?? null,
    user_email: emailMap.get(r.user_id) ?? null,
  }))

  return { data: enriched }
}

// ── Admin: approve ────────────────────────────────────────────

export async function approvePaymentRequestAction(
  requestId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const admin = await assertAdmin(supabase)
  if ('error' in admin) return admin

  const serviceDb = getServiceSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: req, error: fetchError } = await (serviceDb as any)
    .from('payment_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (fetchError || !req) return { error: 'Request tidak ditemukan' }
  if (req.status !== 'pending') return { error: 'Request sudah diproses' }

  // Update request status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (serviceDb as any)
    .from('payment_requests')
    .update({
      status: 'approved',
      reviewed_by: admin.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (updateError) {
    console.error('Error approving request:', updateError)
    return { error: 'Gagal approve' }
  }

  // Calculate expiry date
  const months = PLAN_DURATION_MONTHS[req.plan as Exclude<Plan, 'free'>]
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + months)

  // Upgrade user plan + set expiry
  const { error: planError } = await serviceDb
    .from('profiles')
    .update({ plan: req.plan, plan_expires_at: expiresAt.toISOString() })
    .eq('id', req.user_id)

  if (planError) {
    console.error('Error upgrading plan:', planError)
    return { error: 'Gagal upgrade plan user' }
  }

  return {}
}

// ── Admin: reject ─────────────────────────────────────────────

export async function rejectPaymentRequestAction(
  requestId: string,
  reason: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const admin = await assertAdmin(supabase)
  if ('error' in admin) return admin

  const serviceDb = getServiceSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: req, error: fetchError } = await (serviceDb as any)
    .from('payment_requests')
    .select('status')
    .eq('id', requestId)
    .single()

  if (fetchError || !req) return { error: 'Request tidak ditemukan' }
  if (req.status !== 'pending') return { error: 'Request sudah diproses' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (serviceDb as any)
    .from('payment_requests')
    .update({
      status: 'rejected',
      reject_reason: reason,
      reviewed_by: admin.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (updateError) {
    console.error('Error rejecting request:', updateError)
    return { error: 'Gagal reject' }
  }

  return {}
}
