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
      component_interactions: {
        Row: {
          id: string
          user_id: string
          component_id: string
          interaction_type: 'view' | 'download' | 'favorite'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          component_id: string
          interaction_type: 'view' | 'download' | 'favorite'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          component_id?: string
          interaction_type?: 'view' | 'download' | 'favorite'
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
      component_stats: {
        Row: {
          component_id: string
          view_count: number
          download_count: number
          favorite_count: number
          last_viewed_at: string | null
          last_downloaded_at: string | null
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
      track_component_interaction: {
        Args: {
          p_user_id: string
          p_component_id: string
          p_interaction_type: string
        }
        Returns: boolean
      }
      get_component_stats_for_user: {
        Args: {
          p_component_id: string
          p_user_id?: string
        }
        Returns: {
          view_count: number
          download_count: number
          favorite_count: number
          is_viewed_by_user: boolean
          is_downloaded_by_user: boolean
          is_favorited_by_user: boolean
        }[]
      }
    }
    Enums: {}
  }
}