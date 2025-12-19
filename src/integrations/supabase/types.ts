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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      exercise_alternatives: {
        Row: {
          alternative_exercise_id: string | null
          created_at: string | null
          id: string
          primary_exercise_id: string | null
        }
        Insert: {
          alternative_exercise_id?: string | null
          created_at?: string | null
          id?: string
          primary_exercise_id?: string | null
        }
        Update: {
          alternative_exercise_id?: string | null
          created_at?: string | null
          id?: string
          primary_exercise_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_alternatives_alternative_exercise_id_fkey"
            columns: ["alternative_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_alternatives_primary_exercise_id_fkey"
            columns: ["primary_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          id: string
          reps_per_set: number[]
          sets_completed: number
          weight_per_set: number[]
          workout_log_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          reps_per_set: number[]
          sets_completed: number
          weight_per_set: number[]
          workout_log_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          reps_per_set?: number[]
          sets_completed?: number
          weight_per_set?: number[]
          workout_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          description: string | null
          equipment: string | null
          id: string
          is_bodyweight: boolean | null
          is_compound: boolean | null
          muscle_group: string
          name: string
          technique_tips: string[] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          equipment?: string | null
          id?: string
          is_bodyweight?: boolean | null
          is_compound?: boolean | null
          muscle_group: string
          name: string
          technique_tips?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          equipment?: string | null
          id?: string
          is_bodyweight?: boolean | null
          is_compound?: boolean | null
          muscle_group?: string
          name?: string
          technique_tips?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_exercise_preferences: {
        Row: {
          created_at: string | null
          id: string
          selected_exercise_id: string | null
          user_id: string
          workout_exercise_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          selected_exercise_id?: string | null
          user_id: string
          workout_exercise_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          selected_exercise_id?: string | null
          user_id?: string
          workout_exercise_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_preferences_selected_exercise_id_fkey"
            columns: ["selected_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_exercise_preferences_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_days: {
        Row: {
          created_at: string | null
          day_number: number
          description: string | null
          id: string
          muscle_groups: string[]
          name: string
        }
        Insert: {
          created_at?: string | null
          day_number: number
          description?: string | null
          id?: string
          muscle_groups: string[]
          name: string
        }
        Update: {
          created_at?: string | null
          day_number?: number
          description?: string | null
          id?: string
          muscle_groups?: string[]
          name?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          id: string
          is_primary: boolean | null
          order_index: number
          reps_max: number
          reps_min: number
          rest_seconds: number
          sets: number
          workout_day_id: string | null
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          is_primary?: boolean | null
          order_index: number
          reps_max?: number
          reps_min?: number
          rest_seconds?: number
          sets?: number
          workout_day_id?: string | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number
          reps_max?: number
          reps_min?: number
          rest_seconds?: number
          sets?: number
          workout_day_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          user_id: string
          workout_day_id: string | null
        }
        Insert: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          user_id: string
          workout_day_id?: string | null
        }
        Update: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          user_id?: string
          workout_day_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
