import Link from 'next/link'
import { motion } from 'framer-motion'

export function HeroView() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          ✦ AI Thesis Workspace untuk Mahasiswa Indonesia
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          Selesaikan Skripsimu
          <br />
          dengan AI yang{' '}
          <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Terstruktur
          </span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
        >
          Bukan generator teks otomatis. SkripsiAI membantumu menulis, menyusun, dan memformat
          skripsi secara sistematis — siap dikumpulkan tanpa ribet formatting.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        >
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Mulai Gratis
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Lihat Fitur
          </a>
        </motion.div>

        {/* Mock UI Preview */}
        <motion.div
          className="mt-16 overflow-hidden rounded-xl border border-white/8 bg-[#18181b] shadow-2xl shadow-blue-900/20"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/8 bg-[#09090b] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <div className="mx-auto text-xs text-zinc-600">SkripsiAI — Workspace</div>
          </div>

          {/* 3-panel layout mock */}
          <div className="flex h-72 text-left text-xs">
            {/* Sidebar */}
            <div className="w-48 border-r border-white/8 bg-[#09090b] p-4">
              <div className="mb-3 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Struktur
              </div>
              {[
                { label: 'Bab I', sub: ['1.1 Latar Belakang', '1.2 Rumusan Masalah'], active: true },
                { label: 'Bab II', sub: [] },
                { label: 'Bab III', sub: [] },
              ].map((bab) => (
                <div key={bab.label} className="mb-1">
                  <div className={`rounded px-2 py-1 font-medium ${bab.active ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-400'}`}>
                    {bab.label}
                  </div>
                  {bab.sub.map((s) => (
                    <div key={s} className={`ml-3 py-0.5 ${s === '1.1 Latar Belakang' ? 'text-blue-400' : 'text-zinc-600'}`}>
                      {s}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Prompt panel */}
            <div className="w-64 border-r border-white/8 p-4">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                AI Prompt
              </div>
              <div className="mb-3 text-zinc-500 text-[10px]">Section: 1.1 Latar Belakang</div>
              <div className="rounded-lg border border-white/8 bg-[#09090b] p-3 text-zinc-400">
                Buat latar belakang tentang penggunaan AI dalam pendidikan tinggi di Indonesia...
              </div>
              <div className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-center text-white text-[10px] font-medium">
                Generate
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-6 leading-relaxed text-zinc-300">
              <div className="mb-2 text-base font-bold text-white">BAB I</div>
              <div className="mb-1 text-sm font-semibold text-zinc-200">PENDAHULUAN</div>
              <div className="mb-3 text-xs font-medium text-blue-400">1.1 Latar Belakang</div>
              <div className="text-[11px] leading-5 text-zinc-400">
                Perkembangan kecerdasan buatan (AI) dalam beberapa dekade terakhir telah membawa
                perubahan signifikan dalam berbagai sektor kehidupan, termasuk dunia pendidikan
                tinggi di Indonesia...
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
