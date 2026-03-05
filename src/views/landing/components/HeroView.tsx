'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

const PROMPT_TEXT = 'Buat latar belakang tentang penggunaan AI dalam pendidikan tinggi di Indonesia...'
const RESULT_TEXT = 'Perkembangan kecerdasan buatan (AI) dalam beberapa dekade terakhir telah membawa perubahan signifikan dalam berbagai sektor kehidupan, termasuk dunia pendidikan tinggi di Indonesia...'

type Phase = 'typing-prompt' | 'clicking' | 'loading' | 'typing-result'

function MockUI() {
  const [promptText, setPromptText] = useState('')
  const [resultText, setResultText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing-prompt')

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const t = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay)
      timers.push(id)
    }

    const PROMPT_CHAR_MS = 35
    const RESULT_CHAR_MS = 18
    const PROMPT_DONE_MS = PROMPT_TEXT.length * PROMPT_CHAR_MS
    const RESULT_START_MS = PROMPT_DONE_MS + 1500
    const RESULT_DONE_MS = RESULT_START_MS + RESULT_TEXT.length * RESULT_CHAR_MS
    const LOOP_MS = RESULT_DONE_MS + 2500

    const run = (offset: number) => {
      t(() => { setPromptText(''); setResultText(''); setPhase('typing-prompt') }, offset)

      for (let i = 1; i <= PROMPT_TEXT.length; i++) {
        const idx = i
        t(() => setPromptText(PROMPT_TEXT.slice(0, idx)), offset + idx * PROMPT_CHAR_MS)
      }

      t(() => setPhase('clicking'), offset + PROMPT_DONE_MS + 300)
      t(() => setPhase('loading'), offset + PROMPT_DONE_MS + 700)
      t(() => setPhase('typing-result'), offset + RESULT_START_MS)

      for (let i = 1; i <= RESULT_TEXT.length; i++) {
        const idx = i
        t(() => setResultText(RESULT_TEXT.slice(0, idx)), offset + RESULT_START_MS + idx * RESULT_CHAR_MS)
      }

      t(() => run(0), offset + LOOP_MS)
    }

    run(400)
    return () => timers.forEach(clearTimeout)
  }, [])

  const isLoading = phase === 'loading'
  const isClicking = phase === 'clicking'

  return (
    <>
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#09090b] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <div className="mx-auto text-xs text-zinc-600">SkripsiAI — Workspace</div>
      </div>

      {/* 3-panel layout mock */}
      <div className="flex h-[calc(100%-40px)] text-left text-xs">
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
          <div className="min-h-16 rounded-lg border border-white/8 bg-[#09090b] p-3 text-zinc-400">
            {promptText}
            {phase === 'typing-prompt' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-px inline-block h-3 w-px bg-blue-400 align-middle"
              />
            )}
          </div>
          <motion.div
            animate={isClicking ? { scale: 0.95, opacity: 0.75 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className={`mt-3 rounded-lg px-3 py-1.5 text-center text-[10px] font-medium ${
              isLoading || phase === 'typing-result'
                ? 'bg-blue-700 text-blue-200'
                : 'bg-blue-600 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-1">
                {[0, 0.25, 0.5].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay }}
                  >
                    ·
                  </motion.span>
                ))}
              </span>
            ) : 'Generate'}
          </motion.div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden p-6 leading-relaxed text-zinc-300">
          <div className="mb-2 text-base font-bold text-white">BAB I</div>
          <div className="mb-1 text-sm font-semibold text-zinc-200">PENDAHULUAN</div>
          <div className="mb-3 text-xs font-medium text-blue-400">1.1 Latar Belakang</div>
          <div className="text-[11px] leading-5 text-zinc-400">
            {resultText}
            {phase === 'typing-result' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="ml-px inline-block h-3 w-px bg-zinc-400 align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function HeroView() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-150 w-150 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="relative px-6 my-16">
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
          </div>
        }
      >
        <MockUI />
      </ContainerScroll>
    </section>
  )
}
