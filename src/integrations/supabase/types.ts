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
          created_at: string | null
          date: string | null
          excerpt: string | null
          id: string
          image_src: string | null
          key_learning: string | null
          popularity: number | null
          slug: string
          tags: string[] | null
          title: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          id?: string
          image_src?: string | null
          key_learning?: string | null
          popularity?: number | null
          slug: string
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string | null
          excerpt?: string | null
          id?: string
          image_src?: string | null
          key_learning?: string | null
          popularity?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
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
      scheduled_tasks: {
        Row: {
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean | null
          last_run: string | null
          next_run: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          next_run?: string
          url?: string
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
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
