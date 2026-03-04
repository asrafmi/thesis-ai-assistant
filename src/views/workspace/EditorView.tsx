// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { SectionTree } from '@/types/thesis.types'
import { TipTapEditor } from './TipTapEditor'

interface EditorViewProps {
  sections: SectionTree[]
  activeSectionId: string | null
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}

const HEADING_STYLES: Record<number, string> = {
  1: 'text-xl font-bold text-zinc-100 mt-10 mb-2',
  2: 'text-base font-semibold text-zinc-200 mt-6 mb-1',
  3: 'text-sm font-medium text-zinc-300 mt-4 mb-1',
}

function SectionBlock({
  section,
  activeSectionId,
  onContentChange,
}: {
  section: SectionTree
  activeSectionId: string | null
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}) {
  const isActive = section.id === activeSectionId
  const headingClass = HEADING_STYLES[section.level] ?? HEADING_STYLES[3]

  return (
    <div id={`section-${section.id}`}>
      <h2 className={headingClass}>{section.title}</h2>
      <div
        className={`rounded-md px-3 py-2 transition-colors ${
          isActive ? 'ring-1 ring-blue-600/40 bg-zinc-900/60' : 'bg-transparent'
        }`}
      >
        <TipTapEditor
          content={section.content}
          isActive={isActive}
          onChange={(content) => onContentChange(section.id, content)}
        />
      </div>
      {section.children.map((child) => (
        <SectionBlock
          key={child.id}
          section={child}
          activeSectionId={activeSectionId}
          onContentChange={onContentChange}
        />
      ))}
    </div>
  )
}

export function EditorView({ sections, activeSectionId, onContentChange }: EditorViewProps) {
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
            onContentChange={onContentChange}
          />
        ))}
      </div>
    </div>
  )
}
