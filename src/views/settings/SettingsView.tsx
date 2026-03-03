// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { Profile } from '@/types/thesis.types'

interface SettingsViewProps {
  profile: Profile | null
  onUpdate: (data: Partial<Profile>) => void
  isLoading: boolean
}

export function SettingsView({ profile, onUpdate, isLoading }: SettingsViewProps) {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  )
}
