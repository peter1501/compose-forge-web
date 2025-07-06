import { Database } from '@/lib/supabase/types/database'

export type ComposeComponent = Database['public']['Tables']['compose_components']['Row']
export type ComposeComponentInsert = Database['public']['Tables']['compose_components']['Insert']
export type ComposeComponentUpdate = Database['public']['Tables']['compose_components']['Update']

export type ComposeComponentWithStats = Database['public']['Views']['compose_components_with_stats']['Row']

export type ComposeFavorite = Database['public']['Tables']['compose_favorites']['Row']
export type ComposeFavoriteInsert = Database['public']['Tables']['compose_favorites']['Insert']

export interface ComposeComponentWithAuthor extends ComposeComponent {
  author: {
    id: string
    username: string
    avatarUrl: string | null
  }
}

export type ComposeComponentCategory = 
  | 'recommended'
  | 'most-downloaded'
  | 'most-bookmarked'
  | 'newest'
  | 'trending'

export interface ComposeComponentFilters {
  category?: ComposeComponentCategory
  search?: string
  authorId?: string
  page?: number
  limit?: number
}

export interface ComposeComponentFormData {
  name: string
  description: string
  code: string
  category: string
  min_sdk_version?: number
  compose_version?: string
}

export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'kotlin'
  theme?: 'light' | 'dark'
  height?: string
  readOnly?: boolean
}

export const COMPOSE_COMPONENT_CATEGORIES = [
  { value: 'buttons', label: 'Buttons' },
  { value: 'cards', label: 'Cards' },
  { value: 'dialogs', label: 'Dialogs' },
  { value: 'forms', label: 'Forms' },
  { value: 'layouts', label: 'Layouts' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'text', label: 'Text' },
  { value: 'animations', label: 'Animations' },
  { value: 'other', label: 'Other' }
] as const

export const MAX_CODE_SIZE = 51200 // 50KB in bytes
export const DEFAULT_MIN_SDK_VERSION = 21
export const DEFAULT_COMPOSE_VERSION = '1.5.0'