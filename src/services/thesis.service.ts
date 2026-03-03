// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import type { Thesis } from '@/types/thesis.types'
import type { TemplateType } from '@/types/database.types'

export function buildDefaultSections(thesisId: string) {
  // Returns default section tree for a new thesis (Bab I–V)
  return []
}

export function validateThesisData(data: {
  title: string
  template_type: TemplateType
}): string | null {
  if (!data.title.trim()) return 'Judul skripsi wajib diisi'
  return null
}
