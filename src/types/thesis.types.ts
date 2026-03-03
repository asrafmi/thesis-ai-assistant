import type { TemplateType, ThesisStatus, Plan } from './database.types'

export interface Profile {
  id: string
  full_name: string | null
  plan: Plan
  word_count: number
}

export interface Thesis {
  id: string
  user_id: string
  title: string
  university: string | null
  faculty: string | null
  supervisor: string | null
  year: number | null
  template_type: TemplateType
  status: ThesisStatus
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  thesis_id: string
  parent_id: string | null
  title: string
  content: Record<string, unknown> | null
  level: number
  order_index: number
  children?: Section[]
  created_at: string
  updated_at: string
}

export interface SectionTree extends Section {
  children: SectionTree[]
}
