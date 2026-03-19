'use server'

import { getAnthropicClient } from '@/lib/anthropic'

export async function generateCaptionAction(params: {
  description: string
  sectionTitle?: string
}): Promise<{ data?: string; error?: string }> {
  try {
    const message = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: params.description }],
      system: `Kamu adalah generator caption gambar untuk skripsi akademik.

ATURAN MUTLAK:
- Output HANYA 1 kalimat pendek (maks 10 kata), TIDAK ADA teks lain
- JANGAN bertanya balik atau memberi penjelasan
- JANGAN sertakan label "Gambar X.Y" — hanya isi deskripsinya
- JANGAN gunakan tanda kutip, bullet point, atau formatting apapun
- Bahasa Indonesia
- Contoh output yang benar: "Diagram alir metodologi penelitian kuantitatif"
- Contoh output yang benar: "Arsitektur sistem informasi berbasis web"

${params.sectionTitle ? `Konteks bagian: "${params.sectionTitle}"` : ''}`,
    })

    let text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    // Fallback: if AI returned too long a response, take only the first sentence
    if (text.length > 100) {
      const firstSentence = text.split(/[.!?\n]/)[0].trim()
      text = firstSentence.length > 0 ? firstSentence : text.slice(0, 80)
    }
    // Remove surrounding quotes if any
    text = text.replace(/^["'""]+|["'""]+$/g, '')
    return { data: text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate caption.' }
  }
}
