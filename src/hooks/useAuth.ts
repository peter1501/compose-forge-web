'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import * as authService from '@/lib/services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const user = await authService.signIn(email, password)
    setUser(user)
    return user
  }

  const signUp = async (email: string, password: string, username?: string) => {
    const user = await authService.signUp(email, password, username)
    setUser(user)
    return user
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile: authService.updateProfile
  }
}