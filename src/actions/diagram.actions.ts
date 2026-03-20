'use server'

import { getAnthropicClient } from '@/lib/anthropic'
import { createClient, getAuthUser } from '@/lib/supabase/server'
import { DIAGRAM_LIMIT_FREE, DIAGRAM_LIMIT_STARTER } from '@/lib/limits'

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export async function generateDiagramAction(params: {
  prompt: string
  sectionTitle?: string
  sectionContent?: string
}): Promise<{ data?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const auth = await getAuthUser(supabase)
    if ('error' in auth) return auth

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, diagram_count, diagram_count_reset_at')
      .eq('id', auth.userId)
      .single()

    if (!profile) return { error: 'Profile tidak ditemukan' }

    const now = new Date()
    const resetAt = profile.diagram_count_reset_at ? new Date(profile.diagram_count_reset_at) : null
    let currentCount = profile.diagram_count

    // Reset if new month
    if (!resetAt || !isSameMonth(resetAt, now)) {
      currentCount = 0
      await supabase
        .from('profiles')
        .update({ diagram_count: 0, diagram_count_reset_at: now.toISOString() })
        .eq('id', auth.userId)
    }

    // Check limit per plan
    const limit = profile.plan === 'free' ? DIAGRAM_LIMIT_FREE
      : profile.plan === 'starter' ? DIAGRAM_LIMIT_STARTER
      : null // full = unlimited

    if (limit !== null && currentCount >= limit) {
      return { error: `Batas generate diagram ${limit}x/bulan tercapai. Upgrade paket untuk melanjutkan.` }
    }

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

    // Increment diagram count
    await supabase
      .from('profiles')
      .update({ diagram_count: currentCount + 1 })
      .eq('id', auth.userId)

    return { data: text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate diagram.' }
  }
}
