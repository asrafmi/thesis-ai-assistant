// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Packer,
  LevelFormat,
  TableOfContents,
} from 'docx'
import type { Thesis, SectionTree } from '@/types/thesis.types'

// 1 cm ≈ 567 twip
const CM = 567
const MARGIN_LEFT = 4 * CM   // 4 cm
const MARGIN_OTHER = 3 * CM  // 3 cm
const FONT = 'Times New Roman'
const BODY_SIZE = 24          // 12pt (half-points)
const LINE_SPACING = 360      // 1.5 × 240

type TipTapMark = { type: string }
type TipTapNode = {
  type: string
  text?: string
  marks?: TipTapMark[]
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
}

function nodeToRuns(node: TipTapNode): TextRun[] {
  if (node.type === 'text') {
    const bold = node.marks?.some((m) => m.type === 'bold') ?? false
    const italics = node.marks?.some((m) => m.type === 'italic') ?? false
    const strike = node.marks?.some((m) => m.type === 'strike') ?? false
    return [new TextRun({ text: node.text ?? '', bold, italics, strike, font: FONT, size: BODY_SIZE })]
  }
  return (node.content ?? []).flatMap(nodeToRuns)
}

function contentToDocxNodes(content: TipTapNode[]): Paragraph[] {
  const paragraphs: Paragraph[] = []

  for (const node of content) {
    if (node.type === 'paragraph') {
      const runs = (node.content ?? []).flatMap(nodeToRuns)
      paragraphs.push(
        new Paragraph({
          children: runs.length ? runs : [new TextRun({ text: '', font: FONT, size: BODY_SIZE })],
          spacing: { line: LINE_SPACING, after: 120 },
        }),
      )
    } else if (node.type === 'heading') {
      const level = (node.attrs?.level as number) ?? 1
      const headingMap = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 }
      const runs = (node.content ?? []).flatMap(nodeToRuns)
      paragraphs.push(
        new Paragraph({
          heading: headingMap[level as 1 | 2 | 3] ?? HeadingLevel.HEADING_3,
          children: runs,
          spacing: { before: 240, after: 120 },
        }),
      )
    } else if (node.type === 'bulletList') {
      for (const item of node.content ?? []) {
        const runs = (item.content ?? []).flatMap((p) => (p.content ?? []).flatMap(nodeToRuns))
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: runs,
            spacing: { line: LINE_SPACING },
          }),
        )
      }
    } else if (node.type === 'orderedList') {
      for (const item of node.content ?? []) {
        const runs = (item.content ?? []).flatMap((p) => (p.content ?? []).flatMap(nodeToRuns))
        paragraphs.push(
          new Paragraph({
            numbering: { reference: 'ordered-list', level: 0 },
            children: runs,
            spacing: { line: LINE_SPACING },
          }),
        )
      }
    }
  }

  return paragraphs
}

function sectionToDocxNodes(section: SectionTree, depth = 0): Paragraph[] {
  const nodes: Paragraph[] = []

  const headingMap = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 }

  nodes.push(
    new Paragraph({
      heading: headingMap[section.level as 1 | 2 | 3] ?? HeadingLevel.HEADING_3,
      children: [new TextRun({ text: section.title, font: FONT, bold: section.level === 1 })],
      spacing: { before: section.level === 1 ? 480 : 240, after: 120 },
    }),
  )

  if (section.content) {
    const doc = section.content as { content?: TipTapNode[] }
    const bodyNodes = contentToDocxNodes(doc.content ?? [])
    nodes.push(...bodyNodes)
  }

  for (const child of section.children) {
    nodes.push(...sectionToDocxNodes(child, depth + 1))
  }

  return nodes
}

function makeCoverPage(thesis: Thesis): Paragraph[] {
  const centered = (text: string, size: number, bold = false, spacingAfter = 160): Paragraph =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: FONT, size: size * 2, bold })],
      spacing: { after: spacingAfter },
    })

  return [
    centered(thesis.university ?? '', 12),
    centered(thesis.faculty ?? '', 12),
    new Paragraph({ children: [], spacing: { after: 800 } }),
    centered('SKRIPSI', 14, true, 400),
    centered(thesis.title, 14, true, 800),
    centered(`Pembimbing: ${thesis.supervisor ?? '-'}`, 12, false, 200),
    centered(String(thesis.year ?? new Date().getFullYear()), 12),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ]
}

function makeTocPage() {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'DAFTAR ISI', font: FONT, bold: true })],
      spacing: { before: 0, after: 240 },
    }),
    new TableOfContents('DAFTAR ISI', {
      headingStyleRange: '1-3',
      hyperlink: true,
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ]
}

export async function buildDocxFromThesis(thesis: Thesis, sections: SectionTree[]): Promise<string> {
  const coverNodes = makeCoverPage(thesis)
  const tocNodes = makeTocPage()
  const bodyNodes = sections.flatMap((s) => sectionToDocxNodes(s))

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'ordered-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGIN_OTHER,
              bottom: MARGIN_OTHER,
              left: MARGIN_LEFT,
              right: MARGIN_OTHER,
            },
          },
        },
        children: [...coverNodes, ...tocNodes, ...bodyNodes],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer).toString('base64')
}
