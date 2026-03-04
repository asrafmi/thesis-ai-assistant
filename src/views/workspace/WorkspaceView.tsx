// PRESENTATION LAYER. pure JSX only. No hooks, no business logic.

import { BookOpen, Sparkles, Save, Eye, Loader2 } from 'lucide-react';
import type { SectionTree, Thesis, Reference } from '@/types/thesis.types';
import { SidebarView } from './SidebarView';
import { PromptPanelView } from './PromptPanelView';
import { EditorView } from './EditorView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportPreviewModal } from '@/components/ExportPreviewModal';

interface WorkspaceViewProps {
  thesis: Thesis | null;
  sections: SectionTree[];
  activeSectionId: string | null;
  isSidebarOpen: boolean;
  isPromptPanelOpen: boolean;
  promptHistory: string[];
  isGenerating: boolean;
  isExporting: boolean;
  isLoading: boolean;
  isPreviewOpen: boolean;
  references: Reference[];
  isSearching: boolean;
  isSearchEnabled: boolean;
  searchError: string | null;
  onSelectSection: (id: string) => void;
  onToggleSidebar: () => void;
  onTogglePromptPanel: () => void;
  onGenerate: (prompt: string) => void;
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void;
  onExport: () => void;
  onOpenPreview: () => void;
  onClosePreview: () => void;
  onToggleSearch: () => void;
  onDeleteReference: (refId: string) => void;
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
  isPreviewOpen,
  references,
  isSearching,
  isSearchEnabled,
  searchError,
  onSelectSection,
  onToggleSidebar,
  onTogglePromptPanel,
  onGenerate,
  onContentChange,
  onExport,
  onOpenPreview,
  onClosePreview,
  onToggleSearch,
  onDeleteReference,
}: WorkspaceViewProps) {
  return (
    <div className='flex h-screen flex-col bg-background text-foreground'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 h-12 border-b border-border shrink-0'>
        <div className='flex items-center gap-3'>
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className='text-muted-foreground hover:text-foreground transition-colors'
              title='Buka sidebar'
              type='button'
            >
              <BookOpen size={15} />
            </button>
          )}
          {!isPromptPanelOpen && (
            <button
              onClick={onTogglePromptPanel}
              className='text-muted-foreground hover:text-foreground transition-colors'
              title='Buka AI prompt'
              type='button'
            >
              <Sparkles size={15} />
            </button>
          )}
        </div>

        <span className='text-sm text-muted-foreground font-medium truncate max-w-sm'>
          {thesis?.title ?? 'Workspace'}
        </span>

        <div className='flex items-center gap-3'>
          {isGenerating && (
            <span className='text-xs text-primary animate-pulse'>Generating...</span>
          )}
          <div className='flex items-center gap-1 text-xs text-muted-foreground/70'>
            <Save size={11} />
            <span>Autosave</span>
          </div>
          <ThemeToggle />
          <button
            onClick={onOpenPreview}
            disabled={isLoading}
            type='button'
            className='flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs text-foreground/90 hover:bg-muted/80 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
          >
            {isExporting ? (
              <Loader2 size={11} className='animate-spin' />
            ) : (
              <Eye size={11} />
            )}
            {isExporting ? 'Exporting...' : 'Preview & Export'}
          </button>
        </div>
      </header>

      {/* Body */}
      {isLoading ? (
        <div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
          Memuat skripsi...
        </div>
      ) : (
        <div className='flex flex-1 overflow-hidden'>
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
              references={references}
              isSearching={isSearching}
              isSearchEnabled={isSearchEnabled}
              searchError={searchError}
              onGenerate={onGenerate}
              onToggle={onTogglePromptPanel}
              onToggleSearch={onToggleSearch}
              onDeleteReference={onDeleteReference}
            />
          )}
          <EditorView
            sections={sections}
            activeSectionId={activeSectionId}
            isGenerating={isGenerating}
            onContentChange={onContentChange}
            onSelectSection={onSelectSection}
          />
        </div>
      )}

      <ExportPreviewModal
        thesis={thesis}
        sections={sections}
        isOpen={isPreviewOpen}
        isExporting={isExporting}
        onClose={onClosePreview}
        onExport={onExport}
      />
    </div>
  );
}
