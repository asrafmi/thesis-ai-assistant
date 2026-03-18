'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, Sparkles, ArrowRight } from 'lucide-react'

interface PaymentSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentSuccessModal({ open, onOpenChange }: PaymentSuccessModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!open) {
      setCountdown(5)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/workspace')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, router])

  function goToWorkspace() {
    router.push('/workspace')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <div className="flex flex-col items-center py-4">
          {/* Animated icon */}
          <div className="relative">
            <div className="animate-bounce">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-200">
                <Crown className="h-10 w-10 text-white" />
              </div>
            </div>
            {/* Sparkle decorations */}
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-yellow-400" />
            <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 animate-pulse text-orange-400" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute -top-3 left-0 h-4 w-4 animate-pulse text-yellow-300" style={{ animationDelay: '1s' }} />
          </div>

          {/* Confetti-like dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full animate-ping"
                style={{
                  backgroundColor: ['#facc15', '#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'][i % 6],
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${1.5 + Math.random()}s`,
                }}
              />
            ))}
          </div>

          <DialogTitle className="mt-6 text-center text-xl font-bold">
            Selamat! Kamu sekarang Pro!
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-muted-foreground">
            Akses penuh ke semua fitur SkripsiAI sudah aktif. Selamat mengerjakan skripsi!
          </DialogDescription>

          <Button
            className="mt-6 w-full gap-2"
            size="lg"
            onClick={goToWorkspace}
          >
            Ke Workspace
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-3 text-xs text-muted-foreground">
            Otomatis redirect dalam {countdown} detik...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
