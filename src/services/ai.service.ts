// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import type { Reference } from '@/types/thesis.types'
import { buildReferencesContext } from './reference.service'

export function buildThesisPrompt(params: {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
  references?: Reference[]
}): string {
  const refContext = params.references && params.references.length > 0
    ? `\n\n${buildReferencesContext(params.references)}`
    : ''

  return `Kamu adalah asisten penulisan skripsi akademik Indonesia.

Skripsi: "${params.thesisTitle}"
Bagian: "${params.sectionTitle}"
${params.existingContent ? `\nKonten saat ini:\n${params.existingContent}` : ''}${refContext}

Instruksi dari mahasiswa: ${params.prompt}

Tulis konten akademik yang sesuai untuk bagian ini dalam Bahasa Indonesia.
Penting: JANGAN tulis ulang judul bagian atau heading di awal konten. Langsung tulis isi paragrafnya saja. Jangan gunakan markdown heading (#, ##, dll).`
}

type InlineNode = { type: 'text'; text: string; marks?: { type: string }[] }

function parseInline(line: string): InlineNode[] {
  const nodes: InlineNode[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: line.slice(lastIndex, match.index) })
    }
    if (match[1] !== undefined) {
      nodes.push({ type: 'text', text: match[1], marks: [{ type: 'bold' }] })
    } else {
      nodes.push({ type: 'text', text: match[2], marks: [{ type: 'italic' }] })
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < line.length) {
    nodes.push({ type: 'text', text: line.slice(lastIndex) })
  }
  return nodes.length ? nodes : [{ type: 'text', text: '' }]
}

export function textToTipTapContent(text: string): Record<string, unknown> {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  return {
    type: 'doc',
    content: lines.map((line) => ({
      type: 'paragraph',
      content: parseInline(line),
    })),
  }
}
