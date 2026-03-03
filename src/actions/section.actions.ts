'use server'

// SERVER ACTIONS — Supabase calls only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'

export async function getSectionsAction(thesisId: string) {
  const supabase = await createClient()
  // TODO: implement WITH RECURSIVE query
}

export async function updateSectionContentAction(sectionId: string, content: Record<string, unknown>) {
  const supabase = await createClient()
  // TODO: implement
}
