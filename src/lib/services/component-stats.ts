import { createClient } from '@/utils/supabase/client'

export interface ComponentStats {
  viewCount: number
  downloadCount: number
  favoriteCount: number
  isViewedByUser: boolean
  isDownloadedByUser: boolean
  isFavoritedByUser: boolean
}

export interface CreatorStats {
  totalViews: number
  totalDownloads: number
  totalFavorites: number
  componentStats: {
    componentId: string
    componentName: string
    viewCount: number
    downloadCount: number
    favoriteCount: number
    lastViewedAt: string | null
    lastDownloadedAt: string | null
  }[]
}

export class ComponentStatsService {
  private supabase = createClient()

  async trackView(componentId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('track_component_interaction', {
        p_user_id: userId,
        p_component_id: componentId,
        p_interaction_type: 'view'
      })

      if (error) throw error
    } catch (error) {
      console.error('Error tracking view:', error)
      throw error
    }
  }

  async trackDownload(componentId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('track_component_interaction', {
        p_user_id: userId,
        p_component_id: componentId,
        p_interaction_type: 'download'
      })

      if (error) throw error
    } catch (error) {
      console.error('Error tracking download:', error)
      throw error
    }
  }

  async toggleFavorite(componentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('track_component_interaction', {
        p_user_id: userId,
        p_component_id: componentId,
        p_interaction_type: 'favorite'
      })

      if (error) throw error
      return data as boolean
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  async getComponentStats(componentId: string, userId?: string): Promise<ComponentStats> {
    try {
      const { data, error } = await this.supabase.rpc('get_component_stats_for_user', {
        p_component_id: componentId,
        p_user_id: userId || null
      })

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          viewCount: 0,
          downloadCount: 0,
          favoriteCount: 0,
          isViewedByUser: false,
          isDownloadedByUser: false,
          isFavoritedByUser: false
        }
      }

      const stats = data[0]
      return {
        viewCount: Number(stats.view_count),
        downloadCount: Number(stats.download_count),
        favoriteCount: Number(stats.favorite_count),
        isViewedByUser: stats.is_viewed_by_user || false,
        isDownloadedByUser: stats.is_downloaded_by_user || false,
        isFavoritedByUser: stats.is_favorited_by_user || false
      }
    } catch (error) {
      console.error('Error getting component stats:', error)
      throw error
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('component_interactions')
        .select('component_id')
        .eq('user_id', userId)
        .eq('interaction_type', 'favorite')

      if (error) throw error

      return data?.map(item => item.component_id) || []
    } catch (error) {
      console.error('Error getting user favorites:', error)
      throw error
    }
  }

  async getCreatorStats(creatorId: string): Promise<CreatorStats> {
    try {
      // Get all components by the creator
      const { data: components, error: componentsError } = await this.supabase
        .from('compose_components')
        .select('id, name')
        .eq('author_id', creatorId)

      if (componentsError) throw componentsError

      if (!components || components.length === 0) {
        return {
          totalViews: 0,
          totalDownloads: 0,
          totalFavorites: 0,
          componentStats: []
        }
      }

      // Get stats for all components
      const componentIds = components.map(c => c.id)
      const { data: stats, error: statsError } = await this.supabase
        .from('component_stats')
        .select('*')
        .in('component_id', componentIds)

      if (statsError) throw statsError

      // Calculate totals and format response
      let totalViews = 0
      let totalDownloads = 0
      let totalFavorites = 0

      const componentStats = components.map(component => {
        const stat = stats?.find(s => s.component_id === component.id)
        const viewCount = Number(stat?.view_count || 0)
        const downloadCount = Number(stat?.download_count || 0)
        const favoriteCount = Number(stat?.favorite_count || 0)

        totalViews += viewCount
        totalDownloads += downloadCount
        totalFavorites += favoriteCount

        return {
          componentId: component.id,
          componentName: component.name,
          viewCount,
          downloadCount,
          favoriteCount,
          lastViewedAt: stat?.last_viewed_at || null,
          lastDownloadedAt: stat?.last_downloaded_at || null
        }
      })

      return {
        totalViews,
        totalDownloads,
        totalFavorites,
        componentStats: componentStats.sort((a, b) => b.viewCount - a.viewCount)
      }
    } catch (error) {
      console.error('Error getting creator stats:', error)
      throw error
    }
  }
}

export const componentStatsService = new ComponentStatsService()