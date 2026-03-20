'use client'

import { useRouter } from 'next/navigation'
import { X, Zap, Crown } from 'lucide-react'

const DESCRIPTIONS = {
  words: 'Kamu sudah mencapai batas 5.000 kata AI per bulan pada paket Gratis.',
  exports: 'Kamu sudah mencapai batas 3x export .docx per bulan pada paket Gratis.',
  thesis: 'Kamu hanya bisa memiliki 1 skripsi pada paket Gratis. Upgrade ke Pro untuk membuat skripsi tanpa batas.',
}

export type UpgradeReason = 'words' | 'exports' | 'thesis'

interface UpgradeModalProps {
  isOpen: boolean
  reason: UpgradeReason
  onClose: () => void
}

export function UpgradeModal({ isOpen, reason, onClose }: UpgradeModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  function goToSettings() {
    router.push('/settings')
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />

      <div className='relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-6'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-muted-foreground/60 hover:text-foreground transition-colors'
        >
          <X size={16} />
        </button>

        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4'>
          <Zap size={18} className='text-primary' />
        </div>

        <h2 className='text-base font-semibold text-foreground mb-1'>
          Upgrade ke Plan Pro
        </h2>
        <p className='text-sm text-muted-foreground mb-5'>
          {DESCRIPTIONS[reason]} Upgrade ke Pro untuk melanjutkan tanpa batas.
        </p>

        <ul className='space-y-2 mb-6'>
          {[
            'Kata AI tidak terbatas',
            'Export .docx tidak terbatas',
            'Skripsi tidak terbatas',
            'Riwayat revisi lengkap',
            'Dukungan prioritas',
          ].map((f) => (
            <li key={f} className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
              {f}
            </li>
          ))}
        </ul>

        <button
          type='button'
          onClick={goToSettings}
          className='flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors'
        >
          <Crown size={15} />
          Upgrade Sekarang
        </button>

        <button
          type='button'
          onClick={onClose}
          className='mt-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5'
        >
          Nanti saja
        </button>
      </div>
    </div>
  )
}
