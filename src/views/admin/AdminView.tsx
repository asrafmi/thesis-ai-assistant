'use client'

import { useState } from 'react'
import type { PaymentRequestRow } from '@/actions/payment.actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, CheckCircle, XCircle, Clock, ImageIcon } from 'lucide-react'

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all'

interface AdminViewProps {
  requests: PaymentRequestRow[]
  isLoading: boolean
  error: string | null
  statusFilter: StatusFilter
  processingId: string | null
  onFilterChange: (filter: StatusFilter) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
}

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'Semua' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminView({
  requests,
  isLoading,
  error,
  statusFilter,
  processingId,
  onFilterChange,
  onApprove,
  onReject,
}: AdminViewProps) {
  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  function handleRejectSubmit() {
    if (!rejectDialogId || !rejectReason.trim()) return
    onReject(rejectDialogId, rejectReason.trim())
    setRejectDialogId(null)
    setRejectReason('')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Kelola permintaan pembayaran manual.
      </p>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={statusFilter === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Requests list */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="h-8 w-8 mb-2" />
            <p className="text-sm">Tidak ada permintaan pembayaran.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="rounded-lg border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{req.user_name || 'User'}</span>
                    <Badge variant={STATUS_BADGE[req.status]?.variant ?? 'outline'}>
                      {STATUS_BADGE[req.status]?.label ?? req.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.user_email}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      Plan: <strong className="capitalize">{req.plan}</strong>
                    </span>
                    <span>
                      {formatCurrency(req.amount)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(req.created_at)}
                    </span>
                  </div>
                  {req.reject_reason && (
                    <p className="text-sm text-red-600">Alasan: {req.reject_reason}</p>
                  )}
                </div>

                {/* Proof image thumbnail */}
                <button
                  onClick={() => setProofPreview(req.proof_image_url)}
                  className="shrink-0 rounded-lg border overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <img
                    src={req.proof_image_url}
                    alt="Bukti transfer"
                    className="h-20 w-20 object-cover"
                  />
                </button>
              </div>

              {/* Action buttons for pending */}
              {req.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove(req.id)}
                    disabled={processingId === req.id}
                  >
                    {processingId === req.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setRejectDialogId(req.id)}
                    disabled={processingId === req.id}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reject reason dialog */}
      <Dialog open={!!rejectDialogId} onOpenChange={(open) => { if (!open) { setRejectDialogId(null); setRejectReason('') } }}>
        <DialogContent>
          <DialogTitle>Tolak Pembayaran</DialogTitle>
          <DialogDescription>
            Berikan alasan penolakan agar user bisa memperbaiki.
          </DialogDescription>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Contoh: Bukti transfer tidak valid, nominal tidak sesuai..."
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => { setRejectDialogId(null); setRejectReason('') }}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={!rejectReason.trim()}>
              Tolak
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proof image preview dialog */}
      <Dialog open={!!proofPreview} onOpenChange={(open) => { if (!open) setProofPreview(null) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Bukti Pembayaran</DialogTitle>
          <DialogDescription className="sr-only">Preview bukti transfer</DialogDescription>
          {proofPreview ? (
            <img src={proofPreview} alt="Bukti transfer" className="w-full rounded-lg" />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
