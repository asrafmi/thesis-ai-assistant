// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import type { Section, SectionTree } from '@/types/thesis.types'

export function buildSectionTree(sections: Section[]): SectionTree[] {
  const map = new Map<string, SectionTree>()
  const roots: SectionTree[] = []

  sections.forEach((s) => map.set(s.id, { ...s, children: [] }))

  sections.forEach((s) => {
    const node = map.get(s.id)!
    if (s.parent_id === null) {
      roots.push(node)
    } else {
      const parent = map.get(s.parent_id)
      if (parent) parent.children.push(node)
    }
  })

  return roots.sort((a, b) => a.order_index - b.order_index)
}

export function computeSectionNumber(section: SectionTree, siblings: SectionTree[], parentNumber?: string): string {
  const index = siblings.findIndex((s) => s.id === section.id) + 1
  return parentNumber ? `${parentNumber}.${index}` : String(index)
}

export function renameSectionInTree(
  sections: SectionTree[],
  sectionId: string,
  title: string,
): SectionTree[] {
  return sections.map((section) => {
    if (section.id === sectionId) return { ...section, title }
    if (section.children.length > 0) {
      return { ...section, children: renameSectionInTree(section.children, sectionId, title) }
    }
    return section
  })
}

export function removeSectionFromTree(sections: SectionTree[], sectionId: string): SectionTree[] {
  return sections
    .filter((s) => s.id !== sectionId)
    .map((s) => ({
      ...s,
      children: removeSectionFromTree(s.children, sectionId),
    }))
}

export function updateSectionContentInTree(
  sections: SectionTree[],
  sectionId: string,
  content: Record<string, unknown>,
): SectionTree[] {
  return sections.map((section) => {
    if (section.id === sectionId) return { ...section, content }
    if (section.children.length > 0) {
      return { ...section, children: updateSectionContentInTree(section.children, sectionId, content) }
    }
    return section
  })
}
