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
  ImageRun,
} from 'docx'
import sharp from 'sharp'
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

async function fetchImageBuffer(src: string): Promise<{ buffer: Buffer; width: number; height: number } | null> {
  try {
    let buffer: Buffer

    if (src.startsWith('data:image/svg+xml;base64,')) {
      const base64 = src.replace('data:image/svg+xml;base64,', '')
      const svgBuffer = Buffer.from(base64, 'base64')
      buffer = await sharp(svgBuffer).png().toBuffer()
    } else if (src.startsWith('data:image/')) {
      const base64 = src.split(',')[1]
      buffer = Buffer.from(base64, 'base64')
    } else {
      console.log('[fetchImageBuffer] fetching URL:', src.slice(0, 80))
      const res = await fetch(src)
      console.log('[fetchImageBuffer] status:', res.status)
      if (!res.ok) return null
      buffer = Buffer.from(await res.arrayBuffer())
    }

    const meta = await sharp(buffer).metadata()
    return {
      buffer,
      width: meta.width ?? 400,
      height: meta.height ?? 300,
    }
  } catch (err) {
    console.error('[fetchImageBuffer] error:', err)
    return null
  }
}

async function contentToDocxNodes(content: TipTapNode[]): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = []

  for (const node of content) {
    if (node.type === 'paragraph') {
      const runs = (node.content ?? []).flatMap(nodeToRuns)
      paragraphs.push(
        new Paragraph({
          children: runs.length ? runs : [new TextRun({ text: '', font: FONT, size: BODY_SIZE })],
          alignment: AlignmentType.JUSTIFIED,
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
    } else if (node.type === 'image') {
      const src = node.attrs?.src as string | undefined
      const width = (node.attrs?.width as number | null) ?? 400
      const align = (node.attrs?.align as string) ?? 'center'
      const alignMap: Record<string, (typeof AlignmentType)[keyof typeof AlignmentType]> = {
        left: AlignmentType.LEFT,
        center: AlignmentType.CENTER,
        right: AlignmentType.RIGHT,
      }
      if (src) {
        const img = await fetchImageBuffer(src)
        if (img) {
          // Scale height proportionally to the user-set width
          const scaledHeight = Math.round((img.height / img.width) * width)
          paragraphs.push(
            new Paragraph({
              alignment: alignMap[align] ?? AlignmentType.LEFT,
              spacing: { before: 120, after: 120 },
              children: [
                new ImageRun({
                  data: img.buffer,
                  transformation: { width, height: scaledHeight },
                  type: 'png',
                }),
              ],
            }),
          )
        }
      }
    }
  }

  return paragraphs
}

async function sectionToDocxNodes(section: SectionTree, depth = 0): Promise<Paragraph[]> {
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
    const bodyNodes = await contentToDocxNodes(doc.content ?? [])
    nodes.push(...bodyNodes)
  }

  for (const child of section.children) {
    nodes.push(...(await sectionToDocxNodes(child, depth + 1)))
  }

  return nodes
}

function makeCoverPage(thesis: Thesis): Paragraph[] {
  const cp = (text: string, size: number, bold = false, before = 0, after = 200): Paragraph =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: FONT, size: size * 2, bold })],
      spacing: { before, after },
    })

  return [
    // Top: institution
    cp(thesis.university ?? '', 12, false, 0, 160),
    cp(thesis.faculty ?? '', 12, false, 0, 3800),  // big gap → pushes title to ~middle
    // Middle: thesis label + title
    cp('SKRIPSI', 14, true, 0, 400),
    cp(thesis.title, 14, true, 0, 3800),            // big gap → pushes supervisor to ~bottom
    // Bottom: supervisor + year
    cp(`Pembimbing: ${thesis.supervisor ?? '-'}`, 12, false, 0, 200),
    cp(String(thesis.year ?? new Date().getFullYear()), 12),
    new Paragraph({ children: [new PageBreak()] }),
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
  const bodyNodes = (await Promise.all(sections.map((s) => sectionToDocxNodes(s)))).flat()

  const doc = new Document({
    styles: {
      default: {
        heading1: { run: { color: '000000', font: FONT } },
        heading2: { run: { color: '000000', font: FONT } },
        heading3: { run: { color: '000000', font: FONT } },
      },
    },
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
