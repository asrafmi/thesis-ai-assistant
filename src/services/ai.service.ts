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

Tulis konten akademik yang sesuai untuk bagian ini dalam Bahasa Indonesia.`
}
