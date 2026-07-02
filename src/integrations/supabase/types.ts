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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target?: string | null
        }
        Relationships: []
      }
      broadcasts: {
        Row: {
          created_at: string | null
          id: string
          message: string
          scheduled_at: string | null
          segment: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          scheduled_at?: string | null
          segment: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          scheduled_at?: string | null
          segment?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          educator: string
          id: string
          is_live: boolean | null
          scheduled_at: string
          students_count: number | null
          title: string
          youtube_video_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          educator: string
          id?: string
          is_live?: boolean | null
          scheduled_at: string
          students_count?: number | null
          title: string
          youtube_video_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          educator?: string
          id?: string
          is_live?: boolean | null
          scheduled_at?: string
          students_count?: number | null
          title?: string
          youtube_video_id?: string
        }
        Relationships: []
      }
      practice_progress: {
        Row: {
          is_correct: boolean
          last_attempted_at: string | null
          question_id: string
          user_id: string
        }
        Insert: {
          is_correct: boolean
          last_attempted_at?: string | null
          question_id: string
          user_id: string
        }
        Update: {
          is_correct?: boolean
          last_attempted_at?: string | null
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          target_year: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string
          target_year?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          target_year?: number
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          chapter: string
          correct_option: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          id: string
          options: Json
          question_text: string
          source: string | null
          subject: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          chapter: string
          correct_option: string
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          id?: string
          options: Json
          question_text: string
          source?: string | null
          subject: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          chapter?: string
          correct_option?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          options?: Json
          question_text?: string
          source?: string | null
          subject?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sidebar_items: {
        Row: {
          admin_only: boolean | null
          created_at: string | null
          group_name: string
          icon: string
          id: string
          is_visible: boolean | null
          order_index: number
          title: string
          url: string
        }
        Insert: {
          admin_only?: boolean | null
          created_at?: string | null
          group_name: string
          icon: string
          id?: string
          is_visible?: boolean | null
          order_index: number
          title: string
          url: string
        }
        Update: {
          admin_only?: boolean | null
          created_at?: string | null
          group_name?: string
          icon?: string
          id?: string
          is_visible?: boolean | null
          order_index?: number
          title?: string
          url?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          accuracy: number
          answers: Json | null
          created_at: string | null
          id: string
          score: number
          test_id: string | null
          time_taken_seconds: number
          user_id: string | null
        }
        Insert: {
          accuracy: number
          answers?: Json | null
          created_at?: string | null
          id?: string
          score: number
          test_id?: string | null
          time_taken_seconds: number
          user_id?: string | null
        }
        Update: {
          accuracy?: number
          answers?: Json | null
          created_at?: string | null
          id?: string
          score?: number
          test_id?: string | null
          time_taken_seconds?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          order_index: number | null
          question_id: string
          test_id: string
        }
        Insert: {
          order_index?: number | null
          question_id: string
          test_id: string
        }
        Update: {
          order_index?: number | null
          question_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          badge: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          subject: string
          title: string
          total_marks: number
          total_questions: number
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          subject: string
          title: string
          total_marks: number
          total_questions: number
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          subject?: string
          title?: string
          total_marks?: number
          total_questions?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "admin" | "super_admin"
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
      app_role: ["student", "admin", "super_admin"],
    },
  },
} as const
