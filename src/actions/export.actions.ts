'use server'

// SERVER ACTIONS — Supabase + docx. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { buildSectionTree } from '@/services/section.service'
import { buildDocxFromThesis } from '@/services/docx.service'

import type { Section } from '@/types/thesis.types'

export async function exportThesisDocxAction(): Promise<{ data?: string; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  // Check export limit for free plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', auth.userId)
    .single()

  if (!profile) return { error: 'Profile tidak ditemukan' }

  if (profile.plan === 'free') {
    return { error: 'Export hanya tersedia di paket Starter atau Full. Upgrade untuk melanjutkan.' }
  }

  const { data: thesis, error: thesisError } = await supabase
    .from('theses')
    .select('*')
    .eq('user_id', auth.userId)
    .maybeSingle()

  if (thesisError) return { error: thesisError.message }
  if (!thesis) return { error: 'Thesis tidak ditemukan' }

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('thesis_id', thesis.id)
    .order('order_index')

  if (sectionsError) return { error: sectionsError.message }

  const tree = buildSectionTree(sections as unknown as Section[])
  const base64 = await buildDocxFromThesis(thesis, tree)

  // Record the export
  await supabase.from('exports').insert({
    thesis_id: thesis.id,
    user_id: auth.userId,
    file_url: 'local',
  })

  return { data: base64 }
}
