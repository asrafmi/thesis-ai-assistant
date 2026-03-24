// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getThesesAction, getThesisByIdAction, createThesisAction, deleteThesisAction } from '@/actions/thesis.actions'
import type { Thesis, TemplateType } from '@/types/thesis.types'

export function useTheses() {
  const [theses, setTheses] = useState<Thesis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getThesesAction().then((result) => {
      if (result.error) setError(result.error)
      else setTheses(result.data ?? [])
      setIsLoading(false)
    })
  }, [])

  async function refetch() {
    const result = await getThesesAction()
    if (!result.error) setTheses(result.data ?? [])
  }

  async function removeThesis(thesisId: string) {
    const result = await deleteThesisAction(thesisId)
    if (result.error) {
      setError(result.error)
      return false
    }
    setTheses((prev) => prev.filter((t) => t.id !== thesisId))
    return true
  }

  return { theses, isLoading, error, refetch, removeThesis }
}

export function useThesisById(thesisId: string | undefined) {
  const router = useRouter()
  const [thesis, setThesis] = useState<Thesis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!thesisId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    getThesisByIdAction(thesisId).then((result) => {
      if (result.error) {
        setError(result.error)
        router.push('/dashboard')
      } else {
        setThesis(result.data ?? null)
      }
      setIsLoading(false)
    })
  }, [thesisId, router])

  async function refetchThesis() {
    if (!thesisId) return
    const result = await getThesisByIdAction(thesisId)
    if (!result.error) setThesis(result.data ?? null)
  }

  return { thesis, isLoading, error, refetchThesis }
}

export function useCreateThesis() {
  const router = useRouter()
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
    setIsLoading(true)
    const result = await createThesisAction(data)
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      router.push(`/workspace?thesisId=${result.data.id}`)
    }
    setIsLoading(false)
  }

  return { createThesis, isLoading, error }
}
