import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export interface AuthError {
  message: string
  code?: string
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data.user
}

export async function signUp(email: string, password: string, username?: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data.user
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function updateProfile(updates: { 
  username?: string
  displayName?: string
  bio?: string
  avatarUrl?: string 
}) {
  const supabase = createClient()
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('No user logged in')
  }
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    
  if (error) {
    throw new Error(error.message)
  }
}