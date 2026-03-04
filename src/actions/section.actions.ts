'use server'

// SERVER ACTIONS — Supabase calls only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'
import { buildSectionTree } from '@/services/section.service'
import type { Json } from '@/types/database.types'
import type { Section, SectionTree } from '@/types/thesis.types'

export async function getSectionsAction(thesisId: string): Promise<{ data?: SectionTree[]; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('thesis_id', thesisId)
    .order('order_index')

  if (error) return { error: error.message }
  return { data: buildSectionTree(data as unknown as Section[]) }
}

export async function updateSectionContentAction(
  sectionId: string,
  content: Record<string, unknown>,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sections')
    .update({ content: content as Json, updated_at: new Date().toISOString() })
    .eq('id', sectionId)

  if (error) return { error: error.message }
  return {}
}
