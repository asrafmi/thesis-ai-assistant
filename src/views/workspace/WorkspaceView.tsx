// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import { BookOpen, Sparkles, Save, Download, Loader2 } from 'lucide-react'
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
  isExporting: boolean
  isLoading: boolean
  onSelectSection: (id: string) => void
  onToggleSidebar: () => void
  onTogglePromptPanel: () => void
  onGenerate: (prompt: string) => void
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
  onExport: () => void
}

export function WorkspaceView({
  thesis,
  sections,
  activeSectionId,
  isSidebarOpen,
  isPromptPanelOpen,
  promptHistory,
  isGenerating,
  isExporting,
  isLoading,
  onSelectSection,
  onToggleSidebar,
  onTogglePromptPanel,
  onGenerate,
  onContentChange,
  onExport,
}: WorkspaceViewProps) {
  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Buka sidebar"
            >
              <BookOpen size={15} />
            </button>
          )}
          {!isPromptPanelOpen && (
            <button
              onClick={onTogglePromptPanel}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Buka AI prompt"
            >
              <Sparkles size={15} />
            </button>
          )}
        </div>

        <span className="text-sm text-zinc-400 font-medium truncate max-w-sm">
          {thesis?.title ?? 'Workspace'}
        </span>

        <div className="flex items-center gap-3">
          {isGenerating && (
            <span className="text-xs text-blue-400 animate-pulse">Generating...</span>
          )}
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Save size={11} />
            <span>Autosave</span>
          </div>
          <button
            onClick={onExport}
            disabled={isExporting || isLoading}
            className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Download size={11} />
            )}
            {isExporting ? 'Exporting...' : 'Export .docx'}
          </button>
        </div>
      </header>

      {/* Body */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          Memuat skripsi...
        </div>
      ) : (
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
            isGenerating={isGenerating}
            onContentChange={onContentChange}
          />
        </div>
      )}
    </div>
  )
}
