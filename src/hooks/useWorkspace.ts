// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspace.store'
import { textToTipTapContent } from '@/services/ai.service'
import type { SectionTree } from '@/types/thesis.types'
import { useThesis } from './useThesis'
import { useSections } from './useSections'
import { useAI } from './useAI'
import { useExport } from './useExport'

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
  const { sections, isLoading: sectionsLoading, updateSectionContent } = useSections(thesis?.id)
  const { generate, isGenerating } = useAI()
  const { exportDocx, isExporting } = useExport()

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

      const existingContent = activeSection.content
        ? JSON.stringify(activeSection.content)
        : undefined

      const generatedText = await generate({
        prompt,
        sectionTitle: activeSection.title,
        thesisTitle: thesis.title,
        existingContent,
      })

      if (generatedText) {
        updateSectionContent(activeSectionId, textToTipTapContent(generatedText))
      }
    },
    [activeSectionId, thesis, sections, generate, addPromptHistory, updateSectionContent],
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
    onSelectSection: setActiveSectionId,
    onToggleSidebar: toggleSidebar,
    onTogglePromptPanel: togglePromptPanel,
    onGenerate: handleGenerate,
    onContentChange: updateSectionContent,
    onExport: () => exportDocx(thesis?.title ?? 'skripsi'),
    isExporting,
  }
}
