import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { ComponentStats } from '@/lib/services/component-stats'

interface UseComponentStatsReturn {
  stats: ComponentStats | null
  loading: boolean
  error: string | null
  trackView: () => Promise<void>
  trackDownload: () => Promise<void>
  toggleFavorite: () => Promise<void>
  refreshStats: () => Promise<void>
}

export function useComponentStats(componentId: string): UseComponentStatsReturn {
  const { user } = useAuth()
  const [stats, setStats] = useState<ComponentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/components/${componentId}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [componentId])

  const trackView = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/components/${componentId}/view`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to track view')
      
      // Update local stats optimistically
      setStats(prevStats => {
        if (prevStats && !prevStats.isViewedByUser) {
          return {
            ...prevStats,
            viewCount: prevStats.viewCount + 1,
            isViewedByUser: true
          }
        }
        return prevStats
      })
      
      // Refresh to ensure consistency
      setTimeout(() => fetchStats(), 1000)
    } catch (err) {
      console.error('Error tracking view:', err)
    }
  }, [componentId, user, fetchStats])

  const trackDownload = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/components/${componentId}/download`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to track download')
      
      // Update local stats optimistically
      setStats(prevStats => {
        if (prevStats && !prevStats.isDownloadedByUser) {
          return {
            ...prevStats,
            downloadCount: prevStats.downloadCount + 1,
            isDownloadedByUser: true
          }
        }
        return prevStats
      })
      
      // Refresh to ensure consistency
      setTimeout(() => fetchStats(), 1000)
    } catch (err) {
      console.error('Error tracking download:', err)
    }
  }, [componentId, user, fetchStats])

  const toggleFavorite = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/components/${componentId}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      
      const { isFavorited } = await response.json()
      
      // Update local stats optimistically
      setStats(prevStats => {
        if (prevStats) {
          return {
            ...prevStats,
            favoriteCount: isFavorited 
              ? prevStats.favoriteCount + 1 
              : Math.max(0, prevStats.favoriteCount - 1),
            isFavoritedByUser: isFavorited
          }
        }
        return prevStats
      })
      
      // Refresh stats from server to ensure consistency
      setTimeout(() => fetchStats(), 500)
    } catch (err) {
      console.error('Error toggling favorite:', err)
      // Refresh on error to restore correct state
      fetchStats()
    }
  }, [componentId, user, fetchStats])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    trackView,
    trackDownload,
    toggleFavorite,
    refreshStats: fetchStats
  }
}