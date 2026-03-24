'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { STARTER_PLAN_PRICE, FULL_PLAN_PRICE } from '@/lib/limits'
import type { Plan } from '@/lib/limits'
import { Upload, X, ImageIcon, Loader2, ArrowLeft, Copy, Check } from 'lucide-react'

interface PaymentFormProps {
  targetPlan: Exclude<Plan, 'free'>
  isSubmitting: boolean
  submitError: string | null
  onSubmit: (plan: Exclude<Plan, 'free'>, file: File) => void
  onBack: () => void
}

const PLAN_INFO: Record<Exclude<Plan, 'free'>, { label: string; price: number; period: string }> = {
  starter: { label: 'Starter', price: STARTER_PLAN_PRICE, period: '3 bulan' },
  full: { label: 'Full', price: FULL_PLAN_PRICE, period: 'semester' },
}

const BANK_ACCOUNTS = [
  { bank: 'BCA', number: '2330764981', name: 'ASRAF MUHAMMAD IZZUDDIN' },
  { bank: 'Mandiri', number: '1300022135621', name: 'ASRAF MUHAMMAD IZZUD' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function PaymentForm({ targetPlan, isSubmitting, submitError, onSubmit, onBack }: PaymentFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const info = PLAN_INFO[targetPlan]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  function removeFile() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <div>
        <h2 className="text-lg font-semibold">Upgrade ke {info.label}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Transfer {formatCurrency(info.price)} untuk paket {info.label} ({info.period})
        </p>
      </div>

      {/* Bank accounts */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-medium">Transfer ke salah satu rekening berikut:</p>
        {BANK_ACCOUNTS.map((acc, i) => (
          <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 p-3">
            <div className="text-sm">
              <span className="font-semibold">{acc.bank}</span>
              <span className="mx-2 text-muted-foreground">—</span>
              <span className="font-mono">{acc.number}</span>
              <span className="mx-2 text-muted-foreground">a.n.</span>
              <span>{acc.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(acc.number, i)}
              className="shrink-0"
            >
              {copiedIndex === i ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Jumlah transfer: <strong>{formatCurrency(info.price)}</strong>
        </p>
      </div>

      {/* Upload proof */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Upload bukti transfer</p>
        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Klik untuk upload gambar</span>
            <span className="text-xs">JPG, PNG, atau WebP (maks 5MB)</span>
          </button>
        ) : (
          <div className="relative rounded-lg border p-2">
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="Preview" className="h-20 w-20 rounded object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <Button
        className="w-full"
        disabled={!file || isSubmitting}
        onClick={() => file && onSubmit(targetPlan, file)}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          'Kirim Bukti Pembayaran'
        )}
      </Button>
    </div>
  )
}
