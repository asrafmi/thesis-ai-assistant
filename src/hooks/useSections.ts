// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect, useRef } from 'react'
import {
  getSectionsAction,
  updateSectionContentAction,
  addSectionAction,
  renameSectionAction,
  deleteSectionAction,
} from '@/actions/section.actions'
import {
  updateSectionContentInTree,
  renameSectionInTree,
  removeSectionFromTree,
} from '@/services/section.service'
import type { SectionTree } from '@/types/thesis.types'

function getMaxOrderIndex(siblings: SectionTree[]): number {
  if (siblings.length === 0) return 0
  return Math.max(...siblings.map((s) => s.order_index))
}

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

  async function renameSection(sectionId: string, title: string) {
    setSections((prev) => renameSectionInTree(prev, sectionId, title))
    await renameSectionAction(sectionId, title)
  }

  async function addSection(parentId: string | null, title: string, level: number) {
    if (!thesisId) return
    const siblings =
      parentId === null
        ? sections
        : (() => {
            function findChildren(nodes: SectionTree[], id: string): SectionTree[] {
              for (const n of nodes) {
                if (n.id === id) return n.children
                const found = findChildren(n.children, id)
                if (found.length > 0 || n.id === id) return found
              }
              return []
            }
            return findChildren(sections, parentId)
          })()
    const orderIndex = getMaxOrderIndex(siblings) + 1

    const result = await addSectionAction({
      thesis_id: thesisId,
      parent_id: parentId,
      title,
      level,
      order_index: orderIndex,
    })
    if (!result.error) await refetch()
  }

  async function deleteSection(sectionId: string) {
    setSections((prev) => removeSectionFromTree(prev, sectionId))
    await deleteSectionAction(sectionId)
  }

  async function refetch() {
    if (!thesisId) return
    const result = await getSectionsAction(thesisId)
    if (result.data) setSections(result.data)
  }

  return { sections, isLoading, updateSectionContent, renameSection, addSection, deleteSection, refetch }
}
