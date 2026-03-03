'use client'

import { RegisterView } from '@/views/auth/RegisterView'
import { useAuth } from '@/hooks/useAuth'

export function RegisterScreen() {
  const { register, isLoading, error } = useAuth()

  return <RegisterView onRegister={register} isLoading={isLoading} error={error} />
}
