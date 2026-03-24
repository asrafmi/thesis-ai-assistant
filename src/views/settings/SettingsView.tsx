// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { Profile } from '@/types/thesis.types'
import type { Plan } from '@/lib/limits'
import type { PaymentRequestStatus } from '@/hooks/useSettings'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WORD_LIMIT_FREE, STARTER_PLAN_PRICE, FULL_PLAN_PRICE, isPaidPlan, normalizePlan } from '@/lib/limits'
import { Check, Crown, Loader2, Clock, XCircle, CheckCircle } from 'lucide-react'
import { PaymentSuccessModal } from './PaymentSuccessModal'
import { PaymentForm } from './PaymentForm'

interface SettingsViewProps {
  profile: Profile | null
  isLoading: boolean
  isSubmitting: boolean
  submitError: string | null
  submitSuccess: boolean
  paymentRequestStatus: PaymentRequestStatus
  rejectReason: string | null
  upgradedPlan: Exclude<Plan, 'free'> | null
  selectedPlan: Exclude<Plan, 'free'> | null
  onOpenPaymentForm: (plan: Exclude<Plan, 'free'>) => void
  onClosePaymentForm: () => void
  onSubmitPayment: (plan: Exclude<Plan, 'free'>, file: File) => void
}

const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  starter: 'Starter',
  full: 'Full',
}

interface PlanCardProps {
  name: string
  price: number
  period: string
  features: string[]
  isCurrent: boolean
  isDowngrade: boolean
  onUpgrade: () => void
  disabled: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function PlanCard({ name, price, period, features, isCurrent, isDowngrade, onUpgrade, disabled }: PlanCardProps) {
  return (
    <div className={`rounded-lg border p-5 ${isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='font-semibold'>{name}</h3>
        {isCurrent && <Badge variant='default'>Aktif</Badge>}
      </div>
      <p className='text-2xl font-bold'>
        {formatCurrency(price)}
        <span className='text-sm font-normal text-muted-foreground'> / {period}</span>
      </p>
      <ul className='mt-4 space-y-2'>
        {features.map((f) => (
          <li key={f} className='flex items-center gap-2 text-sm'>
            <Check className='h-4 w-4 text-primary shrink-0' />
            {f}
          </li>
        ))}
      </ul>
      {!isCurrent && !isDowngrade && (
        <Button className='mt-4 w-full' onClick={onUpgrade} disabled={disabled}>
          Upgrade Sekarang
        </Button>
      )}
    </div>
  )
}

export function SettingsView({
  profile,
  isLoading,
  isSubmitting,
  submitError,
  submitSuccess,
  paymentRequestStatus,
  rejectReason,
  upgradedPlan,
  selectedPlan,
  onOpenPaymentForm,
  onClosePaymentForm,
  onSubmitPayment,
}: SettingsViewProps) {
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const currentPlan = normalizePlan(profile?.plan ?? 'free')
  const planOrder: Plan[] = ['free', 'starter', 'full']
  const currentPlanIndex = planOrder.indexOf(currentPlan)
  const hasPendingRequest = paymentRequestStatus === 'pending'

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
            <Badge variant={isPaidPlan(currentPlan) ? 'default' : 'secondary'}>
              {PLAN_LABELS[currentPlan]}
            </Badge>
          </div>
          {currentPlan === 'free' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kata AI bulan ini</span>
              <span className="font-medium">
                {profile?.word_count?.toLocaleString('id-ID') || 0} / {WORD_LIMIT_FREE.toLocaleString('id-ID')}
              </span>
            </div>
          )}
          {isPaidPlan(currentPlan) && profile?.plan_expires_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Berlaku hingga</span>
              <span className="font-medium">
                {new Date(profile.plan_expires_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Payment request status banners */}
      {paymentRequestStatus === 'pending' && !selectedPlan && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <Clock className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Pembayaran sedang diverifikasi</p>
            <p className="mt-1 text-yellow-700">
              Bukti pembayaran kamu sedang kami periksa. Halaman ini akan otomatis terupdate saat status berubah.
            </p>
          </div>
        </div>
      )}

      {paymentRequestStatus === 'rejected' && !selectedPlan && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Pembayaran ditolak</p>
            {rejectReason && <p className="mt-1 text-red-700">Alasan: {rejectReason}</p>}
            <p className="mt-1 text-red-700">Silakan coba lagi dengan bukti pembayaran yang benar.</p>
          </div>
        </div>
      )}

      {submitSuccess && !selectedPlan && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Bukti pembayaran berhasil dikirim!</p>
            <p className="mt-1 text-green-700">Kami akan memverifikasi pembayaran kamu secepatnya.</p>
          </div>
        </div>
      )}

      {/* Payment form (shown when user selects a plan) */}
      {selectedPlan && (
        <section className="mt-6 rounded-lg border p-6">
          <PaymentForm
            targetPlan={selectedPlan}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={onSubmitPayment}
            onBack={onClosePaymentForm}
          />
        </section>
      )}

      {/* Plans Section */}
      {currentPlan !== 'full' && !selectedPlan && (
        <section className='mt-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Crown className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-semibold'>Upgrade Paket</h2>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <PlanCard
              name='Starter — 3 Bulan'
              price={STARTER_PLAN_PRICE}
              period='3 bulan'
              features={[
                'Unlimited kata',
                '20x generate diagram/bulan',
                '1 proyek aktif',
                'Export .docx + PDF (unlimited)',
              ]}
              isCurrent={currentPlan === 'starter'}
              isDowngrade={currentPlanIndex > planOrder.indexOf('starter')}
              onUpgrade={() => onOpenPaymentForm('starter')}
              disabled={hasPendingRequest}
            />
            <PlanCard
              name='Full — Semester'
              price={FULL_PLAN_PRICE}
              period='semester'
              features={[
                'Unlimited kata',
                'Unlimited generate diagram',
                '3 proyek aktif',
                'Export .docx + PDF (unlimited)',
              ]}
              isCurrent={false}
              isDowngrade={false}
              onUpgrade={() => onOpenPaymentForm('full')}
              disabled={hasPendingRequest}
            />
          </div>
        </section>
      )}

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={paymentRequestStatus === 'approved' && upgradedPlan !== null}
        planName={upgradedPlan === 'full' ? 'Full' : upgradedPlan === 'starter' ? 'Starter' : ''}
        onOpenChange={() => {}}
      />

      {/* Already Full */}
      {currentPlan === 'full' && !selectedPlan && (
        <section className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Paket Full Aktif!</h2>
          </div>
          <p className="mt-2 text-sm text-green-700">
            Kamu memiliki akses penuh ke semua fitur SkripsiAI tanpa batasan.
          </p>
        </section>
      )}
    </div>
  )
}
