'use client'

import { SettingsView } from '@/views/settings/SettingsView'
import { useAuth } from '@/hooks/useAuth'

export function SettingsScreen() {
  const { profile, updateProfile, isLoading } = useAuth()

  return <SettingsView profile={profile} onUpdate={updateProfile} isLoading={isLoading} />
}
