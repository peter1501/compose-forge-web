export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          variables?: Json
          operationName?: string
          query?: string
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      component_interactions: {
        Row: {
          component_id: string
          created_at: string | null
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          component_id: string
          created_at?: string | null
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          component_id?: string
          created_at?: string | null
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_interactions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_stats"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "component_interactions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "compose_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_interactions_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "compose_components_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      compose_components: {
        Row: {
          author_id: string
          category: string
          code: string
          compose_version: string | null
          created_at: string | null
          description: string
          download_count: number | null
          id: string
          min_sdk_version: number | null
          name: string
          preview_url: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          code: string
          compose_version?: string | null
          created_at?: string | null
          description: string
          download_count?: number | null
          id?: string
          min_sdk_version?: number | null
          name: string
          preview_url?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          code?: string
          compose_version?: string | null
          created_at?: string | null
          description?: string
          download_count?: number | null
          id?: string
          min_sdk_version?: number | null
          name?: string
          preview_url?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      compose_favorites: {
        Row: {
          compose_component_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          compose_component_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          compose_component_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compose_favorites_compose_component_id_fkey"
            columns: ["compose_component_id"]
            isOneToOne: false
            referencedRelation: "component_stats"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "compose_favorites_compose_component_id_fkey"
            columns: ["compose_component_id"]
            isOneToOne: false
            referencedRelation: "compose_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compose_favorites_compose_component_id_fkey"
            columns: ["compose_component_id"]
            isOneToOne: false
            referencedRelation: "compose_components_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      component_stats: {
        Row: {
          component_id: string | null
          download_count: number | null
          favorite_count: number | null
          last_downloaded_at: string | null
          last_viewed_at: string | null
          view_count: number | null
        }
        Relationships: []
      }
      compose_components_with_stats: {
        Row: {
          author_id: string | null
          category: string | null
          code: string | null
          compose_version: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          favorite_count: number | null
          id: string | null
          is_favorited: boolean | null
          min_sdk_version: number | null
          name: string | null
          preview_url: string | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_component_stats_for_user: {
        Args: { p_component_id: string; p_user_id?: string }
        Returns: {
          view_count: number
          download_count: number
          favorite_count: number
          is_downloaded_by_user: boolean
          is_favorited_by_user: boolean
          is_viewed_by_user: boolean
        }[]
      }
      refresh_component_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      track_component_interaction: {
        Args: {
          p_user_id: string
          p_component_id: string
          p_interaction_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

