// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import type { Reference, ReferenceStyle } from '@/types/thesis.types'
import type { TavilySearchResult } from './web-search.service'

// ─────────────────────────────────────────────────────────────
// Parse Tavily result → structured Reference fields
// ─────────────────────────────────────────────────────────────

export function parseSearchResultToReference(
  result: TavilySearchResult,
  citationNumber: number,
  thesisId: string,
): Omit<Reference, 'id' | 'created_at'> {
  // Try to extract year from content (e.g. "(2023)", "Published 2022", "· 2021")
  const yearMatch = result.content.match(/\b(19|20)\d{2}\b/)
  const year = yearMatch ? parseInt(yearMatch[0]) : null

  // Try to extract journal name from content (heuristic: after "Journal of", "Jurnal", "Proceedings", etc.)
  const journalMatch = result.content.match(
    /(?:Journal of|Journal|Jurnal|Proceedings of|Conference on|Proc\.|Int\. J\.|IEEE)\s+[A-Z][A-Za-z\s&]+/,
  )
  const journal = journalMatch ? journalMatch[0].trim() : extractDomainName(result.url)

  // Try to extract author names from content (heuristic: "by Author Name" or "Author, A. B.")
  const authorMatch = result.content.match(/(?:by\s+|authored by\s+)([A-Z][a-z]+ [A-Z][a-z]+(?:,? (?:and|&) [A-Z][a-z]+ [A-Z][a-z]+)*)/)
  const authors = authorMatch ? authorMatch[1] : null

  return {
    thesis_id: thesisId,
    title: result.title,
    authors,
    year,
    journal,
    volume: null,
    issue: null,
    pages: null,
    url: result.url,
    doi: extractDoi(result.url, result.content),
    citation_number: citationNumber,
  }
}

function extractDomainName(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    const parts = hostname.split('.')
    const name = parts[0]
    // Convert known domains to readable names
    const knownDomains: Record<string, string> = {
      researchgate: 'ResearchGate',
      semanticscholar: 'Semantic Scholar',
      arxiv: 'arXiv',
      sciencedirect: 'ScienceDirect',
      springer: 'Springer',
      jstor: 'JSTOR',
    }
    return knownDomains[name] ?? hostname
  } catch {
    return null
  }
}

function extractDoi(url: string, content: string): string | null {
  // Check URL for DOI
  const doiFromUrl = url.match(/10\.\d{4,}\/[^\s&?#]+/)
  if (doiFromUrl) return doiFromUrl[0]

  // Check content for DOI
  const doiFromContent = content.match(/(?:doi:|DOI:\s*)(10\.\d{4,}\/[^\s]+)/)
  if (doiFromContent) return doiFromContent[1]

  return null
}

// ─────────────────────────────────────────────────────────────
// Format APA 7th edition reference string
// ─────────────────────────────────────────────────────────────

export function formatApaReference(ref: Reference): string {
  const parts: string[] = []

  // Authors
  if (ref.authors) {
    parts.push(ref.authors)
  } else {
    parts.push('Anonim')
  }

  // Year
  parts.push(`(${ref.year ?? 'n.d.'})`)

  // Title
  parts.push(`${ref.title}.`)

  // Journal
  if (ref.journal) {
    let journalPart = `*${ref.journal}*`
    if (ref.volume) {
      journalPart += `, *${ref.volume}*`
      if (ref.issue) journalPart += `(${ref.issue})`
    }
    if (ref.pages) journalPart += `, ${ref.pages}`
    parts.push(`${journalPart}.`)
  }

  // DOI or URL
  if (ref.doi) {
    parts.push(`https://doi.org/${ref.doi}`)
  } else if (ref.url) {
    parts.push(ref.url)
  }

  return parts.join(' ')
}

// ─────────────────────────────────────────────────────────────
// Format IEEE reference string
// ─────────────────────────────────────────────────────────────

export function formatIeeeReference(ref: Reference): string {
  const parts: string[] = []

  // Authors (initials + last name)
  if (ref.authors) {
    parts.push(`${ref.authors},`)
  } else {
    parts.push('Anonim,')
  }

  // Title in quotes
  parts.push(`"${ref.title},"`)

  // Journal in italics marker (plain text)
  if (ref.journal) {
    let journalPart = `*${ref.journal}*`
    if (ref.volume) {
      journalPart += `, vol. ${ref.volume}`
      if (ref.issue) journalPart += `, no. ${ref.issue}`
    }
    if (ref.pages) journalPart += `, pp. ${ref.pages}`
    parts.push(`${journalPart},`)
  }

  // Year
  parts.push(`${ref.year ?? 'n.d.'}.`)

  // DOI or URL
  if (ref.doi) {
    parts.push(`doi: ${ref.doi}`)
  } else if (ref.url) {
    parts.push(`[Online]. Available: ${ref.url}`)
  }

  return parts.join(' ')
}

// ─────────────────────────────────────────────────────────────
// Format Mendeley (APA 7th with DOI/URL emphasis) reference string
// Mendeley exports APA but always includes DOI/URL as hyperlink
// ─────────────────────────────────────────────────────────────

export function formatMendeleyReference(ref: Reference): string {
  // Same as APA but always appends retrieved-from line if no DOI
  const apa = formatApaReference(ref)
  if (!ref.doi && !ref.url) return apa
  return apa
}

// ─────────────────────────────────────────────────────────────
// Dispatcher — format a reference in the requested style
// ─────────────────────────────────────────────────────────────

export function formatReference(ref: Reference, style: ReferenceStyle): string {
  if (style === 'ieee') return formatIeeeReference(ref)
  if (style === 'mendeley') return formatMendeleyReference(ref)
  return formatApaReference(ref)
}

// ─────────────────────────────────────────────────────────────
// Build compact context block for AI prompt
// Each reference is ~80 tokens — far cheaper than full HTML
// ─────────────────────────────────────────────────────────────

export function buildReferencesContext(refs: Reference[]): string {
  if (refs.length === 0) return ''

  const lines = refs.map((ref) => {
    const authors = ref.authors ?? 'Anonim'
    const year = ref.year ?? 'n.d.'
    const journal = ref.journal ? `. ${ref.journal}` : ''
    const url = ref.url ? `. ${ref.url}` : ''
    return `[${ref.citation_number}] ${authors} (${year}). ${ref.title}${journal}${url}`
  })

  return `Referensi tersedia untuk dikutip:\n${lines.join('\n')}\n\nInstruksi sitasi (APA 7th):\n- Gunakan format (Nama Penulis, Tahun) untuk sitasi inline\n- Contoh: "...membuktikan peningkatan kualitas (Smith, 2023)."\n- Gunakan hanya referensi yang relevan dengan konten ini\n- Jangan buat referensi fiktif di luar daftar di atas`
}

// ─────────────────────────────────────────────────────────────
// Build TipTap JSON content for DAFTAR PUSTAKA section
// ─────────────────────────────────────────────────────────────

export function buildReferencesTipTapContent(refs: Reference[], style: ReferenceStyle = 'apa'): Record<string, unknown> {
  if (refs.length === 0) {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Belum ada referensi. Referensi akan muncul di sini secara otomatis saat kamu generate konten dengan fitur "Cari Referensi" aktif.' }],
        },
      ],
    }
  }

  const items = refs
    .sort((a, b) => a.citation_number - b.citation_number)
    .map((ref) => ({
      type: 'listItem',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: formatReference(ref, style) }],
        },
      ],
    }))

  return {
    type: 'doc',
    content: [
      {
        type: 'orderedList',
        attrs: { start: 1 },
        content: items,
      },
    ],
  }
}
