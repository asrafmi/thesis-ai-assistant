'use server'

// SERVER ACTIONS — Supabase + Tavily calls only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'
import { searchAcademicPapers } from '@/services/web-search.service'
import {
  parseSearchResultToReference,
  buildReferencesTipTapContent,
} from '@/services/reference.service'
import type { Reference } from '@/types/thesis.types'
import type { Json } from '@/types/database.types'

export async function getReferencesAction(
  thesisId: string,
): Promise<{ data?: Reference[]; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('thesis_references')
    .select('*')
    .eq('thesis_id', thesisId)
    .order('citation_number')

  if (error) return { error: error.message }
  return { data: (data as unknown as Reference[]) ?? [] }
}

export async function searchAndAddReferencesAction(
  thesisId: string,
  query: string,
): Promise<{ data?: Reference[]; error?: string }> {
  const supabase = await createClient()

  // Fetch existing URLs to avoid duplicates
  const { data: existing } = await supabase
    .from('thesis_references')
    .select('url, citation_number')
    .eq('thesis_id', thesisId)

  const existingUrls = new Set((existing ?? []).map((r) => r.url).filter(Boolean))
  const maxCitationNumber = (existing ?? []).reduce(
    (max, r) => Math.max(max, r.citation_number ?? 0),
    0,
  )

  // Search Tavily
  let searchResults
  try {
    searchResults = await searchAcademicPapers(query)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal mencari referensi.' }
  }

  // Filter out duplicates and build new refs
  let nextCitationNumber = maxCitationNumber + 1
  const newRefs = searchResults
    .filter((r) => r.url && !existingUrls.has(r.url))
    .map((r) => {
      const ref = parseSearchResultToReference(r, nextCitationNumber, thesisId)
      nextCitationNumber++
      return ref
    })

  if (newRefs.length > 0) {
    const { error: insertError } = await supabase.from('thesis_references').insert(newRefs)
    if (insertError) return { error: insertError.message }
  }

  // Return all refs for this thesis (including newly added)
  return getReferencesAction(thesisId)
}

export async function deleteReferenceAction(
  refId: string,
  thesisId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from('thesis_references').delete().eq('id', refId)
  if (error) return { error: error.message }

  // Renumber remaining refs
  const { data: remaining } = await supabase
    .from('thesis_references')
    .select('id')
    .eq('thesis_id', thesisId)
    .order('citation_number')

  if (remaining) {
    for (let i = 0; i < remaining.length; i++) {
      await supabase
        .from('thesis_references')
        .update({ citation_number: i + 1 })
        .eq('id', remaining[i].id)
    }
  }

  return {}
}

export async function updateReferenceSectionAction(thesisId: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  // Fetch all refs
  const { data: refs, error: refsError } = await supabase
    .from('thesis_references')
    .select('*')
    .eq('thesis_id', thesisId)
    .order('citation_number')

  if (refsError) return { error: refsError.message }

  const content = buildReferencesTipTapContent((refs as unknown as Reference[]) ?? [])

  // Check if DAFTAR PUSTAKA section already exists
  const { data: existing } = await supabase
    .from('sections')
    .select('id')
    .eq('thesis_id', thesisId)
    .eq('title', 'DAFTAR PUSTAKA')
    .maybeSingle()

  if (existing) {
    // Update existing section
    const { error: updateError } = await supabase
      .from('sections')
      .update({ content: content as Json, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    if (updateError) return { error: updateError.message }
  } else {
    // Create DAFTAR PUSTAKA section for existing theses that predate the template update
    const { data: lastSection } = await supabase
      .from('sections')
      .select('order_index')
      .eq('thesis_id', thesisId)
      .is('parent_id', null)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextOrderIndex = lastSection ? lastSection.order_index + 1 : 5

    const { error: insertError } = await supabase.from('sections').insert({
      thesis_id: thesisId,
      parent_id: null,
      title: 'DAFTAR PUSTAKA',
      content: content as Json,
      level: 1,
      order_index: nextOrderIndex,
    })

    if (insertError) return { error: insertError.message }
  }

  return {}
}
