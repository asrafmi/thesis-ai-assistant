// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { SectionTree } from '@/types/thesis.types'

interface EditorViewProps {
  sections: SectionTree[]
  activeSectionId: string | null
  onContentChange: (sectionId: string, content: Record<string, unknown>) => void
}

export function EditorView({ sections, activeSectionId, onContentChange }: EditorViewProps) {
  return (
    <div className="flex-1 overflow-auto p-8">
      <div>Editor</div>
    </div>
  )
}
