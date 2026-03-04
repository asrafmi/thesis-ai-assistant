'use client'

import { useEffect, useState } from 'react'
import { X, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import type { JSONContent } from '@tiptap/core'
import type { SectionTree, Thesis } from '@/types/thesis.types'

interface ExportPreviewModalProps {
  thesis: Thesis | null
  sections: SectionTree[]
  isOpen: boolean
  isExporting: boolean
  onClose: () => void
  onExport: () => void
}

const META_SECTIONS = new Set(['DAFTAR PUSTAKA'])

function toHTML(content: Record<string, unknown> | null): string {
  if (!content) return ''
  try {
    return generateHTML(content as JSONContent, [StarterKit, Image])
  } catch {
    return ''
  }
}

function flattenForToc(sections: SectionTree[], depth = 0): { section: SectionTree; depth: number }[] {
  return sections.flatMap((s) => {
    if (META_SECTIONS.has(s.title)) return []
    return [{ section: s, depth }, ...flattenForToc(s.children, depth + 1)]
  })
}

// --- Page types ---
type PreviewPage =
  | { type: 'cover'; thesis: Thesis }
  | { type: 'toc'; entries: { section: SectionTree; depth: number }[] }
  | { type: 'section'; section: SectionTree }

function buildPages(
  thesis: Thesis | null,
  sections: SectionTree[],
  tocEntries: { section: SectionTree; depth: number }[],
): PreviewPage[] {
  const pages: PreviewPage[] = []
  if (thesis) pages.push({ type: 'cover', thesis })
  if (tocEntries.length > 0) pages.push({ type: 'toc', entries: tocEntries })
  sections.forEach((s) => pages.push({ type: 'section', section: s }))
  return pages
}

// --- Page renderers ---
const HEADING_STYLES: Record<number, string> = {
  1: 'text-sm font-bold uppercase mt-8 mb-2 text-black',
  2: 'text-xs font-semibold mt-5 mb-1 text-black',
  3: 'text-xs font-medium mt-3 mb-1 text-black',
}

function SectionContent({ section }: { section: SectionTree }) {
  const html = toHTML(section.content)
  return (
    <div>
      <h2 className={HEADING_STYLES[section.level] ?? HEADING_STYLES[3]}>{section.title}</h2>
      {html && (
        <div className="preview-content text-gray-800" dangerouslySetInnerHTML={{ __html: html }} />
      )}
      {section.children.map((child) => (
        <SectionContent key={child.id} section={child} />
      ))}
    </div>
  )
}

function CoverPage({ thesis }: { thesis: Thesis }) {
  return (
    <div className="flex flex-col justify-between" style={{ minHeight: '900px' }}>
      <div className="text-center pt-8">
        {thesis.university && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
            {thesis.university}
          </p>
        )}
        {thesis.faculty && (
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">{thesis.faculty}</p>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-black mb-6">Skripsi</p>
        <h1 className="text-xl font-bold leading-snug text-black max-w-md mx-auto">
          {thesis.title}
        </h1>
      </div>
      <div className="text-center pb-8">
        {thesis.supervisor && (
          <p className="text-xs text-gray-600">
            Pembimbing: <span className="font-medium">{thesis.supervisor}</span>
          </p>
        )}
        {thesis.year && <p className="text-xs text-gray-500 mt-2">{thesis.year}</p>}
      </div>
    </div>
  )
}

function TocPage({ entries }: { entries: { section: SectionTree; depth: number }[] }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase text-black mb-6">Daftar Isi</h2>
      <div className="flex flex-col gap-1.5">
        {entries.map(({ section, depth }) => (
          <div
            key={section.id}
            className="flex items-baseline gap-1"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <span className={`text-xs shrink-0 ${depth === 0 ? 'font-semibold text-black' : 'text-gray-500'}`}>
              {section.title}
            </span>
            <span className="flex-1 border-b border-dotted border-gray-300 mb-0.5 min-w-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Modal ---
export function ExportPreviewModal({
  thesis,
  sections,
  isOpen,
  isExporting,
  onClose,
  onExport,
}: ExportPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const tocEntries = flattenForToc(sections)
  const pages = buildPages(thesis, sections, tocEntries)
  const total = pages.length

  function handleClose() {
    setCurrentPage(0)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrentPage((p) => Math.min(p + 1, total - 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrentPage((p) => Math.max(p - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, total])

  if (!isOpen || total === 0) return null

  const page = pages[currentPage]

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative flex flex-col m-4 md:m-10 bg-background rounded-xl shadow-2xl overflow-hidden flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <span className="text-sm font-medium text-foreground">Preview Dokumen</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">← → untuk navigasi</span>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-zinc-200 py-8 px-4">
          <div
            className="bg-white text-black w-full max-w-175 mx-auto shadow-xl rounded-sm overflow-x-hidden px-16 py-14"
            style={{ minHeight: '990px' }}
          >
            {page.type === 'cover' && <CoverPage thesis={page.thesis} />}
            {page.type === 'toc' && <TocPage entries={page.entries} />}
            {page.type === 'section' && <SectionContent section={page.section} />}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </button>
            <span className="text-xs text-muted-foreground px-2">
              {currentPage + 1} / {total}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, total - 1))}
              disabled={currentPage === total - 1}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onExport}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              {isExporting ? 'Exporting...' : 'Export .docx'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
