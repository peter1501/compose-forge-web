import { createClient } from '@/utils/supabase/client'

export interface ComposeComponent {
  id: string
  name: string
  description: string
  code: string
  previewUrl?: string
  tags: string[]
  category: string
  authorId: string
  authorName?: string
  authorAvatar?: string
  downloads: number
  likes: number
  createdAt: string
  updatedAt: string
}

export interface SearchOptions {
  query?: string
  category?: string
  tags?: string[]
  limit?: number
  offset?: number
}

export async function searchComponents(options: SearchOptions = {}) {
  const supabase = createClient()
  const { query, category, tags, limit = 20, offset = 0 } = options
  
  let queryBuilder = supabase
    .from('components')
    .select(`
      *,
      profiles:authorId (
        username,
        avatarUrl
      )
    `)
  
  if (query) {
    queryBuilder = queryBuilder.textSearch('search_vector', query)
  }
  
  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }
  
  if (tags && tags.length > 0) {
    queryBuilder = queryBuilder.contains('tags', tags)
  }
  
  const { data, error } = await queryBuilder
    .range(offset, offset + limit - 1)
    .order('createdAt', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data?.map(transformComponent) || []
}

export async function getComponent(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('components')
    .select(`
      *,
      profiles:authorId (
        username,
        avatarUrl
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return transformComponent(data)
}

export async function getPopularComponents(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('components')
    .select(`
      *,
      profiles:authorId (
        username,
        avatarUrl
      )
    `)
    .order('downloads', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data?.map(transformComponent) || []
}

export async function getRecentComponents(limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('components')
    .select(`
      *,
      profiles:authorId (
        username,
        avatarUrl
      )
    `)
    .order('createdAt', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data?.map(transformComponent) || []
}

export async function incrementDownloads(componentId: string) {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('increment_component_downloads', {
    component_id: componentId
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function likeComponent(componentId: string) {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('increment_component_likes', {
    component_id: componentId
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

function transformComponent(data: any): ComposeComponent {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    code: data.code,
    previewUrl: data.previewUrl,
    tags: data.tags || [],
    category: data.category,
    authorId: data.authorId,
    authorName: data.profiles?.username,
    authorAvatar: data.profiles?.avatarUrl,
    downloads: data.downloads || 0,
    likes: data.likes || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}