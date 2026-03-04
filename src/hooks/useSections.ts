// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect, useRef } from 'react'
import { getSectionsAction, updateSectionContentAction } from '@/actions/section.actions'
import { updateSectionContentInTree } from '@/services/section.service'
import type { SectionTree } from '@/types/thesis.types'

export function useSections(thesisId?: string) {
  const [sections, setSections] = useState<SectionTree[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!thesisId) return
    setIsLoading(true)
    getSectionsAction(thesisId).then((result) => {
      if (result.data) setSections(result.data)
      setIsLoading(false)
    })
  }, [thesisId])

  function updateSectionContent(sectionId: string, content: Record<string, unknown>) {
    setSections((prev) => updateSectionContentInTree(prev, sectionId, content))
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateSectionContentAction(sectionId, content)
    }, 2000)
  }

  return { sections, isLoading, updateSectionContent }
}
