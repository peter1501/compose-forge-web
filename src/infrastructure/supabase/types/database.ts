export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      components: {
        Row: {
          id: string
          name: string
          description: string
          code: string
          preview_code: string | null
          tags: string[]
          category: string
          author_id: string
          downloads: number
          likes: number
          version: string
          dependencies: string[]
          material3_compliant: boolean
          accessibility_score: number
          accessibility_issues: string[]
          accessibility_wcag_level: 'A' | 'AA' | 'AAA' | 'None'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          code: string
          preview_code?: string | null
          tags?: string[]
          category: string
          author_id: string
          downloads?: number
          likes?: number
          version: string
          dependencies?: string[]
          material3_compliant?: boolean
          accessibility_score?: number
          accessibility_issues?: string[]
          accessibility_wcag_level?: 'A' | 'AA' | 'AAA' | 'None'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          code?: string
          preview_code?: string | null
          tags?: string[]
          category?: string
          author_id?: string
          downloads?: number
          likes?: number
          version?: string
          dependencies?: string[]
          material3_compliant?: boolean
          accessibility_score?: number
          accessibility_issues?: string[]
          accessibility_wcag_level?: 'A' | 'AA' | 'AAA' | 'None'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          github_url: string | null
          website_url: string | null
          role: 'user' | 'author' | 'moderator' | 'admin'
          subscription_tier: 'free' | 'pro' | 'team'
          ai_generations_used: number
          ai_generations_limit: number
          private_components_count: number
          subscription_expires_at: string | null
          theme_preference: 'light' | 'dark' | 'system'
          email_notifications: boolean
          public_profile: boolean
          default_language: string
          total_downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          github_url?: string | null
          website_url?: string | null
          role?: 'user' | 'author' | 'moderator' | 'admin'
          subscription_tier?: 'free' | 'pro' | 'team'
          ai_generations_used?: number
          ai_generations_limit?: number
          private_components_count?: number
          subscription_expires_at?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
          email_notifications?: boolean
          public_profile?: boolean
          default_language?: string
          total_downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          github_url?: string | null
          website_url?: string | null
          role?: 'user' | 'author' | 'moderator' | 'admin'
          subscription_tier?: 'free' | 'pro' | 'team'
          ai_generations_used?: number
          ai_generations_limit?: number
          private_components_count?: number
          subscription_expires_at?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
          email_notifications?: boolean
          public_profile?: boolean
          default_language?: string
          total_downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      component_metrics: {
        Row: {
          component_id: string
          weekly_downloads: number
          monthly_downloads: number
          total_downloads: number
          average_rating: number
          total_ratings: number
          updated_at: string
        }
        Insert: {
          component_id: string
          weekly_downloads?: number
          monthly_downloads?: number
          total_downloads?: number
          average_rating?: number
          total_ratings?: number
          updated_at?: string
        }
        Update: {
          component_id?: string
          weekly_downloads?: number
          monthly_downloads?: number
          total_downloads?: number
          average_rating?: number
          total_ratings?: number
          updated_at?: string
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
      increment_ai_usage: {
        Args: {
          user_id: string
        }
        Returns: void
      }
    }
  }
}