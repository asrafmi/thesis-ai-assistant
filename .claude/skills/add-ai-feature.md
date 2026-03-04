When adding a new AI generation feature:

1. SERVICE (src/services/ai.service.ts) — add prompt builder function
   - Pure function, returns string
   - Build prompt in Bahasa Indonesia
   - Include context: thesis title, section title, existing content if any
   - Example: buildThesisPrompt(), buildOutlinePrompt()

2. ACTION (src/actions/ai.actions.ts) — call Anthropic API
   - model: 'claude-sonnet-4-6'
   - max_tokens: 2048 (increase for longer outputs, e.g. 4096 for full chapter)
   - Call service function to build prompt — don't inline prompt strings in action
   - Return string content, not raw API response

3. HOOK (src/hooks/useAI.ts) — manage generation state
   - Expose: generate(params), isGenerating, error
   - setIsGenerating(true) before action call, false in finally block
   - Clear error at start of each generation

4. Content format: generated text should be stored as TipTap JSON (jsonb)
   in sections.content — not plain text strings
   Convert markdown → TipTap JSON before saving

5. Save via updateSectionContentAction after generation

Example action structure:
```ts
'use server'

import Anthropic from '@anthropic-ai/sdk'
import { buildThesisPrompt } from '@/services/ai.service'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateSectionContentAction(params: {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
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
```

Reference: src/actions/ai.actions.ts, src/services/ai.service.ts
