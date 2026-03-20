import { NextRequest } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { createClient } from '@/lib/supabase/server'
import { buildThesisPrompt } from '@/services/ai.service'
import { WORD_LIMIT_FREE } from '@/lib/limits'
import type { Reference } from '@/types/thesis.types'

const anthropic = getAnthropicClient()

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // Fetch profile and check limit for free plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, word_count, word_count_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile) return new Response('Profile tidak ditemukan', { status: 404 })

  const now = new Date()
  const resetAt = profile.word_count_reset_at ? new Date(profile.word_count_reset_at) : null
  let currentWordCount = profile.word_count

  // Reset if new month
  if (!resetAt || !isSameMonth(resetAt, now)) {
    currentWordCount = 0
    await supabase
      .from('profiles')
      .update({ word_count: 0, word_count_reset_at: now.toISOString() })
      .eq('id', user.id)
  }

  // Block if free plan and over limit
  if (profile.plan === 'free' && currentWordCount >= WORD_LIMIT_FREE) {
    return new Response('Batas 3.000 kata bulanan tercapai. Upgrade paket untuk melanjutkan.', { status: 429 })
  }

  const params: {
    prompt: string
    sectionTitle: string
    thesisTitle: string
    existingContent?: string
    references?: Reference[]
  } = await req.json()

  const systemPrompt = buildThesisPrompt(params)

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: systemPrompt }],
  })

  const encoder = new TextEncoder()
  let fullText = ''

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullText += event.delta.text
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }

        // Count words generated and update profile
        if (profile.plan === 'free' && fullText.trim()) {
          const wordsGenerated = fullText.trim().split(/\s+/).filter(Boolean).length
          await supabase
            .from('profiles')
            .update({ word_count: currentWordCount + wordsGenerated })
            .eq('id', user.id)
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
