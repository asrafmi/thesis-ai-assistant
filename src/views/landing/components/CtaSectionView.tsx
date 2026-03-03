import Link from 'next/link'
import { motion } from 'framer-motion'

export function CtaSectionView() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-600/10 via-[#18181b] to-cyan-600/10 px-8 py-16 text-center"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-96 rounded-full bg-blue-600/10 blur-[80px]" />
          </div>

          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Siap menyelesaikan skripsimu?
            </h2>
            <p className="mb-8 text-zinc-400">
              Bergabung dengan mahasiswa yang sudah menggunakan SkripsiAI untuk menulis lebih cepat
              dan lebih terstruktur.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Mulai Gratis Sekarang
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
