'use client'

import { MessageCircle } from 'lucide-react'

const WA_URL = `https://api.whatsapp.com/send?phone=6282245101283&text=${encodeURIComponent('Halo admin SkripsiAI, saya ingin bertanya.')}`

export function WhatsAppFab() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi admin via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
