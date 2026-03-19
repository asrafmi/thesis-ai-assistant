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
      system: `Kamu membuat caption singkat untuk gambar di skripsi akademik.

Tugas:
- Buat caption deskriptif yang ringkas (1 kalimat, maks 15 kata)
- Caption harus bisa dipahami tanpa membaca teks utama
- JANGAN sertakan label "Gambar X.Y" — hanya isi deskripsinya saja
- Gunakan bahasa Indonesia
- Output HANYA caption text, tanpa tanda kutip atau penjelasan

${params.sectionTitle ? `Konteks bagian: "${params.sectionTitle}"` : ''}`,
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    return { data: text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate caption.' }
  }
}
