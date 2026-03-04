// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import { Loader2 } from 'lucide-react'
import type { TemplateType } from '@/types/thesis.types'

interface OnboardingFormData {
  title: string
  university: string
  faculty: string
  supervisor: string
  year: number
  template_type: TemplateType
}

interface OnboardingViewProps {
  onSubmit: (data: OnboardingFormData) => void
  isLoading: boolean
  error: string | null
}

export function OnboardingView({ onSubmit, isLoading, error }: OnboardingViewProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      title: fd.get('title') as string,
      university: fd.get('university') as string,
      faculty: fd.get('faculty') as string,
      supervisor: fd.get('supervisor') as string,
      year: Number(fd.get('year')),
      template_type: fd.get('template_type') as TemplateType,
    })
  }

  const inputClass =
    'w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:outline-none'

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-white">SkripsiAI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Setup Skripsi</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Isi informasi dasar skripsimu. Bisa diubah nanti.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">
              Judul Skripsi <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              placeholder="Pengaruh... terhadap... pada..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Universitas</label>
              <input name="university" placeholder="Universitas Indonesia" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Fakultas</label>
              <input name="faculty" placeholder="Fakultas Teknik" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Dosen Pembimbing</label>
              <input name="supervisor" placeholder="Dr. Ahmad, M.Si." className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Tahun</label>
              <input
                name="year"
                type="number"
                defaultValue={new Date().getFullYear()}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Jenis Penelitian</label>
            <select
              name="template_type"
              defaultValue="quantitative"
              className={`${inputClass} cursor-pointer`}
            >
              <option value="quantitative">Kuantitatif</option>
              <option value="qualitative">Kualitatif</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Membuat skripsi...
              </>
            ) : (
              'Buat Skripsi & Mulai Nulis'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
