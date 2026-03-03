// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useCallback } from 'react'
import { useWorkspaceStore } from '@/store/workspace.store'
import { useThesis } from './useThesis'
import { useSections } from './useSections'
import { useAI } from './useAI'

export function useWorkspace() {
  const { thesis } = useThesis()
  const { sections, updateSectionContent } = useSections()
  const { generate, isGenerating } = useAI()
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
      if (!activeSectionId) return
      addPromptHistory(prompt)
      await generate(prompt, activeSectionId)
    },
    [activeSectionId, generate, addPromptHistory]
  )

  return {
    thesis,
    sections,
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
  }
}
