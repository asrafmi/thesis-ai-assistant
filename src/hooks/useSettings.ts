'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProfileAction } from '@/actions/profile.actions'
import { createSnapTransactionAction } from '@/actions/midtrans.actions'
import type { Profile } from '@/types/thesis.types'
import type { Plan } from '@/lib/limits'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const SNAP_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: Record<string, unknown>) => void
        onPending?: (result: Record<string, unknown>) => void
        onError?: (result: Record<string, unknown>) => void
        onClose?: () => void
      }) => void
    }
  }
}

export function useSettings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'error' | null>(null)
  const [upgradedPlan, setUpgradedPlan] = useState<Exclude<Plan, 'free'> | null>(null)
  const searchParams = useSearchParams()

  // Handle redirect from Midtrans
  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') setPaymentStatus('success')
    else if (payment === 'unfinish') setPaymentStatus('pending')
    else if (payment === 'error') setPaymentStatus('error')
  }, [searchParams])

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    const result = await getProfileAction()
    if (result.data) setProfile(result.data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Load Snap.js script
  useEffect(() => {
    if (document.getElementById('midtrans-snap')) return

    const script = document.createElement('script')
    script.id = 'midtrans-snap'
    script.src = SNAP_URL
    script.setAttribute('data-client-key', CLIENT_KEY)
    document.head.appendChild(script)
  }, [])

  async function handleUpgrade(targetPlan: Exclude<Plan, 'free'>) {
    setIsUpgrading(true)
    setPaymentStatus(null)

    const result = await createSnapTransactionAction(targetPlan)

    if (result.error || !result.data) {
      setPaymentStatus('error')
      setIsUpgrading(false)
      return
    }

    window.snap.pay(result.data.token, {
      onSuccess: async () => {
        setUpgradedPlan(targetPlan)
        setIsUpgrading(false)

        // Poll until webhook updates the plan in DB
        for (let i = 0; i < 10; i++) {
          const res = await getProfileAction()
          if (res.data?.plan === targetPlan) {
            setProfile(res.data)
            break
          }
          await new Promise((r) => setTimeout(r, 1500))
        }

        setPaymentStatus('success')
        window.dispatchEvent(new Event('usage-changed'))
      },
      onPending: () => {
        setPaymentStatus('pending')
        setIsUpgrading(false)
      },
      onError: () => {
        setPaymentStatus('error')
        setIsUpgrading(false)
      },
      onClose: () => {
        setIsUpgrading(false)
      },
    })
  }

  return {
    profile,
    isLoading,
    isUpgrading,
    paymentStatus,
    upgradedPlan,
    handleUpgrade,
    setPaymentStatus,
  }
}
