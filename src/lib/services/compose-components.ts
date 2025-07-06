import { createClient } from '@/utils/supabase/client'
import type { 
  ComposeComponent, 
  ComposeComponentInsert, 
  ComposeComponentUpdate,
  ComposeComponentWithStats,
  ComposeComponentFilters,
  ComposeComponentWithAuthor,
  ComposeComponentCategory
} from '@/lib/types'

const ITEMS_PER_PAGE = 20

export async function createComposeComponent(data: ComposeComponentInsert) {
  const supabase = createClient()
  
  // If author_id is not provided, get it from the current user
  if (!data.author_id) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    data.author_id = user.user.id
  }
  
  const { data: component, error } = await supabase
    .from('compose_components')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return component
}

export async function updateComposeComponent(id: string, data: ComposeComponentUpdate) {
  const supabase = createClient()
  
  const { data: component, error } = await supabase
    .from('compose_components')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return component
}

export async function deleteComposeComponent(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('compose_components')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getComposeComponent(id: string): Promise<ComposeComponentWithAuthor> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('compose_components')
    .select(`
      *,
      author:profiles!author_id (
        id,
        username,
        avatarUrl
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as ComposeComponentWithAuthor
}

export async function getComposeComponentWithStats(id: string): Promise<ComposeComponentWithStats> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('compose_components_with_stats')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function listComposeComponents(filters: ComposeComponentFilters = {}) {
  const supabase = createClient()
  const { category, search, authorId, page = 1, limit = ITEMS_PER_PAGE } = filters
  const offset = (page - 1) * limit
  
  let query = supabase
    .from('compose_components_with_stats')
    .select('*', { count: 'exact' })
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  if (authorId) {
    query = query.eq('author_id', authorId)
  }
  
  // Apply category-based sorting
  switch (category) {
    case 'recommended':
      // For now, just show popular components
      query = query.order('favorite_count', { ascending: false })
      break
    case 'most-downloaded':
      query = query.order('download_count', { ascending: false })
      break
    case 'most-bookmarked':
      query = query.order('favorite_count', { ascending: false })
      break
    case 'trending':
      // Show components with recent activity (views in last 7 days)
      // For MVP, we'll use recent downloads
      query = query
        .order('download_count', { ascending: false })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }
  
  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  
  return {
    components: data || [],
    totalCount: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getUserComposeComponents(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('compose_components')
    .select(`
      *,
      author:profiles!author_id (
        id,
        username,
        avatarUrl
      )
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as ComposeComponentWithAuthor[]
}

export async function addFavorite(componentId: string) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('compose_favorites')
    .insert({
      user_id: user.user.id,
      compose_component_id: componentId
    })
  
  if (error && error.code !== '23505') { // Ignore duplicate key error
    throw error
  }
}

export async function removeFavorite(componentId: string) {
  const supabase = createClient()
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('compose_favorites')
    .delete()
    .eq('user_id', user.user.id)
    .eq('compose_component_id', componentId)
  
  if (error) throw error
}

export async function getUserFavorites(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('compose_favorites')
    .select(`
      compose_component_id,
      created_at,
      component:compose_components_with_stats!compose_component_id (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data?.map(fav => fav.component) || []
}

export async function incrementViewCount(componentId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .rpc('increment_component_views', {
      component_id: componentId
    })
  
  // If the function doesn't exist yet, we'll create it later
  if (error && !error.message.includes('does not exist')) {
    throw error
  }
}

export async function incrementDownloadCount(componentId: string) {
  const supabase = createClient()
  
  // First get the current count
  const { data: component, error: fetchError } = await supabase
    .from('compose_components')
    .select('download_count')
    .eq('id', componentId)
    .single()
  
  if (fetchError) throw fetchError
  
  // Then update with incremented value
  const { error: updateError } = await supabase
    .from('compose_components')
    .update({ 
      download_count: (component.download_count || 0) + 1
    })
    .eq('id', componentId)
  
  if (updateError) throw updateError
}

export async function downloadComposeComponent(componentId: string) {
  const component = await getComposeComponent(componentId)
  await incrementDownloadCount(componentId)
  
  // Create a Kotlin file content
  const kotlinContent = `package com.example.composeforge

${component.imports || ''}

/**
 * ${component.name}
 * 
 * ${component.description}
 * 
 * Downloaded from ComposeForge
 * Author: ${component.author.username}
 * Min SDK: ${component.min_sdk_version}
 * Compose Version: ${component.compose_version}
 */

${component.code}`
  
  return {
    content: kotlinContent,
    filename: `${component.name.replace(/\s+/g, '_')}.kt`
  }
}