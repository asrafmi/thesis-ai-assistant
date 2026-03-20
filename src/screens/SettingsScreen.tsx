'use client'

import { SettingsView } from '@/views/settings/SettingsView'
import { useSettings } from '@/hooks/useSettings'

export function SettingsScreen() {
  const { profile, isLoading, isUpgrading, paymentStatus, upgradedPlan, handleUpgrade, setPaymentStatus } = useSettings()

  return (
    <SettingsView
      profile={profile}
      isLoading={isLoading}
      isUpgrading={isUpgrading}
      paymentStatus={paymentStatus}
      upgradedPlan={upgradedPlan}
      onUpgrade={handleUpgrade}
      onPaymentStatusChange={setPaymentStatus}
    />
  )
}
