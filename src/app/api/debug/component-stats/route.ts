import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { componentId } = await request.json()
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Query component_interactions directly
    const { data: interactions, error: interactionsError } = await supabase
      .from('component_interactions')
      .select('*')
      .eq('component_id', componentId)
    
    // Query component_stats view
    const { data: statsView, error: statsError } = await supabase
      .from('component_stats')
      .select('*')
      .eq('component_id', componentId)
      .single()
    
    // Query compose_components_with_stats view
    const { data: withStatsView, error: withStatsError } = await supabase
      .from('compose_components_with_stats')
      .select('*')
      .eq('id', componentId)
      .single()
    
    // Check user's interactions
    let userInteractions = null
    if (user) {
      const { data: userInt } = await supabase
        .from('component_interactions')
        .select('*')
        .eq('component_id', componentId)
        .eq('user_id', user.id)
      userInteractions = userInt
    }
    
    return NextResponse.json({
      userId: user?.id,
      componentId,
      interactions: {
        data: interactions,
        error: interactionsError,
        count: interactions?.length || 0
      },
      statsView: {
        data: statsView,
        error: statsError
      },
      withStatsView: {
        data: withStatsView,
        error: withStatsError
      },
      userInteractions: userInteractions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}