import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    
    // Get authenticated user (optional for stats)
    const { data: { user } } = await supabase.auth.getUser()

    // Get component stats using RPC directly
    const { data, error } = await supabase.rpc('get_component_stats_for_user', {
      p_component_id: id,
      p_user_id: user?.id || null
    })

    if (error) {
      console.error('RPC error:', error)
      throw error
    }

    // The RPC returns an array, get the first result
    const stats = data?.[0] || {
      view_count: 0,
      download_count: 0,
      favorite_count: 0,
      is_viewed_by_user: false,
      is_downloaded_by_user: false,
      is_favorited_by_user: false
    }

    // Convert to camelCase for frontend consistency
    return NextResponse.json({
      viewCount: Number(stats.view_count),
      downloadCount: Number(stats.download_count),
      favoriteCount: Number(stats.favorite_count),
      isViewedByUser: stats.is_viewed_by_user,
      isDownloadedByUser: stats.is_downloaded_by_user,
      isFavoritedByUser: stats.is_favorited_by_user
    })
  } catch (error) {
    console.error('Error getting component stats:', error)
    return NextResponse.json(
      { error: 'Failed to get component stats', details: String(error) },
      { status: 500 }
    )
  }
}