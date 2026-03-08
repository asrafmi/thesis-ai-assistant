// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect, useCallback } from 'react'
import { getUsageAction } from '@/actions/usage.actions'
import type { UsageData } from '@/lib/limits'

export function useUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null)

  const fetchUsage = useCallback(async () => {
    const result = await getUsageAction()
    if (result.data) setUsage(result.data)
  }, [])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  return { usage, refetchUsage: fetchUsage }
}
