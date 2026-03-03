export type Plan = 'free' | 'pro'
export type TemplateType = 'quantitative' | 'qualitative'
export type ThesisStatus = 'draft' | 'complete'
export type RevisionSource = 'ai' | 'user'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          plan: Plan
          word_count: number
        }
        Insert: {
          id: string
          full_name?: string | null
          plan?: Plan
          word_count?: number
        }
        Update: {
          full_name?: string | null
          plan?: Plan
          word_count?: number
        }
      }
      theses: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          title: string
          university?: string | null
          faculty?: string | null
          supervisor?: string | null
          year?: number | null
          template_type?: TemplateType
          status?: ThesisStatus
        }
        Update: {
          title?: string
          university?: string | null
          faculty?: string | null
          supervisor?: string | null
          year?: number | null
          template_type?: TemplateType
          status?: ThesisStatus
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          thesis_id: string
          parent_id: string | null
          title: string
          content: Record<string, unknown> | null
          level: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thesis_id: string
          parent_id?: string | null
          title: string
          content?: Record<string, unknown> | null
          level: number
          order_index: number
        }
        Update: {
          title?: string
          content?: Record<string, unknown> | null
          order_index?: number
          updated_at?: string
        }
      }
      revisions: {
        Row: {
          id: string
          section_id: string
          content: Record<string, unknown>
          source: RevisionSource
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          content: Record<string, unknown>
          source: RevisionSource
        }
        Update: never
      }
      exports: {
        Row: {
          id: string
          thesis_id: string
          user_id: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          thesis_id: string
          user_id: string
          file_url: string
        }
        Update: never
      }
    }
  }
}
