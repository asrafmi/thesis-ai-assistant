// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState, useEffect } from 'react'
import { getProfileAction } from '@/actions/profile.actions'
import type { Profile } from '@/types/thesis.types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    getProfileAction().then((result) => {
      if (result.data) setProfile(result.data)
    })
  }, [])

  return { profile }
}
