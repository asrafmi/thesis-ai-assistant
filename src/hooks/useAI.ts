// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState } from 'react'
import { generateSectionContentAction } from '@/actions/ai.actions'
import type { Reference } from '@/types/thesis.types'

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(params: {
    prompt: string
    sectionTitle: string
    thesisTitle: string
    existingContent?: string
    references?: Reference[]
  }): Promise<string | null> {
    setIsGenerating(true)
    setError(null)
    const result = await generateSectionContentAction(params)
    setIsGenerating(false)
    if (result.error) {
      setError(result.error)
      return null
    }
    return result.data ?? null
  }

  return { isGenerating, error, generate }
}
