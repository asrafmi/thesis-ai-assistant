// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { SectionTree, Thesis } from '@/types/thesis.types'
import { SidebarView } from './SidebarView'
import { PromptPanelView } from './PromptPanelView'
import { EditorView } from './EditorView'

interface WorkspaceViewProps {
  thesis: Thesis | null
  sections: SectionTree[]
  activeSectionId: string | null
  isSidebarOpen: boolean
  isPromptPanelOpen: boolean
  promptHistory: string[]
  isGenerating: boolean
  onSelectSection: (id: string) => void
  onToggleSidebar: () => void
  onTogglePromptPanel: () => void
  onGenerate: (prompt: string) => void
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}

export function WorkspaceView({
  thesis,
  sections,
  activeSectionId,
  isSidebarOpen,
  isPromptPanelOpen,
  promptHistory,
  isGenerating,
  onSelectSection,
  onToggleSidebar,
  onTogglePromptPanel,
  onGenerate,
  onContentChange,
}: WorkspaceViewProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <SidebarView
            sections={sections}
            activeSectionId={activeSectionId}
            onSelectSection={onSelectSection}
            onToggle={onToggleSidebar}
          />
        )}
        {isPromptPanelOpen && (
          <PromptPanelView
            activeSectionId={activeSectionId}
            promptHistory={promptHistory}
            isGenerating={isGenerating}
            onGenerate={onGenerate}
            onToggle={onTogglePromptPanel}
          />
        )}
        <EditorView
          sections={sections}
          activeSectionId={activeSectionId}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  )
}
