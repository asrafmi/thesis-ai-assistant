'use server'

// SERVER ACTIONS — Supabase calls only. No React hooks, no JSX.

import { createClient, getAuthUser } from '@/lib/supabase/server'
import { buildDefaultSections, type DefaultSectionNode } from '@/services/thesis.service'
import type { Thesis, TemplateType } from '@/types/thesis.types'

export async function getThesisAction(): Promise<{ data?: Thesis; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { data, error } = await supabase
    .from('theses')
    .select('*')
    .eq('user_id', auth.userId)
    .maybeSingle()

  if (error) return { error: error.message }
  return { data: data ?? undefined }
}

export async function createThesisAction(data: {
  title: string
  university: string
  faculty: string
  supervisor: string
  year: number
  template_type: TemplateType
}): Promise<{ data?: Thesis; error?: string }> {
  const supabase = await createClient()
  const auth = await getAuthUser(supabase)
  if ('error' in auth) return auth

  const { data: thesis, error: thesisError } = await supabase
    .from('theses')
    .insert({ ...data, user_id: auth.userId })
    .select()
    .single()

  if (thesisError) return { error: thesisError.message }

  await insertSectionsRecursive(supabase, thesis.id, buildDefaultSections(), null)

  return { data: thesis }
}

async function insertSectionsRecursive(
  supabase: Awaited<ReturnType<typeof createClient>>,
  thesisId: string,
  nodes: DefaultSectionNode[],
  parentId: string | null,
) {
  for (const node of nodes) {
    const { data } = await supabase
      .from('sections')
      .insert({
        thesis_id: thesisId,
        parent_id: parentId,
        title: node.title,
        level: node.level,
        order_index: node.order_index,
        content: null,
      })
      .select('id')
      .single()

    if (data && node.children.length > 0) {
      await insertSectionsRecursive(supabase, thesisId, node.children, data.id)
    }
  }
}
