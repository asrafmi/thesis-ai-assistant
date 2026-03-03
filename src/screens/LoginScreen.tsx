'use client'

import { LoginView } from '@/views/auth/LoginView'
import { useAuth } from '@/hooks/useAuth'

export function LoginScreen() {
  const { login, isLoading, error } = useAuth()

  return <LoginView onLogin={login} isLoading={isLoading} error={error} />
}
