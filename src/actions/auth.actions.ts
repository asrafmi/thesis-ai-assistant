'use server'

import { createClient } from '@/lib/supabase/server'

export async function loginAction(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  return {}
}

export async function registerAction(
  email: string,
  password: string,
  fullName: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'Gagal membuat akun. Coba lagi.' }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: fullName,
  })

  if (profileError) {
    if (profileError.code === '23505') {
      return { error: 'Email ini sudah terdaftar. Silakan login.' }
    }
    return { error: profileError.message }
  }
  return {}
}
