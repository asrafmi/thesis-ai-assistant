'use server'

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { MIDTRANS_BASE_URL, midtransHeaders, STARTER_PLAN_PRICE, FULL_PLAN_PRICE } from '@/lib/midtrans'
import type { Plan } from '@/lib/limits'

const PLAN_CONFIG: Record<Exclude<Plan, 'free'>, { price: number; label: string; itemId: string }> = {
  starter: { price: STARTER_PLAN_PRICE, label: 'SkripsiAI Starter (3 Bulan)', itemId: 'starter-plan' },
  full: { price: FULL_PLAN_PRICE, label: 'SkripsiAI Full (Semester)', itemId: 'full-plan' },
}

export async function createSnapTransactionAction(targetPlan: Exclude<Plan, 'free'>): Promise<{
  data?: { token: string; redirectUrl: string }
  error?: string
}> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, plan')
    .eq('id', auth.userId)
    .single()

  if (!profile) return { error: 'Profil tidak ditemukan' }
  if (profile.plan === targetPlan) return { error: `Kamu sudah di plan ${targetPlan}!` }
  if (profile.plan === 'full') return { error: 'Kamu sudah di plan tertinggi!' }

  const config = PLAN_CONFIG[targetPlan]

  // Get user email
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Email tidak ditemukan' }

  const orderId = `${targetPlan.toUpperCase()}-${auth.userId.slice(0, 8)}-${Date.now()}`

  const response = await fetch(`${MIDTRANS_BASE_URL}/transactions`, {
    method: 'POST',
    headers: midtransHeaders,
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: config.price,
      },
      item_details: [
        {
          id: config.itemId,
          name: config.label,
          price: config.price,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: profile.full_name || 'User',
        email: user.email,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Midtrans error:', err)
    return { error: 'Gagal membuat transaksi' }
  }

  const result = await response.json()

  // Save transaction to DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table not in generated types until migration runs
  await (supabase.from as any)('transactions').insert({
    user_id: auth.userId,
    order_id: orderId,
    snap_token: result.token,
    amount: config.price,
    status: 'pending',
  })

  return {
    data: {
      token: result.token,
      redirectUrl: result.redirect_url,
    },
  }
}
