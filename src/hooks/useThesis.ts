// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect } from 'react'
import type { Thesis } from '@/types/thesis.types'
import type { TemplateType } from '@/types/database.types'

export function useThesis() {
  const [thesis, setThesis] = useState<Thesis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createThesis(data: {
    title: string
    university: string
    faculty: string
    supervisor: string
    year: number
    template_type: TemplateType
  }) {
    // TODO: call thesis action
  }

  return { thesis, isLoading, error, createThesis }
}
