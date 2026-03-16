// BUSINESS LOGIC LAYER — pure TypeScript. No React, no Next.js.
// Client-side image upload utilities for Supabase Storage.

import { createClient } from '@/lib/supabase/client'

const BUCKET = 'thesis-images'

function generatePath(ext: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}

export async function uploadFileToStorage(file: File): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'png'
  const path = generatePath(ext)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadDataUrlToStorage(dataUrl: string): Promise<string | null> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const file = new File([blob], `diagram-${Date.now()}.png`, { type: 'image/png' })
  return uploadFileToStorage(file)
}
