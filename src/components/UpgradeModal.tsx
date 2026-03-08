'use client'

import { X, Zap, MessageCircle } from 'lucide-react'

const WA_PHONE = '6282245101283'

const MESSAGES = {
  words: 'Halo, saya ingin upgrade ke Plan Pro SkripsiAI karena sudah mencapai batas 3.000 kata bulanan.',
  exports: 'Halo, saya ingin upgrade ke Plan Pro SkripsiAI karena sudah mencapai batas 3x export bulanan.',
}

const DESCRIPTIONS = {
  words: 'Kamu sudah mencapai batas 3.000 kata AI per bulan pada paket Gratis.',
  exports: 'Kamu sudah mencapai batas 3x export .docx per bulan pada paket Gratis.',
}

interface UpgradeModalProps {
  isOpen: boolean
  reason: 'words' | 'exports'
  onClose: () => void
}

export function UpgradeModal({ isOpen, reason, onClose }: UpgradeModalProps) {
  if (!isOpen) return null

  const waUrl = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(MESSAGES[reason])}`

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
            'Riwayat revisi lengkap',
            'Dukungan prioritas',
          ].map((f) => (
            <li key={f} className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
              {f}
            </li>
          ))}
        </ul>

        <a
          href={waUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors'
        >
          <MessageCircle size={15} />
          Hubungi via WhatsApp
        </a>

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
