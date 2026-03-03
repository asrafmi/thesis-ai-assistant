'use server'

// SERVER ACTIONS — Supabase calls only. No React hooks, no JSX.

import { createClient } from '@/lib/supabase/server'
import type { TemplateType } from '@/types/database.types'

export async function createThesisAction(data: {
  title: string
  university: string
  faculty: string
  supervisor: string
  year: number
  template_type: TemplateType
}) {
  const supabase = await createClient()
  // TODO: implement
}

export async function getThesisAction() {
  const supabase = await createClient()
  // TODO: implement
}
