// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useCallback, useEffect, useState } from 'react'
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
import { useAuth } from './useAuth'
import { useUsage } from './useUsage'

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [streamingContent, setStreamingContent] = useState<Record<string, string>>({})
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; reason: 'words' | 'exports' }>({
    isOpen: false,
    reason: 'words',
  })
  const { thesis, isLoading: thesisLoading } = useThesis()
  const { sections, isLoading: sectionsLoading, updateSectionContent, renameSection, addSection, deleteSection, refetch: refetchSections } = useSections(thesis?.id)
  const { generate, isGenerating } = useAI()
  const { logout } = useAuth()
  const { exportDocx, isExporting } = useExport()
  const { usage, refetchUsage } = useUsage()
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

      // Block and show upgrade modal if free word limit reached
      if (usage?.plan === 'free' && usage.wordCount >= usage.wordLimit) {
        setUpgradeModal({ isOpen: true, reason: 'words' })
        return
      }
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

      // 2. Stream generate with references context
      const sectionId = activeSectionId
      setStreamingContent((prev) => ({ ...prev, [sectionId]: '' }))

      const generatedText = await generate(
        {
          prompt,
          sectionTitle: activeSection.title,
          thesisTitle: thesis.title,
          existingContent,
          references: currentRefs.length > 0 ? currentRefs : undefined,
        },
        (accumulated) => {
          setStreamingContent((prev) => ({ ...prev, [sectionId]: accumulated }))
        },
      )

      setStreamingContent((prev) => {
        const next = { ...prev }
        delete next[sectionId]
        return next
      })

      if (generatedText) {
        updateSectionContent(sectionId, textToTipTapContent(generatedText))

        // 3. Update DAFTAR PUSTAKA section; refetch if it didn't exist yet
        if (currentRefs.length > 0) {
          const hasRefSection = sections.some((s) => s.title === 'DAFTAR PUSTAKA')
          updateReferenceSectionAction(thesis.id).then(() => {
            if (!hasRefSection) refetchSections()
          })
        }
      }

      // 4. Refresh usage counter
      refetchUsage()
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
      setStreamingContent,
      refetchUsage,
      usage,
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
    isPreviewOpen,
    onOpenPreview: () => setIsPreviewOpen(true),
    onClosePreview: () => setIsPreviewOpen(false),
    onExport: async () => {
      if (usage?.plan === 'free' && (usage.exportCount ?? 0) >= usage.exportLimit) {
        setUpgradeModal({ isOpen: true, reason: 'exports' })
        return
      }
      await exportDocx(thesis?.title ?? 'skripsi')
      refetchUsage()
    },
    onToggleSearch: toggleSearch,
    onDeleteReference: deleteReference,
    isExporting,
    onRenameSection: renameSection,
    onAddSection: addSection,
    onDeleteSection: deleteSection,
    streamingContent,
    onLogout: logout,
    usage,
    isUpgradeOpen: upgradeModal.isOpen,
    upgradeReason: upgradeModal.reason,
    onCloseUpgrade: () => setUpgradeModal((prev) => ({ ...prev, isOpen: false })),
  }
}
