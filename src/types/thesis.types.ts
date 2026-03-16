import type { Enums } from './database.types'

export type Plan = Enums<'plan'>
export type TemplateType = Enums<'template_type'>
export type ThesisStatus = Enums<'thesis_status'>
export type RevisionSource = Enums<'revision_source'>
export type ReferenceStyle = Enums<'reference_style'>

export interface Profile {
  id: string
  full_name: string | null
  nim: string | null
  plan: Plan
  word_count: number
  word_count_reset_at: string | null
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
  reference_style: ReferenceStyle
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

export interface Reference {
  id: string
  thesis_id: string
  title: string
  authors: string | null
  year: number | null
  journal: string | null
  volume: string | null
  issue: string | null
  pages: string | null
  url: string | null
  doi: string | null
  citation_number: number
  created_at: string
}
