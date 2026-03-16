'use server'

// SERVER ACTIONS — Profile read/update. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import type { Profile } from '@/types/thesis.types'

export async function getProfileAction(): Promise<{ data?: Profile; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, nim, plan, word_count, word_count_reset_at')
    .eq('id', auth.userId)
    .single()

  if (error) return { error: error.message }
  return { data: data as Profile }
}

export async function updateProfileNimAction(nim: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { error } = await supabase
    .from('profiles')
    .update({ nim })
    .eq('id', auth.userId)

  if (error) return { error: error.message }
  return {}
}
