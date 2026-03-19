// BUSINESS LOGIC LAYER — pure TypeScript. No React, no Next.js.
// Extracts figure information from section tree content for DAFTAR GAMBAR.

import type { SectionTree } from '@/types/thesis.types'

export interface FigureEntry {
  /** e.g. "Gambar 2.1" */
  label: string
  /** The caption text (without the label prefix) */
  caption: string
  /** Source attribution if any */
  source: string | null
  /** Section ID containing this image */
  sectionId: string
  /** Chapter number (level 1 ancestor) */
  chapter: number
  /** Sequential number within chapter */
  index: number
}

type TipTapNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
}

function extractImagesFromContent(content: Record<string, unknown> | null): TipTapNode[] {
  if (!content) return []
  const doc = content as { content?: TipTapNode[] }
  const images: TipTapNode[] = []

  function walk(nodes: TipTapNode[]) {
    for (const node of nodes) {
      if (node.type === 'image' && node.attrs?.caption) {
        images.push(node)
      }
      if (node.content) walk(node.content)
    }
  }

  walk(doc.content ?? [])
  return images
}

/**
 * Walk the section tree depth-first, collecting all captioned images.
 * Returns figures numbered per chapter (level-1 section).
 */
export function extractFigures(sections: SectionTree[]): FigureEntry[] {
  const figures: FigureEntry[] = []

  function walkSection(section: SectionTree, chapterIndex: number) {
    const images = extractImagesFromContent(section.content)
    for (const img of images) {
      const chapterFigCount = figures.filter((f) => f.chapter === chapterIndex).length + 1
      figures.push({
        label: `Gambar ${chapterIndex}.${chapterFigCount}`,
        caption: img.attrs?.caption as string,
        source: (img.attrs?.captionSource as string) ?? null,
        sectionId: section.id,
        chapter: chapterIndex,
        index: chapterFigCount,
      })
    }
    for (const child of section.children) {
      walkSection(child, chapterIndex)
    }
  }

  // Only count level-1 sections that are actual chapters (BAB)
  let chapterCounter = 0
  for (const root of sections) {
    if (root.level === 1 && root.title.startsWith('BAB')) {
      chapterCounter++
      walkSection(root, chapterCounter)
    }
  }

  return figures
}
