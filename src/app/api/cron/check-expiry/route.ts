import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceSupabase()

  // Find all paid users whose plan has expired
  const { data: expiredUsers, error } = await supabase
    .from('profiles')
    .select('id, plan, plan_expires_at')
    .neq('plan', 'free')
    .not('plan_expires_at', 'is', null)
    .lt('plan_expires_at', new Date().toISOString())

  if (error) {
    console.error('Error fetching expired users:', error)
    return NextResponse.json({ error: 'Failed to check expiry' }, { status: 500 })
  }

  if (!expiredUsers || expiredUsers.length === 0) {
    return NextResponse.json({ message: 'No expired plans', downgraded: 0 })
  }

  // Downgrade all expired users to free
  const expiredIds = expiredUsers.map((u) => u.id)
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan: 'free', plan_expires_at: null })
    .in('id', expiredIds)

  if (updateError) {
    console.error('Error downgrading expired users:', updateError)
    return NextResponse.json({ error: 'Failed to downgrade' }, { status: 500 })
  }

  console.log(`Downgraded ${expiredIds.length} expired users:`, expiredIds)

  return NextResponse.json({
    message: `Downgraded ${expiredIds.length} users`,
    downgraded: expiredIds.length,
  })
}
