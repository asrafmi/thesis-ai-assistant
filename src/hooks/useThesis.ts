// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getThesisAction, createThesisAction } from '@/actions/thesis.actions'
import type { Thesis, TemplateType } from '@/types/thesis.types'

export function useThesis() {
  const router = useRouter()
  const [thesis, setThesis] = useState<Thesis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getThesisAction().then((result) => {
      if (result.error) setError(result.error)
      else setThesis(result.data ?? null)
      setIsLoading(false)
    })
  }, [])

  async function createThesis(data: {
    title: string
    university: string
    faculty: string
    supervisor: string
    year: number
    template_type: TemplateType
  }) {
    setIsLoading(true)
    const result = await createThesisAction(data)
    if (result.error) {
      setError(result.error)
    } else {
      setThesis(result.data ?? null)
      router.push('/workspace')
    }
    setIsLoading(false)
  }

  async function refetchThesis() {
    const result = await getThesisAction()
    if (!result.error) setThesis(result.data ?? null)
  }

  return { thesis, isLoading, error, createThesis, refetchThesis }
}
