'use server'

// SERVER ACTIONS — Anthropic API calls only. No React hooks, no JSX.

import Anthropic from '@anthropic-ai/sdk'
import { buildThesisPrompt } from '@/services/ai.service'
import type { Reference } from '@/types/thesis.types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateSectionContentAction(params: {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
  references?: Reference[]
}): Promise<{ data?: string; error?: string }> {
  try {
    const systemPrompt = buildThesisPrompt(params)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: systemPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return { data: text }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Gagal generate konten.' }
  }
}
