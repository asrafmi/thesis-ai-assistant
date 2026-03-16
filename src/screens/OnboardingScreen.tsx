'use client'

import { OnboardingView } from '@/views/onboarding/OnboardingView'
import { useThesis } from '@/hooks/useThesis'
import { updateProfileNimAction } from '@/actions/profile.actions'
import type { TemplateType } from '@/types/thesis.types'

interface OnboardingFormData {
  title: string
  university: string
  faculty: string
  supervisor: string
  year: number
  template_type: TemplateType
  nim: string
}

export function OnboardingScreen() {
  const { createThesis, isLoading, error } = useThesis()

  async function handleSubmit(data: OnboardingFormData) {
    const { nim, ...thesisData } = data
    if (nim.trim()) await updateProfileNimAction(nim.trim())
    await createThesis(thesisData)
  }

  return <OnboardingView onSubmit={handleSubmit} isLoading={isLoading} error={error} />
}
