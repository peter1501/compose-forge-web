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

    // Get creator stats
    const stats = await componentStatsService.getCreatorStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting creator stats:', error)
    return NextResponse.json(
      { error: 'Failed to get creator stats' },
      { status: 500 }
    )
  }
}