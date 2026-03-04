// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

export function buildThesisPrompt(params: {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
}): string {
  return `Kamu adalah asisten penulisan skripsi akademik Indonesia.

Skripsi: "${params.thesisTitle}"
Bagian: "${params.sectionTitle}"
${params.existingContent ? `\nKonten saat ini:\n${params.existingContent}` : ''}

Instruksi dari mahasiswa: ${params.prompt}

Tulis konten akademik yang sesuai untuk bagian ini dalam Bahasa Indonesia.
Penting: JANGAN tulis ulang judul bagian atau heading di awal konten. Langsung tulis isi paragrafnya saja. Jangan gunakan markdown heading (#, ##, dll).`
}

export function textToTipTapContent(text: string): Record<string, unknown> {
  const paragraphs = text
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#'))
  return {
    type: 'doc',
    content: paragraphs.map((p) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: p }],
    })),
  }
}
