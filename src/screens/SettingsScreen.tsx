'use client'

import { SettingsView } from '@/views/settings/SettingsView'
import { useSettings } from '@/hooks/useSettings'

export function SettingsScreen() {
  const { profile, isLoading, isUpgrading, paymentStatus, handleUpgrade, setPaymentStatus } = useSettings()

  return (
    <SettingsView
      profile={profile}
      isLoading={isLoading}
      isUpgrading={isUpgrading}
      paymentStatus={paymentStatus}
      onUpgrade={handleUpgrade}
      onPaymentStatusChange={setPaymentStatus}
    />
  )
}
