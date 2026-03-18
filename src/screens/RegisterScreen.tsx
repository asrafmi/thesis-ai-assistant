'use client'

import { RegisterView } from '@/views/auth/RegisterView'
import { useAuth } from '@/hooks/useAuth'

export function RegisterScreen() {
  const { register, isLoading, error, isPasswordVisible, setIsPasswordVisible } = useAuth()

  return <RegisterView onRegister={register} isLoading={isLoading} error={error} isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} />
}
