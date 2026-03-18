// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { Profile } from '@/types/thesis.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PRO_PLAN_PRICE } from '@/lib/limits'
import { WORD_LIMIT_FREE } from '@/lib/limits'
import { Check, Crown, Loader2 } from 'lucide-react'
import { PaymentSuccessModal } from './PaymentSuccessModal'

interface SettingsViewProps {
  profile: Profile | null
  isLoading: boolean
  isUpgrading: boolean
  paymentStatus: 'success' | 'pending' | 'error' | null
  onUpgrade: () => void
  onPaymentStatusChange: (status: 'success' | 'pending' | 'error' | null) => void
}

const proFeatures = [
  'Unlimited AI generate',
  'Unlimited export .docx',
  'Prioritas akses fitur baru',
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function SettingsView({
  profile,
  isLoading,
  isUpgrading,
  paymentStatus,
  onUpgrade,
  onPaymentStatusChange,
}: SettingsViewProps) {
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isPro = profile?.plan === 'pro'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Kelola akun dan langganan kamu.
      </p>

      {/* Profile Section */}
      <section className="mt-8 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Profil</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nama</span>
            <span className="font-medium">{profile?.full_name || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">NIM</span>
            <span className="font-medium">{profile?.nim || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <Badge variant={isPro ? 'default' : 'secondary'}>
              {isPro ? 'Pro' : 'Free'}
            </Badge>
          </div>
          {!isPro && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kata AI bulan ini</span>
              <span className="font-medium">
                {profile?.word_count?.toLocaleString('id-ID') || 0} / {WORD_LIMIT_FREE.toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Plan Section */}
      {!isPro && (
        <section className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Upgrade ke Pro</h2>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(PRO_PLAN_PRICE)}
            <span className="text-sm font-normal text-muted-foreground"> / sekali bayar</span>
          </p>
          <ul className="mt-4 space-y-2">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            onClick={onUpgrade}
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Upgrade Sekarang'
            )}
          </Button>
        </section>
      )}

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={paymentStatus === 'success'}
        onOpenChange={(open) => { if (!open) onPaymentStatusChange(null) }}
      />
      {paymentStatus === 'pending' && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Pembayaran sedang diproses. Status akan diperbarui otomatis.
        </div>
      )}
      {paymentStatus === 'error' && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Pembayaran gagal. Silakan coba lagi.
        </div>
      )}

      {/* Already Pro */}
      {isPro && (
        <section className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Kamu Pro!</h2>
          </div>
          <p className="mt-2 text-sm text-green-700">
            Kamu memiliki akses penuh ke semua fitur SkripsiAI tanpa batasan.
          </p>
        </section>
      )}
    </div>
  )
}
