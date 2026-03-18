import Link from 'next/link'
import { motion } from 'framer-motion'

export function FooterView() {
  return (
    <motion.footer
      className="border-t border-white/8 px-6 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-white">SkripsiAI</span>
            </Link>
            <p className="mt-2 text-xs text-zinc-600">
              AI Writing & Formatting Workspace untuk Skripsi Indonesia.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6">
            {[
              { label: 'Fitur', href: '#features' },
              { label: 'Cara Kerja', href: '#cara-kerja' },
              { label: 'Harga', href: '#harga' },
              { label: 'Masuk', href: '/login' },
              { label: 'Daftar', href: '/register' },
              { label: 'Syarat & Ketentuan', href: '/terms' },
              { label: 'Kebijakan Privasi', href: '/privacy' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/8 pt-8 text-xs text-zinc-700">
          © {new Date().getFullYear()} SkripsiAI. Dibuat untuk mahasiswa Indonesia.
        </div>
      </div>
    </motion.footer>
  )
}
