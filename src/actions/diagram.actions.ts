'use server'

import { getAnthropicClient } from '@/lib/anthropic'

export async function generateDiagramAction(params: {
  prompt: string
  sectionTitle?: string
  sectionContent?: string
}): Promise<{ data?: string; error?: string }> {
  try {
    const systemPrompt = `Kamu adalah generator Mermaid.js diagram. Kamu HANYA boleh output Mermaid code yang valid.

ATURAN MUTLAK:
- Output HANYA berisi Mermaid code, TIDAK ADA teks lain sama sekali
- JANGAN pernah bertanya balik, minta klarifikasi, atau memberi penjelasan
- JANGAN sertakan backtick (\`\`\`) atau kata "mermaid"
- Mulai langsung dengan keyword diagram (flowchart, graph, sequenceDiagram, dll)
- Jika deskripsi kurang detail, TETAP buat diagram terbaik yang bisa kamu buat berdasarkan konteks
- Gunakan bahasa Indonesia untuk label/teks di dalam diagram
- Untuk flowchart gunakan: flowchart TD atau flowchart LR
- Pastikan syntax valid dan bisa dirender oleh mermaid.js

${params.sectionTitle ? `Konteks bagian: "${params.sectionTitle}"` : ''}
${params.sectionContent ? `\nIsi konten bagian:\n${params.sectionContent}` : ''}`

    const message = await getAnthropicClient().messages.create({
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
