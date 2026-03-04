// PRESENTATION LAYER. pure JSX only. No hooks, no business logic.

import { BookOpen, X } from 'lucide-react';
import type { SectionTree } from '@/types/thesis.types';

interface SidebarViewProps {
  sections: SectionTree[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onToggle: () => void;
}

function SectionItem({
  section,
  activeSectionId,
  onSelectSection,
}: {
  section: SectionTree;
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
}) {
  const isActive = section.id === activeSectionId;
  const isChapter = section.level === 1;

  return (
    <div>
      <button
        type='button'
        onClick={() => onSelectSection(section.id)}
        className={[
          'w-full text-left rounded-md transition-colors',
          isChapter
            ? 'px-3 py-1.5 mt-2 text-xs font-semibold'
            : 'py-1 pl-6 pr-3 text-xs font-normal',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        ].join(' ')}
      >
        {section.title}
      </button>

      {section.children.map((child) => (
        <SectionItem
          key={child.id}
          section={child}
          activeSectionId={activeSectionId}
          onSelectSection={onSelectSection}
        />
      ))}
    </div>
  );
}

export function SidebarView({
  sections,
  activeSectionId,
  onSelectSection,
  onToggle,
}: SidebarViewProps) {
  return (
    <aside className='w-56 shrink-0 border-r border-border bg-background flex flex-col h-full'>
      <div className='flex items-center justify-between px-3 py-3 border-b border-border'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <BookOpen size={13} />
          <span className='text-xs font-medium uppercase tracking-wider'>
            Struktur
          </span>
        </div>

        <button
          type='button'
          onClick={onToggle}
          className='text-muted-foreground/70 hover:text-foreground transition-colors'
          title='Tutup'
        >
          <X size={14} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-2'>
        {sections.length === 0 ? (
          <p className='text-muted-foreground text-xs px-3 py-4'>
            Belum ada bagian.
          </p>
        ) : (
          sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              activeSectionId={activeSectionId}
              onSelectSection={onSelectSection}
            />
          ))
        )}
      </div>
    </aside>
  );
}
