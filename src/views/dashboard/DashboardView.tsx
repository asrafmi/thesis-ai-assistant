'use client'

// PRESENTATION LAYER — pure JSX only. No business logic.

import { useState } from 'react'
import { Plus, FileText, Trash2, Calendar, GraduationCap, Loader2 } from 'lucide-react'
import type { Thesis } from '@/types/thesis.types'
import type { Plan } from '@/lib/limits'
import type { UpgradeReason } from '@/components/UpgradeModal'
import { UpgradeModal } from '@/components/UpgradeModal'
import { ThemeToggle } from '@/components/ThemeToggle'

interface DashboardViewProps {
  theses: Thesis[]
  isLoading: boolean
  plan: Plan
  canCreateThesis: boolean
  onOpenThesis: (thesisId: string) => void
  onCreateThesis: () => void
  onDeleteThesis: (thesisId: string) => Promise<boolean>
  onLogout: () => void
  onSettings: () => void
}

function DeleteConfirmModal({
  thesisTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  thesisTitle: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onCancel} />
      <div className='relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-6'>
        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-4'>
          <Trash2 size={18} className='text-red-500' />
        </div>
        <h2 className='text-base font-semibold text-foreground mb-1'>Hapus Skripsi</h2>
        <p className='text-sm text-muted-foreground mb-5'>
          Yakin ingin menghapus <span className='font-medium text-foreground'>&ldquo;{thesisTitle}&rdquo;</span>? Semua data termasuk bab, referensi, dan revisi akan dihapus permanen.
        </p>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isDeleting}
            className='flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50'
          >
            {isDeleting ? <Loader2 size={14} className='animate-spin' /> : <Trash2 size={14} />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function DashboardView({
  theses,
  isLoading,
  plan,
  canCreateThesis,
  onOpenThesis,
  onCreateThesis,
  onDeleteThesis,
  onLogout,
  onSettings,
}: DashboardViewProps) {
  const [deleteTarget, setDeleteTarget] = useState<Thesis | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; reason: UpgradeReason }>({
    isOpen: false,
    reason: 'thesis',
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const ok = await onDeleteThesis(deleteTarget.id)
    setIsDeleting(false)
    if (ok) setDeleteTarget(null)
  }

  function handleCreate() {
    if (!canCreateThesis) {
      setUpgradeModal({ isOpen: true, reason: 'thesis' })
      return
    }
    onCreateThesis()
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <header className='border-b border-border'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-blue-500' />
            <span className='text-sm font-semibold text-foreground'>SkripsiAI</span>
          </div>
          <div className='flex items-center gap-3'>
            <ThemeToggle />
            <button
              type='button'
              onClick={onSettings}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              Settings
            </button>
            <button
              type='button'
              onClick={onLogout}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='mx-auto max-w-5xl px-6 py-10'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Skripsi Saya</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {plan === 'free' ? `${theses.length}/1 proyek (Paket Gratis)`
                : plan === 'starter' ? `${theses.length}/1 proyek (Starter)`
                : plan === 'full' ? `${theses.length}/3 proyek (Full)`
                : `${theses.length} proyek`}
            </p>
          </div>
          <button
            type='button'
            onClick={handleCreate}
            className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500'
          >
            <Plus size={16} />
            Buat Skripsi
          </button>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader2 size={24} className='animate-spin text-muted-foreground' />
          </div>
        ) : theses.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20'>
            <FileText size={40} className='mb-4 text-muted-foreground/50' />
            <p className='text-sm text-muted-foreground mb-4'>Belum ada skripsi. Mulai buat yang pertama!</p>
            <button
              type='button'
              onClick={handleCreate}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500'
            >
              <Plus size={16} />
              Buat Skripsi
            </button>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {theses.map((thesis) => (
              <div
                key={thesis.id}
                className='group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80 cursor-pointer'
                onClick={() => onOpenThesis(thesis.id)}
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10'>
                    <FileText size={18} className='text-blue-400' />
                  </div>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTarget(thesis)
                    }}
                    className='rounded-md p-1.5 text-muted-foreground/50 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className='mb-2 text-sm font-medium text-foreground line-clamp-2'>
                  {thesis.title}
                </h3>
                <div className='space-y-1'>
                  {thesis.university && (
                    <p className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <GraduationCap size={12} />
                      {thesis.university}
                    </p>
                  )}
                  <p className='flex items-center gap-1.5 text-xs text-zinc-500'>
                    <Calendar size={12} />
                    Diperbarui {formatDate(thesis.updated_at)}
                  </p>
                </div>
                <div className='mt-3'>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      thesis.status === 'complete'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {thesis.status === 'complete' ? 'Selesai' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {deleteTarget && (
        <DeleteConfirmModal
          thesisTitle={deleteTarget.title}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        reason={upgradeModal.reason}
        onClose={() => setUpgradeModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
