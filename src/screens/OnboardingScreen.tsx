'use client'

import { OnboardingView } from '@/views/onboarding/OnboardingView'
import { useThesis } from '@/hooks/useThesis'

export function OnboardingScreen() {
  const { createThesis, isLoading, error } = useThesis()

  return <OnboardingView onSubmit={createThesis} isLoading={isLoading} error={error} />
}
