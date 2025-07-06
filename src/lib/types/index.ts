// Re-export common types used across the app
export type { ComposeComponent, SearchOptions } from '@/lib/services/compose-components'
export type { User } from '@supabase/supabase-js'

// Additional app-specific types
export interface Profile {
  id: string
  username: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  githubUrl?: string
  websiteUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Library {
  id: string
  name: string
  description: string
  authorId: string
  components: string[]
  isPublic: boolean
  stars: number
  createdAt: string
  updatedAt: string
}

export type ComposeComponentCategory = 
  | 'buttons'
  | 'inputs'
  | 'navigation'
  | 'layout'
  | 'feedback'
  | 'data-display'
  | 'surfaces'
  | 'other'

export type SubscriptionTier = 'free' | 'pro' | 'team'