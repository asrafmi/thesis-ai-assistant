// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState } from 'react'
import type { Profile } from '@/types/thesis.types'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(email: string, password: string) {
    // TODO: call auth action
  }

  async function register(email: string, password: string, fullName: string) {
    // TODO: call auth action
  }

  async function updateProfile(data: Partial<Profile>) {
    // TODO: call profile action
  }

  return { profile, isLoading, error, login, register, updateProfile }
}
