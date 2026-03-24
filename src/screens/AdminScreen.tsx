'use client'

import { AdminView } from '@/views/admin/AdminView'
import { useAdmin } from '@/hooks/useAdmin'

export function AdminScreen() {
  const {
    requests,
    isLoading,
    error,
    statusFilter,
    processingId,
    setStatusFilter,
    handleApprove,
    handleReject,
  } = useAdmin()

  return (
    <AdminView
      requests={requests}
      isLoading={isLoading}
      error={error}
      statusFilter={statusFilter}
      processingId={processingId}
      onFilterChange={setStatusFilter}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  )
}
