// Common database queries that can be reused across services
import { createClient } from '@/utils/supabase/client'

// Profile queries
export async function getProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Component metrics
export async function getComponentMetrics(componentId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('component_metrics')
    .select('*')
    .eq('component_id', componentId)
    .single()
    
  if (error && error.code !== 'PGRST116') throw error // Ignore not found
  return data
}

// Library queries
export async function getUserLibraries(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('libraries')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data || []
}

export async function getLibraryComponents(libraryId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('library_components')
    .select(`
      component_id,
      components (*)
    `)
    .eq('library_id', libraryId)
    
  if (error) throw error
  return data?.map(item => item.components) || []
}