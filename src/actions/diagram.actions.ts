'use server'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateDiagramAction(params: {
  prompt: string
  sectionTitle?: string
}): Promise<{ data?: string; error?: string }> {
  try {
    const systemPrompt = `Kamu adalah asisten untuk membuat diagram akademik skripsi menggunakan Mermaid.js syntax.

Tugas kamu:
1. Baca deskripsi diagram dari user
2. Generate HANYA Mermaid code yang valid, tanpa penjelasan tambahan
3. Gunakan diagram type yang paling sesuai (flowchart, sequenceDiagram, classDiagram, dll)
4. Pastikan syntax valid dan bisa dirender

${params.sectionTitle ? `Konteks: diagram ini untuk bagian "${params.sectionTitle}"` : ''}

PENTING:
- Output HANYA berisi Mermaid code saja, tidak ada teks lain
- Jangan sertakan backtick (\`\`\`) atau kata "mermaid" di awal
- Mulai langsung dengan keyword diagram (flowchart, graph, sequenceDiagram, dll)
- Gunakan bahasa Indonesia untuk label/teks di dalam diagram
- Untuk flowchart gunakan: flowchart TD atau flowchart LR`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: params.prompt }],
      system: systemPrompt,
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    return { data: text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate diagram.' }
  }
}
