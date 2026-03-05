// FRAMEWORK LAYER — React/Next.js hooks only. Calls services/actions.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, logoutAction, registerAction } from '@/actions/auth.actions'
import type { Profile } from '@/types/thesis.types'

export function useAuth() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(email: string, password: string) {
    setIsLoading(true)
    setError(null)

    const result = await loginAction(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      router.push('/workspace')
    }

    setIsLoading(false)
  }

  async function register(email: string, password: string, fullName: string) {
    setIsLoading(true)
    setError(null)

    const result = await registerAction(email, password, fullName)

    if (result.error) {
      setError(result.error)
    } else {
      router.push('/onboarding')
    }

    setIsLoading(false)
  }

  async function logout() {
    setIsLoading(true)
    await logoutAction()
    router.push('/login')
    setIsLoading(false)
  }

  async function updateProfile(data: Partial<Profile>) {
    // TODO: implement profile update
    setProfile((prev) => (prev ? { ...prev, ...data } : prev))
  }

  return { profile, isLoading, error, login, register, logout, updateProfile }
}
