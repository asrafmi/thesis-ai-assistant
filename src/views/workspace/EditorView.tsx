'use client';

// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import type { SectionTree, Thesis, Profile } from '@/types/thesis.types';
import { TipTapEditor } from './TipTapEditor';

interface EditorViewProps {
  thesis: Thesis | null;
  profile: Profile | null;
  sections: SectionTree[];
  activeSectionId: string | null;
  streamingContent: Record<string, string>;
  onContentChange: (
    sectionId: string,
    content: Record<string, unknown>,
  ) => void;
  onSelectSection: (id: string) => void;
}

function CoverPage({ thesis, profile }: { thesis: Thesis | null; profile: Profile | null }) {
  return (
    <div className='flex flex-col items-center text-center py-10 mb-2 border border-border/40 rounded-lg bg-card/40 gap-3'>
      {/* University logo placeholder */}
      <div className='flex items-center justify-center w-20 h-20 rounded-full border-2 border-border bg-muted/50'>
        <GraduationCap size={36} className='text-muted-foreground/50' />
      </div>

      <div className='space-y-1'>
        <p className='text-xs uppercase tracking-widest text-muted-foreground'>
          {thesis?.university ?? '—'}
        </p>
        <p className='text-xs text-muted-foreground/70'>{thesis?.faculty ?? ''}</p>
      </div>

      <div className='w-16 border-t border-border/50' />

      <div className='max-w-sm space-y-1 px-4'>
        <p className='text-xs uppercase tracking-widest text-muted-foreground/60'>Skripsi</p>
        <h1 className='text-base font-bold text-foreground leading-snug'>
          {thesis?.title ?? 'Judul Skripsi'}
        </h1>
      </div>

      <div className='w-16 border-t border-border/50' />

      <div className='space-y-0.5'>
        <p className='text-sm font-medium text-foreground'>{profile?.full_name ?? '—'}</p>
        <p className='text-xs text-muted-foreground'>{profile?.nim ?? 'NIM'}</p>
      </div>

      <div className='space-y-0.5 text-xs text-muted-foreground/70'>
        {thesis?.supervisor && <p>Pembimbing: {thesis.supervisor}</p>}
        {thesis?.year && <p>{thesis.year}</p>}
      </div>
    </div>
  );
}

const HEADING_STYLES: Record<number, string> = {
  1: 'text-xl font-bold text-foreground mt-10 mb-2',
  2: 'text-base font-semibold text-foreground/90 mt-6 mb-1',
  3: 'text-sm font-medium text-foreground/80 mt-4 mb-1',
};

// Sections excluded from DAFTAR ISI (meta sections)
const META_SECTIONS = new Set(['DAFTAR PUSTAKA']);

function flattenForToc(
  sections: SectionTree[],
  depth = 0,
): { section: SectionTree; depth: number }[] {
  return sections.flatMap((s) => {
    if (META_SECTIONS.has(s.title)) return [];
    return [{ section: s, depth }, ...flattenForToc(s.children, depth + 1)];
  });
}

function DaftarIsiSection({ sections }: { sections: SectionTree[] }) {
  const entries = flattenForToc(sections);

  function scrollTo(id: string) {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div id='section-daftar-isi' className='mb-2'>
      <h2 className={HEADING_STYLES[1]}>DAFTAR ISI</h2>
      <div className='rounded-md px-3 py-3 bg-card/60'>
        {entries.length === 0 ? (
          <p className='text-xs text-muted-foreground/60 italic'>
            Belum ada bagian.
          </p>
        ) : (
          <div className='flex flex-col gap-1'>
            {entries.map(({ section, depth }) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className='flex items-baseline gap-1 text-left group w-full'
                style={{ paddingLeft: `${depth * 18}px` }}
              >
                <span
                  className={`text-sm group-hover:text-blue-400 transition-colors shrink-0 ${depth === 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                >
                  {section.title}
                </span>
                <span className='flex-1 border-b border-dotted border-border mb-0.75 min-w-2' />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  activeSectionId,
  streamingContent,
  onContentChange,
  onClickSection,
}: {
  section: SectionTree;
  activeSectionId: string | null;
  streamingContent: Record<string, string>;
  onContentChange: (
    sectionId: string,
    content: Record<string, unknown>,
  ) => void;
  onClickSection: (id: string) => void;
}) {
  const isActive = section.id === activeSectionId;
  const streamingText = streamingContent[section.id];
  const isStreaming = streamingText !== undefined;
  const headingClass = HEADING_STYLES[section.level] ?? HEADING_STYLES[3];

  return (
    <div
      id={`section-${section.id}`}
      onClick={(e) => {
        e.stopPropagation()
        onClickSection(section.id)
      }}
      className='mb-6 cursor-text'
    >
      <h2 className={headingClass}>{section.title}</h2>
      <div
        className={`rounded-md px-3 py-2 transition-colors ${
          isActive ? 'ring-1 ring-blue-600/40 bg-card/60' : 'bg-transparent'
        }`}
      >
        {isStreaming ? (
          <div className='text-sm leading-relaxed text-foreground min-h-15 whitespace-pre-wrap'>
            {streamingText}
            <span className='inline-block w-0.5 h-[1em] bg-primary align-middle ml-0.5 animate-pulse' />
          </div>
        ) : (
          <TipTapEditor
            content={section.content}
            isActive={isActive}
            onChange={(content) => onContentChange(section.id, content)}
            sectionTitle={section.title}
          />
        )}
      </div>
      {section.children.length > 0 && (
        <div className='ml-4 pl-3 border-l border-border/30'>
          {section.children.map((child) => (
            <SectionBlock
              key={child.id}
              section={child}
              activeSectionId={activeSectionId}
              streamingContent={streamingContent}
              onContentChange={onContentChange}
              onClickSection={onClickSection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function EditorView({
  thesis,
  profile,
  sections,
  activeSectionId,
  streamingContent,
  onContentChange,
  onSelectSection,
}: EditorViewProps) {
  useEffect(() => {
    if (!activeSectionId) return;
    const el = document.getElementById(`section-${activeSectionId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeSectionId]);

  if (sections.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
        Skripsi belum memiliki bagian.
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-auto bg-background'>
      <div className='max-w-3xl mx-auto px-12 py-10 pb-32'>
        <CoverPage thesis={thesis} profile={profile} />
        <DaftarIsiSection sections={sections} />
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            activeSectionId={activeSectionId}
            streamingContent={streamingContent}
            onContentChange={onContentChange}
            onClickSection={onSelectSection}
          />
        ))}
      </div>
    </div>
  );
}
