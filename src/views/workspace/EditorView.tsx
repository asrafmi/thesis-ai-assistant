// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { SectionTree } from '@/types/thesis.types'
import { TipTapEditor } from './TipTapEditor'

interface EditorViewProps {
  sections: SectionTree[]
  activeSectionId: string | null
  isGenerating: boolean
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}

const HEADING_STYLES: Record<number, string> = {
  1: 'text-xl font-bold text-zinc-100 mt-10 mb-2',
  2: 'text-base font-semibold text-zinc-200 mt-6 mb-1',
  3: 'text-sm font-medium text-zinc-300 mt-4 mb-1',
}

const SKELETON_LINES = [100, 92, 97, 85, 94, 78, 88, 60]

function TypingSkeleton() {
  return (
    <div className="space-y-2.5 py-1 min-h-15">
      {SKELETON_LINES.map((width, i) => (
        <div
          key={i}
          className="h-3 rounded-sm bg-zinc-800 animate-pulse"
          style={{ width: `${width}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
      <div className="flex items-center gap-1">
        <div
          className="h-3 rounded-sm bg-zinc-800 animate-pulse"
          style={{ width: '38%', animationDelay: `${SKELETON_LINES.length * 120}ms` }}
        />
        <span
          className="inline-block h-3.5 w-0.5 rounded-sm bg-zinc-400 animate-pulse"
          style={{ animationDuration: '0.8s' }}
        />
      </div>
    </div>
  )
}

function SectionBlock({
  section,
  activeSectionId,
  isGenerating,
  onContentChange,
}: {
  section: SectionTree
  activeSectionId: string | null
  isGenerating: boolean
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}) {
  const isActive = section.id === activeSectionId
  const isWriting = isActive && isGenerating
  const headingClass = HEADING_STYLES[section.level] ?? HEADING_STYLES[3]

  return (
    <div id={`section-${section.id}`}>
      <h2 className={headingClass}>{section.title}</h2>
      <div
        className={`rounded-md px-3 py-2 transition-colors ${
          isActive ? 'ring-1 ring-blue-600/40 bg-zinc-900/60' : 'bg-transparent'
        }`}
      >
        {isWriting ? (
          <TypingSkeleton />
        ) : (
          <TipTapEditor
            content={section.content}
            isActive={isActive}
            onChange={(content) => onContentChange(section.id, content)}
          />
        )}
      </div>
      {section.children.map((child) => (
        <SectionBlock
          key={child.id}
          section={child}
          activeSectionId={activeSectionId}
          isGenerating={isGenerating}
          onContentChange={onContentChange}
        />
      ))}
    </div>
  )
}

export function EditorView({ sections, activeSectionId, isGenerating, onContentChange }: EditorViewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        Skripsi belum memiliki bagian.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-zinc-950">
      <div className="max-w-3xl mx-auto px-12 py-10 pb-32">
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            activeSectionId={activeSectionId}
            isGenerating={isGenerating}
            onContentChange={onContentChange}
          />
        ))}
      </div>
    </div>
  )
}
