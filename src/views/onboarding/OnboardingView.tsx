// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { TemplateType } from '@/types/thesis.types'

interface OnboardingFormData {
  title: string
  university: string
  faculty: string
  supervisor: string
  year: number
  template_type: TemplateType
}

interface OnboardingViewProps {
  onSubmit: (data: OnboardingFormData) => void
  isLoading: boolean
  error: string | null
}

export function OnboardingView({ onSubmit, isLoading, error }: OnboardingViewProps) {
  return (
    <div>
      <h1>Setup Skripsi</h1>
    </div>
  )
}
