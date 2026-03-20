// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import type { Profile } from '@/types/thesis.types'
import type { Plan } from '@/lib/limits'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WORD_LIMIT_FREE, STARTER_PLAN_PRICE, FULL_PLAN_PRICE, isPaidPlan } from '@/lib/limits'
import { Check, Crown, Loader2 } from 'lucide-react'
import { PaymentSuccessModal } from './PaymentSuccessModal'

interface SettingsViewProps {
  profile: Profile | null
  isLoading: boolean
  isUpgrading: boolean
  paymentStatus: 'success' | 'pending' | 'error' | null
  upgradedPlan: Exclude<Plan, 'free'> | null
  onUpgrade: (targetPlan: Exclude<Plan, 'free'>) => void
  onPaymentStatusChange: (status: 'success' | 'pending' | 'error' | null) => void
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
  isUpgrading: boolean
  onUpgrade: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function PlanCard({ name, price, period, features, isCurrent, isDowngrade, isUpgrading, onUpgrade }: PlanCardProps) {
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
        <Button className='mt-4 w-full' onClick={onUpgrade} disabled={isUpgrading}>
          {isUpgrading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Memproses...
            </>
          ) : (
            'Upgrade Sekarang'
          )}
        </Button>
      )}
    </div>
  )
}

export function SettingsView({
  profile,
  isLoading,
  isUpgrading,
  paymentStatus,
  upgradedPlan,
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

  const currentPlan = profile?.plan ?? 'free'
  const planOrder: Plan[] = ['free', 'starter', 'full']
  const currentPlanIndex = planOrder.indexOf(currentPlan)

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
        </div>
      </section>

      {/* Plans Section */}
      {currentPlan !== 'full' && (
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
              isUpgrading={isUpgrading}
              onUpgrade={() => onUpgrade('starter')}
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
              isUpgrading={isUpgrading}
              onUpgrade={() => onUpgrade('full')}
            />
          </div>
        </section>
      )}

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        open={paymentStatus === 'success'}
        planName={upgradedPlan === 'full' ? 'Full' : upgradedPlan === 'starter' ? 'Starter' : 'Pro'}
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

      {/* Already Full */}
      {currentPlan === 'full' && (
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
