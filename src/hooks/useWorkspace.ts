// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspace.store'
import { textToTipTapContent } from '@/services/ai.service'
import { updateReferenceSectionAction } from '@/actions/reference.actions'
import type { SectionTree } from '@/types/thesis.types'
import { useThesis } from './useThesis'
import { useSections } from './useSections'
import { useAI } from './useAI'
import { useExport } from './useExport'
import { useReferences } from './useReferences'

function findSectionById(sections: SectionTree[], id: string): SectionTree | null {
  for (const section of sections) {
    if (section.id === id) return section
    const found = findSectionById(section.children, id)
    if (found) return found
  }
  return null
}

export function useWorkspace() {
  const router = useRouter()
  const { thesis, isLoading: thesisLoading } = useThesis()
  const { sections, isLoading: sectionsLoading, updateSectionContent, refetch: refetchSections } = useSections(thesis?.id)
  const { generate, isGenerating } = useAI()
  const { exportDocx, isExporting } = useExport()
  const {
    references,
    isSearching,
    isSearchEnabled,
    searchError,
    toggleSearch,
    searchAndAdd,
    deleteReference,
  } = useReferences(thesis?.id)

  useEffect(() => {
    if (!thesisLoading && thesis === null) router.push('/onboarding')
  }, [thesisLoading, thesis, router])
  const {
    activeSectionId,
    isSidebarOpen,
    isPromptPanelOpen,
    promptHistory,
    setActiveSectionId,
    toggleSidebar,
    togglePromptPanel,
    addPromptHistory,
  } = useWorkspaceStore()

  const handleGenerate = useCallback(
    async (prompt: string) => {
      if (!activeSectionId || !thesis) return
      const activeSection = findSectionById(sections, activeSectionId)
      if (!activeSection) return

      addPromptHistory(prompt)

      // 1. Search for references if enabled
      let currentRefs = references
      if (isSearchEnabled) {
        currentRefs = await searchAndAdd(prompt)
      }

      const existingContent = activeSection.content
        ? JSON.stringify(activeSection.content)
        : undefined

      // 2. Generate with references context
      const generatedText = await generate({
        prompt,
        sectionTitle: activeSection.title,
        thesisTitle: thesis.title,
        existingContent,
        references: currentRefs.length > 0 ? currentRefs : undefined,
      })

      if (generatedText) {
        updateSectionContent(activeSectionId, textToTipTapContent(generatedText))

        // 3. Update DAFTAR PUSTAKA section; refetch if it didn't exist yet
        if (currentRefs.length > 0) {
          const hasRefSection = sections.some((s) => s.title === 'DAFTAR PUSTAKA')
          updateReferenceSectionAction(thesis.id).then(() => {
            if (!hasRefSection) refetchSections()
          })
        }
      }
    },
    [
      activeSectionId,
      thesis,
      sections,
      references,
      isSearchEnabled,
      generate,
      addPromptHistory,
      updateSectionContent,
      searchAndAdd,
    ],
  )

  return {
    thesis,
    sections,
    isLoading: thesisLoading || sectionsLoading,
    activeSectionId,
    isSidebarOpen,
    isPromptPanelOpen,
    promptHistory,
    isGenerating,
    references,
    isSearching,
    isSearchEnabled,
    searchError,
    onSelectSection: setActiveSectionId,
    onToggleSidebar: toggleSidebar,
    onTogglePromptPanel: togglePromptPanel,
    onGenerate: handleGenerate,
    onContentChange: updateSectionContent,
    onExport: () => exportDocx(thesis?.title ?? 'skripsi'),
    onToggleSearch: toggleSearch,
    onDeleteReference: deleteReference,
    isExporting,
  }
}
