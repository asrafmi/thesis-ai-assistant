'use server'

// SERVER ACTIONS — Anthropic API calls only. No React hooks, no JSX.

import Anthropic from '@anthropic-ai/sdk'
import { buildThesisPrompt } from '@/services/ai.service'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateSectionContentAction(params: {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
}) {
  const systemPrompt = buildThesisPrompt(params)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: systemPrompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
