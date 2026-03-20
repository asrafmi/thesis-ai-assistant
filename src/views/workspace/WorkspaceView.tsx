// PRESENTATION LAYER. pure JSX only. No hooks, no business logic.

import { BookOpen, Sparkles, Save, Eye, Loader2, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import type { SectionTree, Thesis, Profile, Reference, ReferenceStyle } from '@/types/thesis.types';
import type { UsageData } from '@/lib/limits';
import { SidebarView } from './SidebarView';
import { PromptPanelView } from './PromptPanelView';
import { EditorView } from './EditorView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportPreviewModal } from '@/components/ExportPreviewModal';
import { UpgradeModal, type UpgradeReason } from '@/components/UpgradeModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkspaceViewProps {
  thesis: Thesis | null;
  profile: Profile | null;
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
  onRenameSection: (sectionId: string, title: string) => void;
  onAddSection: (parentId: string | null, title: string, level: number) => void;
  onDeleteSection: (sectionId: string) => void;
  streamingContent: Record<string, string>;
  onGenerate: (prompt: string) => void;
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void;
  onExport: () => void;
  onOpenPreview: () => void;
  onClosePreview: () => void;
  onToggleSearch: () => void;
  onDeleteReference: (refId: string) => void;
  onChangeReferenceStyle: (style: ReferenceStyle) => void;
  onLogout: () => void;
  usage: UsageData | null;
  isUpgradeOpen: boolean;
  upgradeReason: UpgradeReason;
  onCloseUpgrade: () => void;
  onSettings: () => void;
  onDashboard: () => void;
}

export function WorkspaceView({
  thesis,
  profile,
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
  onRenameSection,
  onAddSection,
  onDeleteSection,
  streamingContent,
  onGenerate,
  onContentChange,
  onExport,
  onOpenPreview,
  onClosePreview,
  onToggleSearch,
  onDeleteReference,
  onChangeReferenceStyle,
  onLogout,
  usage,
  isUpgradeOpen,
  upgradeReason,
  onCloseUpgrade,
  onSettings,
  onDashboard,
}: WorkspaceViewProps) {
  return (
    <div className='flex h-dvh flex-col bg-background text-foreground'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 h-12 border-b border-border shrink-0'>
        {/* Left: panel toggles (desktop only) */}
        <div className='hidden md:flex items-center gap-3'>
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

        {/* Title */}
        <span className='text-sm text-muted-foreground font-medium truncate max-w-40 md:max-w-sm'>
          {thesis?.title ?? 'Workspace'}
        </span>

        {/* Right */}
        <div className='flex items-center gap-2 md:gap-3'>
          {isGenerating && (
            <span className='hidden md:inline text-xs text-primary animate-pulse'>Generating...</span>
          )}
          <div className='hidden md:flex items-center gap-1 text-xs text-muted-foreground/70'>
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
            <span className='hidden sm:inline'>{isExporting ? 'Exporting...' : 'Preview & Export'}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex items-center justify-center rounded-full w-7 h-7 bg-muted hover:bg-muted/80 transition-colors'
                title='User menu'
              >
                <User size={13} className='text-muted-foreground' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDashboard}
                className='text-foreground focus:text-foreground cursor-pointer'
              >
                <LayoutDashboard size={13} className='mr-2' />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSettings}
                className='text-foreground focus:text-foreground cursor-pointer'
              >
                <Settings size={13} className='mr-2' />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className='text-destructive focus:text-destructive cursor-pointer'
              >
                <LogOut size={13} className='mr-2' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Body */}
      {isLoading ? (
        <div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
          Memuat skripsi...
        </div>
      ) : (
        <div className='flex flex-1 overflow-hidden relative'>
          {/* Sidebar — desktop: static panel | mobile: overlay drawer */}
          {isSidebarOpen && (
            <>
              {/* Mobile backdrop */}
              <div
                className='md:hidden fixed inset-0 z-20 bg-black/50'
                onClick={onToggleSidebar}
              />
              <div className='fixed md:static inset-y-0 left-0 z-30 md:z-auto top-12 md:top-auto h-[calc(100dvh-3rem)] md:h-full'>
                <SidebarView
                  sections={sections}
                  activeSectionId={activeSectionId}
                  onSelectSection={(id) => { onSelectSection(id); if (window.innerWidth < 768) onToggleSidebar(); }}
                  onToggle={onToggleSidebar}
                  onRenameSection={onRenameSection}
                  onAddSection={onAddSection}
                  onDeleteSection={onDeleteSection}
                />
              </div>
            </>
          )}

          {/* Prompt panel — desktop: static panel | mobile: overlay drawer from right */}
          {isPromptPanelOpen && (
            <>
              {/* Mobile backdrop */}
              <div
                className='md:hidden fixed inset-0 z-20 bg-black/50'
                onClick={onTogglePromptPanel}
              />
              <div className='fixed md:static inset-y-0 right-0 z-30 md:z-auto top-12 md:top-auto h-[calc(100dvh-3rem)] md:h-full'>
                <PromptPanelView
                  activeSectionId={activeSectionId}
                  promptHistory={promptHistory}
                  isGenerating={isGenerating}
                  references={references}
                  isSearching={isSearching}
                  isSearchEnabled={isSearchEnabled}
                  searchError={searchError}
                  usage={usage}
                  referenceStyle={thesis?.reference_style ?? 'apa'}
                  onGenerate={onGenerate}
                  onToggle={onTogglePromptPanel}
                  onToggleSearch={onToggleSearch}
                  onDeleteReference={onDeleteReference}
                  onChangeReferenceStyle={onChangeReferenceStyle}
                />
              </div>
            </>
          )}

          <EditorView
            thesis={thesis}
            profile={profile}
            sections={sections}
            activeSectionId={activeSectionId}
            streamingContent={streamingContent}
            onContentChange={onContentChange}
            onSelectSection={onSelectSection}
          />
        </div>
      )}

      {/* Mobile bottom bar */}
      <nav className='md:hidden flex items-center justify-around border-t border-border bg-background px-4 py-2 shrink-0'>
        <button
          type='button'
          onClick={onToggleSidebar}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${isSidebarOpen ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <BookOpen size={18} />
          <span className='text-[10px]'>Struktur</span>
        </button>
        <button
          type='button'
          onClick={onTogglePromptPanel}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${isPromptPanelOpen ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {isGenerating ? <Loader2 size={18} className='animate-spin' /> : <Sparkles size={18} />}
          <span className='text-[10px]'>AI</span>
        </button>
        <div className='flex items-center gap-1 text-muted-foreground/60'>
          <Save size={14} />
          <span className='text-[10px]'>Autosave</span>
        </div>
      </nav>

      <ExportPreviewModal
        thesis={thesis}
        sections={sections}
        isOpen={isPreviewOpen}
        isExporting={isExporting}
        onClose={onClosePreview}
        onExport={onExport}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        reason={upgradeReason}
        onClose={onCloseUpgrade}
      />
    </div>
  );
}
