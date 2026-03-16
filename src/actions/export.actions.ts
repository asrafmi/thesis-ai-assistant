'use server'

// SERVER ACTIONS — Supabase + docx. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { buildSectionTree } from '@/services/section.service'
import { buildDocxFromThesis } from '@/services/docx.service'
import { EXPORT_LIMIT_FREE } from '@/lib/limits'
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
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { count: exportCount } = await supabase
      .from('exports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.userId)
      .gte('created_at', startOfMonth)

    if ((exportCount ?? 0) >= EXPORT_LIMIT_FREE) {
      return { error: 'Batas 3 export bulanan tercapai. Upgrade ke Pro untuk melanjutkan.' }
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
  const allContent = JSON.stringify(tree)
  console.log('[export] has image:', allContent.includes('"image"'))
  console.log('[export] image nodes:', allContent.match(/"type":"image"/g)?.length ?? 0)
  const imgNodeMatch = allContent.match(/"type":"image","attrs":\{[^}]*\}/)
  console.log('[export] first image node:', imgNodeMatch?.[0]?.slice(0, 150))
  const base64 = await buildDocxFromThesis(thesis, tree)

  // Record the export
  await supabase.from('exports').insert({
    thesis_id: thesis.id,
    user_id: auth.userId,
    file_url: 'local',
  })

  return { data: base64 }
}
