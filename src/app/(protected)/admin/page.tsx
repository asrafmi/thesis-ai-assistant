import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminScreen } from '@/screens/AdminScreen'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/dashboard')
  }

  return <AdminScreen />
}
