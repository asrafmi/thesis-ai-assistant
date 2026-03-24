'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getPaymentRequestsAction,
  approvePaymentRequestAction,
  rejectPaymentRequestAction,
} from '@/actions/payment.actions'
import type { PaymentRequestRow } from '@/actions/payment.actions'

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all'

export function useAdmin() {
  const [requests, setRequests] = useState<PaymentRequestRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const filter = statusFilter === 'all' ? undefined : statusFilter
    const result = await getPaymentRequestsAction(filter)
    if (result.error) {
      setError(result.error)
    } else {
      setRequests(result.data ?? [])
    }
    setIsLoading(false)
  }, [statusFilter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Auto-refresh every 15s when viewing pending
  useEffect(() => {
    if (statusFilter !== 'pending') return
    const interval = setInterval(fetchRequests, 15_000)
    return () => clearInterval(interval)
  }, [statusFilter, fetchRequests])

  async function handleApprove(requestId: string) {
    setProcessingId(requestId)
    const result = await approvePaymentRequestAction(requestId)
    if (result.error) {
      setError(result.error)
    } else {
      await fetchRequests()
    }
    setProcessingId(null)
  }

  async function handleReject(requestId: string, reason: string) {
    setProcessingId(requestId)
    const result = await rejectPaymentRequestAction(requestId, reason)
    if (result.error) {
      setError(result.error)
    } else {
      await fetchRequests()
    }
    setProcessingId(null)
  }

  return {
    requests,
    isLoading,
    error,
    statusFilter,
    processingId,
    setStatusFilter,
    handleApprove,
    handleReject,
  }
}
