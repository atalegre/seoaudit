export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis_results: {
        Row: {
          aio_data: Json | null
          aio_score: number | null
          client_id: string | null
          created_at: string | null
          id: string
          overall_status: string | null
          seo_data: Json | null
          seo_score: number | null
          timestamp: string | null
          url: string
        }
        Insert: {
          aio_data?: Json | null
          aio_score?: number | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          overall_status?: string | null
          seo_data?: Json | null
          seo_score?: number | null
          timestamp?: string | null
          url: string
        }
        Update: {
          aio_data?: Json | null
          aio_score?: number | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          overall_status?: string | null
          seo_data?: Json | null
          seo_score?: number | null
          timestamp?: string | null
          url?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_type: string
          key_value: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_type: string
          key_value: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_type?: string
          key_value?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          content_en: string | null
          created_at: string | null
          date: string | null
          excerpt: string | null
          excerpt_en: string | null
          id: string
          image_src: string | null
          key_learning: string | null
          key_learning_en: string | null
          popularity: number | null
          slug: string
          tags: string[] | null
          title: string
          title_en: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          content_en?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          image_src?: string | null
          key_learning?: string | null
          key_learning_en?: string | null
          popularity?: number | null
          slug: string
          tags?: string[] | null
          title: string
          title_en: string
        }
        Update: {
          category?: string | null
          content?: string | null
          content_en?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          image_src?: string | null
          key_learning?: string | null
          key_learning_en?: string | null
          popularity?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          title_en?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          account: string | null
          aioscore: number | null
          contactemail: string | null
          contactname: string | null
          created_at: string | null
          id: number
          lastanalysis: string | null
          lastreport: string | null
          name: string
          notes: string | null
          seoscore: number | null
          status: string | null
          website: string
        }
        Insert: {
          account?: string | null
          aioscore?: number | null
          contactemail?: string | null
          contactname?: string | null
          created_at?: string | null
          id: number
          lastanalysis?: string | null
          lastreport?: string | null
          name: string
          notes?: string | null
          seoscore?: number | null
          status?: string | null
          website: string
        }
        Update: {
          account?: string | null
          aioscore?: number | null
          contactemail?: string | null
          contactname?: string | null
          created_at?: string | null
          id?: number
          lastanalysis?: string | null
          lastreport?: string | null
          name?: string
          notes?: string | null
          seoscore?: number | null
          status?: string | null
          website?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notification_type: string
          sent_at: string | null
          status: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notification_type: string
          sent_at?: string | null
          status: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notification_type?: string
          sent_at?: string | null
          status?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_analysis_requests: {
        Row: {
          created_at: string
          id: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          id: string
          requested_values: Json
          response_values: Json | null
          status: string
          task_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          requested_values: Json
          response_values?: Json | null
          status?: string
          task_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          requested_values?: Json
          response_values?: Json | null
          status?: string
          task_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "editor", "user"],
    },
  },
} as const
