'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProfileAction } from '@/actions/profile.actions'
import {
  submitPaymentRequestAction,
  uploadPaymentProofAction,
  getPaymentRequestStatusAction,
} from '@/actions/payment.actions'
import type { Profile } from '@/types/thesis.types'
import type { Plan } from '@/lib/limits'

export type PaymentRequestStatus = 'pending' | 'approved' | 'rejected' | null

export function useSettings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [paymentRequestStatus, setPaymentRequestStatus] = useState<PaymentRequestStatus>(null)
  const [rejectReason, setRejectReason] = useState<string | null>(null)
  const [upgradedPlan, setUpgradedPlan] = useState<Exclude<Plan, 'free'> | null>(null)

  // Selected plan for the payment form
  const [selectedPlan, setSelectedPlan] = useState<Exclude<Plan, 'free'> | null>(null)

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    const result = await getProfileAction()
    if (result.data) setProfile(result.data)
    setIsLoading(false)
  }, [])

  // Fetch existing payment request status
  const fetchPaymentStatus = useCallback(async () => {
    const result = await getPaymentRequestStatusAction()
    if (result.data) {
      setPaymentRequestStatus(result.data.status)
      setRejectReason(result.data.reject_reason)
      // Don't set upgradedPlan on initial load — modal should only show
      // when polling detects the transition from pending → approved
    }
  }, [])

  useEffect(() => {
    fetchProfile()
    fetchPaymentStatus()
  }, [fetchProfile, fetchPaymentStatus])

  // Short polling: check payment status every 10s when pending
  useEffect(() => {
    if (paymentRequestStatus !== 'pending') return

    const interval = setInterval(async () => {
      const result = await getPaymentRequestStatusAction()
      if (result.data && result.data.status !== 'pending') {
        setPaymentRequestStatus(result.data.status)
        setRejectReason(result.data.reject_reason)
        if (result.data.status === 'approved') {
          setUpgradedPlan(result.data.plan as Exclude<Plan, 'free'>)
          // Refresh profile to get updated plan
          const profileResult = await getProfileAction()
          if (profileResult.data) setProfile(profileResult.data)
          window.dispatchEvent(new Event('usage-changed'))
        }
      }
    }, 10_000)

    return () => clearInterval(interval)
  }, [paymentRequestStatus])

  async function handleSubmitPayment(targetPlan: Exclude<Plan, 'free'>, file: File) {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    // 1. Upload proof image
    const formData = new FormData()
    formData.append('file', file)
    const uploadResult = await uploadPaymentProofAction(formData)

    if (uploadResult.error || !uploadResult.data) {
      setSubmitError(uploadResult.error ?? 'Gagal upload gambar')
      setIsSubmitting(false)
      return
    }

    // 2. Submit payment request
    const result = await submitPaymentRequestAction(targetPlan, uploadResult.data.url)

    if (result.error) {
      setSubmitError(result.error)
      setIsSubmitting(false)
      return
    }

    setSubmitSuccess(true)
    setPaymentRequestStatus('pending')
    setSelectedPlan(null)
    setIsSubmitting(false)
  }

  function openPaymentForm(plan: Exclude<Plan, 'free'>) {
    setSelectedPlan(plan)
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  function closePaymentForm() {
    setSelectedPlan(null)
    setSubmitError(null)
  }

  return {
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
  }
}
