'use server'

// SERVER ACTIONS — Supabase + docx. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { buildSectionTree } from '@/services/section.service'
import { buildDocxFromThesis } from '@/services/docx.service'
import { EXPORT_LIMIT_FREE, EXPORT_LIMIT_STARTER } from '@/lib/limits'

import type { Section } from '@/types/thesis.types'

export async function exportThesisDocxAction(): Promise<{ data?: string; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  // Check export limit per plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', auth.userId)
    .single()

  if (!profile) return { error: 'Profile tidak ditemukan' }

  const exportLimit = profile.plan === 'free' ? EXPORT_LIMIT_FREE
    : profile.plan === 'starter' ? EXPORT_LIMIT_STARTER
    : null // full = unlimited

  if (exportLimit !== null) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { count } = await supabase
      .from('exports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.userId)
      .gte('created_at', startOfMonth)

    if ((count ?? 0) >= exportLimit) {
      return { error: `Batas export ${exportLimit}x/bulan tercapai. Upgrade paket untuk melanjutkan.` }
    }
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
