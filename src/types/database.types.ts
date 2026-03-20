export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      exports: {
        Row: {
          created_at: string
          file_url: string
          id: string
          thesis_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          thesis_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          thesis_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          diagram_count: number
          diagram_count_reset_at: string | null
          full_name: string | null
          id: string
          nim: string | null
          plan: Database["public"]["Enums"]["plan"]
          word_count: number
          word_count_reset_at: string | null
        }
        Insert: {
          diagram_count?: number
          diagram_count_reset_at?: string | null
          full_name?: string | null
          id: string
          nim?: string | null
          plan?: Database["public"]["Enums"]["plan"]
          word_count?: number
          word_count_reset_at?: string | null
        }
        Update: {
          diagram_count?: number
          diagram_count_reset_at?: string | null
          full_name?: string | null
          id?: string
          nim?: string | null
          plan?: Database["public"]["Enums"]["plan"]
          word_count?: number
          word_count_reset_at?: string | null
        }
        Relationships: []
      }
      revisions: {
        Row: {
          content: Json
          created_at: string
          id: string
          section_id: string
          source: Database["public"]["Enums"]["revision_source"]
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          section_id: string
          source: Database["public"]["Enums"]["revision_source"]
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section_id?: string
          source?: Database["public"]["Enums"]["revision_source"]
        }
        Relationships: [
          {
            foreignKeyName: "revisions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          level: number
          order_index: number
          parent_id: string | null
          thesis_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          level: number
          order_index: number
          parent_id?: string | null
          thesis_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          level?: number
          order_index?: number
          parent_id?: string | null
          thesis_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      theses: {
        Row: {
          created_at: string
          faculty: string | null
          id: string
          reference_style: Database["public"]["Enums"]["reference_style"]
          status: Database["public"]["Enums"]["thesis_status"]
          supervisor: string | null
          template_type: Database["public"]["Enums"]["template_type"]
          title: string
          university: string | null
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          created_at?: string
          faculty?: string | null
          id?: string
          reference_style?: Database["public"]["Enums"]["reference_style"]
          status?: Database["public"]["Enums"]["thesis_status"]
          supervisor?: string | null
          template_type?: Database["public"]["Enums"]["template_type"]
          title: string
          university?: string | null
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          created_at?: string
          faculty?: string | null
          id?: string
          reference_style?: Database["public"]["Enums"]["reference_style"]
          status?: Database["public"]["Enums"]["thesis_status"]
          supervisor?: string | null
          template_type?: Database["public"]["Enums"]["template_type"]
          title?: string
          university?: string | null
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "theses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_references: {
        Row: {
          authors: string | null
          citation_number: number
          created_at: string
          doi: string | null
          id: string
          issue: string | null
          journal: string | null
          pages: string | null
          thesis_id: string
          title: string
          url: string | null
          volume: string | null
          year: number | null
        }
        Insert: {
          authors?: string | null
          citation_number: number
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          thesis_id: string
          title: string
          url?: string | null
          volume?: string | null
          year?: number | null
        }
        Update: {
          authors?: string | null
          citation_number?: number
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          thesis_id?: string
          title?: string
          url?: string | null
          volume?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thesis_references_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          midtrans_response: Json | null
          order_id: string
          payment_type: string | null
          snap_token: string
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          midtrans_response?: Json | null
          order_id: string
          payment_type?: string | null
          snap_token: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          midtrans_response?: Json | null
          order_id?: string
          payment_type?: string | null
          snap_token?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan: "free" | "pro" | "starter" | "full"
      reference_style: "apa" | "ieee" | "mendeley"
      revision_source: "ai" | "user"
      template_type: "quantitative" | "qualitative"
      thesis_status: "draft" | "complete"
      transaction_status:
        | "pending"
        | "settlement"
        | "expire"
        | "cancel"
        | "deny"
        | "refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan: ["free", "pro", "starter", "full"],
      reference_style: ["apa", "ieee", "mendeley"],
      revision_source: ["ai", "user"],
      template_type: ["quantitative", "qualitative"],
      thesis_status: ["draft", "complete"],
      transaction_status: [
        "pending",
        "settlement",
        "expire",
        "cancel",
        "deny",
        "refund",
      ],
    },
  },
} as const
