'use client'

import { SettingsView } from '@/views/settings/SettingsView'
import { useSettings } from '@/hooks/useSettings'

export function SettingsScreen() {
  const {
    profile,
    isLoading,
    isSubmitting,
    submitError,
    submitSuccess,
    paymentRequestStatus,
    rejectReason,
    upgradedPlan,
    selectedPlan,
    openPaymentForm,
    closePaymentForm,
    handleSubmitPayment,
  } = useSettings()

  return (
    <SettingsView
      profile={profile}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      submitError={submitError}
      submitSuccess={submitSuccess}
      paymentRequestStatus={paymentRequestStatus}
      rejectReason={rejectReason}
      upgradedPlan={upgradedPlan}
      selectedPlan={selectedPlan}
      onOpenPaymentForm={openPaymentForm}
      onClosePaymentForm={closePaymentForm}
      onSubmitPayment={handleSubmitPayment}
    />
  )
}
