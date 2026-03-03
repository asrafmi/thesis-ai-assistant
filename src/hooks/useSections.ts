// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect } from 'react'
import type { SectionTree } from '@/types/thesis.types'

export function useSections(thesisId?: string) {
  const [sections, setSections] = useState<SectionTree[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function updateSectionContent(sectionId: string, content: Record<string, unknown>) {
    // TODO: call section action (debounced autosave)
  }

  return { sections, isLoading, updateSectionContent }
}
