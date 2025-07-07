import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { componentStatsService } from '@/lib/services/component-stats'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's favorite component IDs
    const favoriteIds = await componentStatsService.getUserFavorites(user.id)

    // Fetch component details for favorites
    if (favoriteIds.length > 0) {
      const { data: components, error } = await supabase
        .from('compose_components')
        .select('*')
        .in('id', favoriteIds)

      if (error) throw error

      return NextResponse.json({ favorites: components || [] })
    }

    return NextResponse.json({ favorites: [] })
  } catch (error) {
    console.error('Error getting user favorites:', error)
    return NextResponse.json(
      { error: 'Failed to get favorites' },
      { status: 500 }
    )
  }
}