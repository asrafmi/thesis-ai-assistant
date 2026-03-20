import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Use service role client — webhook has no user session
function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function verifySignature(orderId: string, statusCode: string, grossAmount: string): string {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const input = orderId + statusCode + grossAmount + serverKey
  return crypto.createHash('sha512').update(input).digest('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('Received Midtrans notification:', body)

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type,
  } = body

  // Verify signature from Midtrans
  const expectedSignature = verifySignature(order_id, status_code, gross_amount)
  if (signature_key !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }
  console.log('Signature verified successfully')

  const supabase = getServiceSupabase()
  console.log('Supabase client initialized successfully')

  // Map Midtrans status to our enum
  let status: 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny' | 'refund' = 'pending'

  if (transaction_status === 'capture') {
    status = fraud_status === 'accept' ? 'settlement' : 'deny'
  } else if (transaction_status === 'settlement') {
    status = 'settlement'
  } else if (transaction_status === 'expire') {
    status = 'expire'
  } else if (transaction_status === 'cancel') {
    status = 'cancel'
  } else if (transaction_status === 'deny') {
    status = 'deny'
  } else if (transaction_status === 'refund' || transaction_status === 'partial_refund') {
    status = 'refund'
  }

  // Update transaction record
  const { data: transaction, error } = await supabase
    .from('transactions')
    .update({
      status,
      payment_type,
      midtrans_response: body,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', order_id)
    .select('user_id')
    .single()

  console.log('Transaction update result:', { transaction, error })
  if (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }

  // Determine target plan from order_id prefix
  const targetPlan = order_id.startsWith('FULL-') ? 'full'
    : order_id.startsWith('STARTER-') ? 'starter'
      : order_id.startsWith('PRO-') ? 'starter' // legacy PRO orders map to starter
        : null

  // Upgrade user on successful payment
  if (status === 'settlement' && transaction && targetPlan) {
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ plan: targetPlan })
      .eq('id', transaction.user_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user plan:', updateError)
    } else {
      console.log('User plan updated successfully:', updatedProfile)
    }
  }

  // Downgrade back to free on refund
  if (status === 'refund' && transaction) {
    const { data: downgradedProfile, error: downgradeError } = await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('id', transaction.user_id)
      .select()
      .single()

    if (downgradeError) {
      console.error('Error downgrading user plan:', downgradeError)
    } else {
      console.log('User plan downgraded successfully:', downgradedProfile)
    }
  }

  return NextResponse.json({ status: 'ok' })
}
