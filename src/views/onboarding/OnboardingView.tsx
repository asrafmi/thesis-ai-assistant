'use client'

// PRESENTATION LAYER — step-based journey UI. Presentation state (step, formData, lottieData) lives here.

import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowRight, ArrowLeft, Check, Loader2, FileText, Building2, GraduationCap, FlaskConical } from 'lucide-react'
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

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>

interface StepConfig {
  question: string
  subtitle: string
  animationPath: string
  glowPrimary: string
  glowSecondary: string
  tagline: string
  description: string
  Icon: LucideIcon
}

const STEPS: StepConfig[] = [
  {
    question: 'Apa judul skripsimu?',
    subtitle: 'Judul bisa diubah kapan saja dari halaman Settings.',
    animationPath: '/animations/step-1.json',
    glowPrimary: 'bg-blue-600/20',
    glowSecondary: 'bg-cyan-500/10',
    tagline: 'Mulai dari sebuah judul',
    description: 'Judul yang baik mencerminkan fokus dan kontribusi risetmu.',
    Icon: FileText,
  },
  {
    question: 'Di mana kamu belajar?',
    subtitle: 'Akan muncul di halaman cover skripsi.',
    animationPath: '/animations/step-2.json',
    glowPrimary: 'bg-violet-600/20',
    glowSecondary: 'bg-purple-500/10',
    tagline: 'Identitas akademikmu',
    description: 'Universitas dan fakultas membentuk konteks keilmuanmu.',
    Icon: Building2,
  },
  {
    question: 'Siapa pembimbingmu?',
    subtitle: 'Nama dosen pembimbing dan target tahun kelulusanmu.',
    animationPath: '/animations/step-3.json',
    glowPrimary: 'bg-emerald-600/20',
    glowSecondary: 'bg-teal-500/10',
    tagline: 'Perjalanan yang tidak sendirian',
    description: 'Setiap skripsi yang baik lahir dari bimbingan yang tepat.',
    Icon: GraduationCap,
  },
  {
    question: 'Jenis penelitianmu?',
    subtitle: 'Bisa disesuaikan kembali di Settings jika berubah pikiran.',
    animationPath: '/animations/step-4.json',
    glowPrimary: 'bg-orange-600/20',
    glowSecondary: 'bg-amber-500/10',
    tagline: 'Tentukan pendekatanmu',
    description: 'Kuantitatif atau kualitatif — keduanya valid. Yang penting tepat sasaran.',
    Icon: FlaskConical,
  },
]

// ─── Sound & confetti ────────────────────────────────────────────────────────

function playChime() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.start(t)
      osc.stop(t + 0.55)
    })
  } catch {
    // ignore — AudioContext may be blocked
  }
}

