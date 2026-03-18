'use server'

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { MIDTRANS_BASE_URL, midtransHeaders, PRO_PLAN_PRICE } from '@/lib/midtrans'

export async function createSnapTransactionAction(): Promise<{
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
  if (profile.plan === 'pro') return { error: 'Kamu sudah Pro!' }

  // Get user email
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Email tidak ditemukan' }

  const orderId = `PRO-${auth.userId.slice(0, 8)}-${Date.now()}`

  const response = await fetch(`${MIDTRANS_BASE_URL}/transactions`, {
    method: 'POST',
    headers: midtransHeaders,
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: PRO_PLAN_PRICE,
      },
      item_details: [
        {
          id: 'pro-plan',
          name: 'SkripsiAI Pro Plan',
          price: PRO_PLAN_PRICE,
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
    amount: PRO_PLAN_PRICE,
    status: 'pending',
  })

  return {
    data: {
      token: result.token,
      redirectUrl: result.redirect_url,
    },
  }
}
