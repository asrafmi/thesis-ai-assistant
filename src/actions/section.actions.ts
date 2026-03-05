'use server'

// SERVER ACTIONS — Supabase calls only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'
import { buildSectionTree } from '@/services/section.service'
import type { Json } from '@/types/database.types'
import type { Section, SectionTree } from '@/types/thesis.types'

export async function addSectionAction(params: {
  thesis_id: string
  parent_id: string | null
  title: string
  level: number
  order_index: number
}): Promise<{ data?: Section; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sections')
    .insert({
      thesis_id: params.thesis_id,
      parent_id: params.parent_id,
      title: params.title,
      level: params.level,
      order_index: params.order_index,
      content: null,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as unknown as Section }
}

export async function renameSectionAction(
  sectionId: string,
  title: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sections')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', sectionId)

  if (error) return { error: error.message }
  return {}
}

export async function deleteSectionAction(sectionId: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  // ON DELETE CASCADE handles children automatically
  const { error } = await supabase.from('sections').delete().eq('id', sectionId)

  if (error) return { error: error.message }
  return {}
}

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
