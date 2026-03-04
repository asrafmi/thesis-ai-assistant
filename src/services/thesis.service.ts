// BUSINESS LOGIC LAYER — pure TypeScript functions. No React, no Next.js.

import type { TemplateType } from '@/types/thesis.types'

export interface DefaultSectionNode {
  title: string
  level: number
  order_index: number
  children: DefaultSectionNode[]
}

export function buildDefaultSections(): DefaultSectionNode[] {
  return [
    {
      title: 'BAB I PENDAHULUAN',
      level: 1,
      order_index: 0,
      children: [
        { title: '1.1 Latar Belakang', level: 2, order_index: 0, children: [] },
        { title: '1.2 Rumusan Masalah', level: 2, order_index: 1, children: [] },
        { title: '1.3 Tujuan Penelitian', level: 2, order_index: 2, children: [] },
        { title: '1.4 Manfaat Penelitian', level: 2, order_index: 3, children: [] },
      ],
    },
    {
      title: 'BAB II TINJAUAN PUSTAKA',
      level: 1,
      order_index: 1,
      children: [
        { title: '2.1 Landasan Teori', level: 2, order_index: 0, children: [] },
        { title: '2.2 Penelitian Terdahulu', level: 2, order_index: 1, children: [] },
        { title: '2.3 Kerangka Berpikir', level: 2, order_index: 2, children: [] },
      ],
    },
    {
      title: 'BAB III METODOLOGI PENELITIAN',
      level: 1,
      order_index: 2,
      children: [
        { title: '3.1 Jenis Penelitian', level: 2, order_index: 0, children: [] },
        { title: '3.2 Waktu dan Tempat Penelitian', level: 2, order_index: 1, children: [] },
        { title: '3.3 Populasi dan Sampel', level: 2, order_index: 2, children: [] },
        { title: '3.4 Teknik Pengumpulan Data', level: 2, order_index: 3, children: [] },
        { title: '3.5 Teknik Analisis Data', level: 2, order_index: 4, children: [] },
      ],
    },
    {
      title: 'BAB IV HASIL DAN PEMBAHASAN',
      level: 1,
      order_index: 3,
      children: [
        { title: '4.1 Hasil Penelitian', level: 2, order_index: 0, children: [] },
        { title: '4.2 Pembahasan', level: 2, order_index: 1, children: [] },
      ],
    },
    {
      title: 'BAB V PENUTUP',
      level: 1,
      order_index: 4,
      children: [
        { title: '5.1 Kesimpulan', level: 2, order_index: 0, children: [] },
        { title: '5.2 Saran', level: 2, order_index: 1, children: [] },
      ],
    },
    {
      title: 'DAFTAR PUSTAKA',
      level: 1,
      order_index: 5,
      children: [],
    },
  ]
}

export function validateThesisData(data: {
  title: string
  template_type: TemplateType
}): string | null {
  if (!data.title.trim()) return 'Judul skripsi wajib diisi'
  return null
}
