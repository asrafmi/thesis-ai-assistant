// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const features = [
  'Struktur Bab I–V otomatis sesuai standar',
  'AI hanya update section yang kamu target',
  'Export .docx rapi, langsung bisa dikumpulkan',
]

export function AuthLeftPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0d0d10] md:flex md:w-[45%] md:flex-col md:justify-between md:px-12 md:py-10">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-600/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="relative flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-sm font-semibold text-white">SkripsiAI</span>
        </Link>
      </motion.div>

      {/* Center — headline + floating card */}
      <div className="relative my-auto py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-blue-400">
            AI Thesis Workspace
          </p>
          <h2 className="text-2xl font-bold leading-snug text-white">
            Selesaikan Skripsimu
            <br />
            dengan AI yang{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Terstruktur
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            Bukan generator teks instan. SkripsiAI membantumu menulis dan memformat
            skripsi secara sistematis.
          </p>
        </motion.div>

        {/* Floating document card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="relative rounded-xl border border-white/8 bg-[#18181b] p-5 shadow-2xl shadow-blue-900/20"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Window chrome */}
            <div className="mb-4 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
              <span className="ml-2 text-[10px] text-zinc-600">SkripsiAI — Workspace</span>
            </div>

            {/* Mock document content */}
            <div className="space-y-1 text-[11px] leading-relaxed">
              <div className="font-bold text-white">BAB I PENDAHULUAN</div>
              <div className="font-medium text-blue-400">1.1 Latar Belakang</div>
              <div className="mt-1.5 text-zinc-500">
                Perkembangan kecerdasan buatan (AI) dalam beberapa dekade terakhir
                telah membawa perubahan signifikan dalam dunia pendidikan tinggi di
                Indonesia...
              </div>
            </div>

            {/* AI generating indicator */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-600/5 px-3 py-2">
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-blue-400"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-[10px] text-blue-400">AI sedang menulis section ini...</span>
            </div>

            {/* Subtle glow behind card */}
            <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-blue-500/5 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom — feature list */}
      <motion.ul
        className="relative space-y-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            {f}
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
