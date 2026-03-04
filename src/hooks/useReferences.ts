// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect, useCallback } from 'react'
import {
  getReferencesAction,
  searchAndAddReferencesAction,
  deleteReferenceAction,
} from '@/actions/reference.actions'
import type { Reference } from '@/types/thesis.types'

export function useReferences(thesisId: string | undefined) {
  const [references, setReferences] = useState<Reference[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchEnabled, setIsSearchEnabled] = useState(true)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (!thesisId) return
    getReferencesAction(thesisId).then((result) => {
      if (result.data) setReferences(result.data)
    })
  }, [thesisId])

  const searchAndAdd = useCallback(
    async (query: string): Promise<Reference[]> => {
      if (!thesisId) return []
      setIsSearching(true)
      setSearchError(null)
      const result = await searchAndAddReferencesAction(thesisId, query)
      setIsSearching(false)
      if (result.error) {
        setSearchError(result.error)
        return []
      }
      if (result.data) {
        setReferences(result.data)
        return result.data
      }
      return []
    },
    [thesisId],
  )

  const deleteReference = useCallback(
    async (refId: string) => {
      if (!thesisId) return
      await deleteReferenceAction(refId, thesisId)
      setReferences((prev) => {
        const filtered = prev.filter((r) => r.id !== refId)
        // Re-number locally for immediate UI update
        return filtered.map((r, i) => ({ ...r, citation_number: i + 1 }))
      })
    },
    [thesisId],
  )

  const toggleSearch = useCallback(() => {
    setIsSearchEnabled((v) => !v)
  }, [])

  return {
    references,
    isSearching,
    isSearchEnabled,
    searchError,
    toggleSearch,
    searchAndAdd,
    deleteReference,
  }
}