function fireConfetti() {
  const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B']
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors })
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 }, colors })
  }, 200)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current ? 'w-4 bg-blue-500' : i === current ? 'w-6 bg-blue-500' : 'w-3 bg-zinc-700'
          }`}
        />
      ))}
    </div>
  )
}

/** Animated fallback shown on right panel when Lottie JSON is not yet loaded */
function StepIllustration({ stepIndex }: { stepIndex: number }) {
  const Icon = STEPS[stepIndex].Icon
  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      {/* Concentric rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/5"
          style={{ width: 100 + i * 56, height: 100 + i * 56 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
      {/* Center icon */}
      <motion.div
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon size={30} className="text-white/50" />
      </motion.div>
      {/* Floating dots */}
      {[
        { top: '8%', left: '18%' },
        { bottom: '12%', right: '14%' },
        { bottom: '20%', left: '10%' },
        { top: '20%', right: '8%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/15"
          style={pos as React.CSSProperties}
          animate={{ opacity: [0.15, 0.7, 0.15], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  )
}

// ─── Input styles ────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-white/8 bg-[#18181b] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors'

const labelCls = 'mb-1.5 block text-sm font-medium text-zinc-300'

// ─── Main component ──────────────────────────────────────────────────────────

export function OnboardingView({ onSubmit, isLoading, error }: OnboardingViewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
    year: new Date().getFullYear(),
    template_type: 'quantitative',
  })
  // null = failed to load, undefined = not yet attempted, object = loaded
  const [lottieData, setLottieData] = useState<Record<number, object | null>>({})

  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1

  // Load Lottie for current + prefetch next step
  useEffect(() => {
    ;[currentStep, currentStep + 1].forEach((idx) => {
      const s = STEPS[idx]
      if (!s || idx in lottieData) return
      fetch(s.animationPath)
        .then((r) => {
          if (!r.ok) throw new Error('not found')
          return r.json() as Promise<object>
        })
        .then((data) => setLottieData((prev) => ({ ...prev, [idx]: data })))
        .catch(() => setLottieData((prev) => ({ ...prev, [idx]: null })))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  function canAdvance() {
    return currentStep === 0 ? !!formData.title?.trim() : true
  }

  function goNext() {
    if (!canAdvance()) return
    if (isLastStep) {
      fireConfetti()
      playChime()
      onSubmit(formData as OnboardingFormData)
      return
    }
    setDirection(1)
    setCurrentStep((s) => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setCurrentStep((s) => s - 1)
  }

  function set<K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 28 : -28, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -28 : 28, opacity: 0 }),
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* ── LEFT PANEL — form ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12">
        {/* Mobile logo */}
        <motion.div
          className="mb-8 w-full max-w-sm md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-white">SkripsiAI</span>
          </div>
        </motion.div>

        <div className="w-full max-w-sm">
          {/* Progress dots */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProgressDots current={currentStep} total={STEPS.length} />
            <p className="mt-2 text-xs text-zinc-600">
              Langkah {currentStep + 1} dari {STEPS.length}
            </p>
          </motion.div>

          {/* Step form fields */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <h1 className="mb-1 text-2xl font-bold text-white">{step.question}</h1>
              <p className="mb-8 text-sm text-zinc-500">{step.subtitle}</p>

              {/* Step 1 — Title */}
              {currentStep === 0 && (
                <div>
                  <label className={labelCls}>
                    Judul Skripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    autoFocus
                    rows={3}
                    value={formData.title ?? ''}
                    onChange={(e) => set('title', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        goNext()
                      }
                    }}
                    placeholder="Pengaruh... terhadap... pada..."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="mt-2 text-xs text-zinc-600">Enter untuk lanjut · Shift+Enter untuk baris baru</p>
                </div>
              )}

              {/* Step 2 — Institution */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Universitas</label>
                    <input
                      autoFocus
                      type="text"
                      value={formData.university ?? ''}
                      onChange={(e) => set('university', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      placeholder="Universitas Indonesia"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Fakultas</label>
                    <input
                      type="text"
                      value={formData.faculty ?? ''}
                      onChange={(e) => set('faculty', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      placeholder="Fakultas Teknik"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Supervisor + Year */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Dosen Pembimbing</label>
                    <input
                      autoFocus
                      type="text"
                      value={formData.supervisor ?? ''}
                      onChange={(e) => set('supervisor', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      placeholder="Dr. Ahmad, M.Si."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Tahun Kelulusan</label>
                    <input
                      type="number"
                      value={formData.year ?? new Date().getFullYear()}
                      onChange={(e) => set('year', Number(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {/* Step 4 — Research type */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  {(
                    [
                      {
                        value: 'quantitative' as TemplateType,
                        label: 'Kuantitatif',
                        desc: 'Data numerik, statistik, survei, eksperimen',
                      },
                      {
                        value: 'qualitative' as TemplateType,
                        label: 'Kualitatif',
                        desc: 'Wawancara, observasi, studi kasus, narasi',
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('template_type', opt.value)}
                      className={`flex w-full items-center justify-between rounded-lg border px-4 py-3.5 text-left transition-colors ${
                        formData.template_type === opt.value
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-white/8 bg-[#18181b] hover:border-white/15'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{opt.label}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">{opt.desc}</p>
                      </div>
                      {formData.template_type === opt.value && (
                        <Check size={15} className="ml-4 shrink-0 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err"
                    className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 rounded-lg border border-white/8 px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/15 hover:text-white"
                  >
                    <ArrowLeft size={14} />
                    Kembali
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance() || isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Membuat skripsi...
                    </>
                  ) : isLastStep ? (
                    'Buat Skripsi'
                  ) : (
                    <>
                      Lanjut
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT PANEL — animation ───────────────────────────────────── */}
      <div className="relative hidden overflow-hidden bg-[#0d0d10] md:flex md:w-[48%] md:flex-col md:items-center md:justify-center">
        {/* Per-step glow background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${currentStep}`}
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`absolute -left-32 -top-32 h-96 w-96 rounded-full ${step.glowPrimary} blur-[120px]`}
            />
            <div
              className={`absolute bottom-0 right-0 h-72 w-72 rounded-full ${step.glowSecondary} blur-[100px]`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Logo */}
        <div className="absolute left-10 top-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-white">SkripsiAI</span>
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="relative z-10 flex flex-col items-center px-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Lottie or fallback */}
            <div className="mb-8 flex h-56 w-56 items-center justify-center">
              {lottieData[currentStep] ? (
                <Lottie
                  animationData={lottieData[currentStep] as object}
                  loop
                  className="w-full"
                />
              ) : (
                <StepIllustration stepIndex={currentStep} />
              )}
            </div>

            {/* Text */}
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-blue-400">
              {step.tagline}
            </p>
            <h2 className="text-xl font-bold text-white">{step.question}</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">{step.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
