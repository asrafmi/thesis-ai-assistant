import Link from 'next/link'
import { motion } from 'framer-motion'

export function NavbarView() {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#09090b]/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-base font-semibold tracking-tight text-white">SkripsiAI</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: 'Fitur', href: '#features' },
            { label: 'Cara Kerja', href: '#cara-kerja' },
            { label: 'Harga', href: '#harga' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white md:block"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Coba Gratis
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
