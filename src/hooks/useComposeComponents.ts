'use client'

import { useState, useEffect, useCallback } from 'react'
import * as composeComponentService from '@/lib/services/compose-components'
import { ComposeComponent, SearchOptions } from '@/lib/services/compose-components'

export function useComposeComponents(initialOptions?: SearchOptions) {
  const [components, setComponents] = useState<ComposeComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(async (options: SearchOptions = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await composeComponentService.searchComponents(options)
      setComponents(results)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    search(initialOptions)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { components, loading, error, search }
}

export function useComposeComponent(id: string | null) {
  const [component, setComponent] = useState<ComposeComponent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setComponent(null)
      return
    }

    setLoading(true)
    setError(null)

    composeComponentService.getComponent(id)
      .then(setComponent)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  const like = useCallback(async () => {
    if (!id) return
    
    try {
      await composeComponentService.likeComponent(id)
      // Refresh component data
      const updated = await composeComponentService.getComponent(id)
      setComponent(updated)
    } catch (err) {
      setError(err as Error)
    }
  }, [id])

  return { component, loading, error, like }
}

export function usePopularComponents(limit = 10) {
  const [components, setComponents] = useState<ComposeComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    composeComponentService.getPopularComponents(limit)
      .then(setComponents)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [limit])

  return { components, loading, error }
}

export function useRecentComponents(limit = 10) {
  const [components, setComponents] = useState<ComposeComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    composeComponentService.getRecentComponents(limit)
      .then(setComponents)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [limit])

  return { components, loading, error }
}