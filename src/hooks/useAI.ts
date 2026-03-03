// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState } from 'react'

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false)

  async function generate(prompt: string, sectionId: string) {
    // TODO: call ai action
  }

  return { isGenerating, generate }
}
