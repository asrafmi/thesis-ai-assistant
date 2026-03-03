'use server'

// SERVER ACTIONS — export processing only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'
import { buildDocxStructure } from '@/services/export.service'

export async function exportThesisAction(thesisId: string) {
  const supabase = await createClient()
  // TODO: implement docx generation and upload to Supabase Storage
}
