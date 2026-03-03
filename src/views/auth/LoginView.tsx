// PRESENTATION LAYER — pure JSX only. No hooks, no business logic.

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthLeftPanel } from './AuthLeftPanel'

interface LoginViewProps {
  readonly onLogin: (email: string, password: string) => void
  readonly isLoading: boolean
  readonly error: string | null
}

export function LoginView({ onLogin, isLoading, error }: LoginViewProps) {
  function handleSubmit(e: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onLogin(fd.get('email') as string, fd.get('password') as string)
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Left panel — decorative, desktop only */}
      <AuthLeftPanel />

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12">
        {/* Logo — mobile only */}
        <motion.div
          className="mb-8 md:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-white">SkripsiAI</span>
          </Link>
        </motion.div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <h1 className="mb-1 text-2xl font-bold text-white">Masuk</h1>
            <p className="text-sm text-zinc-500">Lanjutkan perjalanan skripsimu</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            >
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@email.com"
                className="w-full rounded-lg border border-white/8 bg-[#18181b] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
            >
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/8 bg-[#18181b] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </motion.button>
          </form>

          <motion.p
            className="mt-6 text-center text-sm text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              Daftar gratis
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}
