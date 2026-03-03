// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { SectionTree } from '@/types/thesis.types'

interface SidebarViewProps {
  sections: SectionTree[]
  activeSectionId: string | null
  onSelectSection: (id: string) => void
  onToggle: () => void
}

export function SidebarView({ sections, activeSectionId, onSelectSection, onToggle }: SidebarViewProps) {
  return (
    <aside className="w-56 border-r">
      <div>Sidebar</div>
    </aside>
  )
}
