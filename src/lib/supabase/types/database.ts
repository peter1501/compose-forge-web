export interface Database {
  public: {
    Tables: {
      components: {
        Row: {
          id: string
          name: string
          description: string
          code: string
          previewUrl: string | null
          tags: string[]
          category: string
          authorId: string
          downloads: number
          likes: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          code: string
          previewUrl?: string | null
          tags?: string[]
          category: string
          authorId: string
          downloads?: number
          likes?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          code?: string
          previewUrl?: string | null
          tags?: string[]
          category?: string
          authorId?: string
          downloads?: number
          likes?: number
          createdAt?: string
          updatedAt?: string
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
    Views: {}
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