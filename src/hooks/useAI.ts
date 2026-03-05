// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState } from 'react'
import type { Reference } from '@/types/thesis.types'
import { apiClient } from '@/lib/axios'

interface GenerateParams {
  prompt: string
  sectionTitle: string
  thesisTitle: string
  existingContent?: string
  references?: Reference[]
}

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(
    params: GenerateParams,
    onChunk: (accumulated: string) => void,
  ): Promise<string | null> {
    setIsGenerating(true)
    setError(null)

    try {
      let accumulated = ''

      await apiClient.post('/api/ai/generate', params, {
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const xhr = progressEvent.event?.target as XMLHttpRequest
          accumulated = xhr?.response ?? ''
          onChunk(accumulated)
        },
      })

      return accumulated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal generate konten.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { isGenerating, error, generate }
}
