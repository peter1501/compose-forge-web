export interface Database {
  public: {
    Tables: {
      compose_components: {
        Row: {
          id: string
          name: string
          description: string
          code: string
          category: string
          preview_url: string | null
          author_id: string
          created_at: string
          updated_at: string
          view_count: number
          download_count: number
          imports: string | null
          min_sdk_version: number
          compose_version: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          code: string
          category: string
          preview_url?: string | null
          author_id: string
          created_at?: string
          updated_at?: string
          view_count?: number
          download_count?: number
          imports?: string | null
          min_sdk_version?: number
          compose_version?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          code?: string
          category?: string
          preview_url?: string | null
          author_id?: string
          created_at?: string
          updated_at?: string
          view_count?: number
          download_count?: number
          imports?: string | null
          min_sdk_version?: number
          compose_version?: string
        }
      }
      compose_favorites: {
        Row: {
          user_id: string
          compose_component_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          compose_component_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          compose_component_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatarUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id: string
          username: string
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          username?: string
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      compose_components_with_stats: {
        Row: {
          id: string
          name: string
          description: string
          code: string
          category: string
          preview_url: string | null
          author_id: string
          created_at: string
          updated_at: string
          view_count: number
          download_count: number
          imports: string | null
          min_sdk_version: number
          compose_version: string
          favorite_count: number
          is_favorited: boolean
        }
      }
    }
    Functions: {
      increment_component_downloads: {
        Args: {
          component_id: string
        }
        Returns: void
      }
      increment_component_likes: {
        Args: {
          component_id: string
        }
        Returns: void
      }
    }
    Enums: {}
  }
}