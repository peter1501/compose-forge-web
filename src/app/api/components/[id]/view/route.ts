import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Track view using RPC directly
    const { data, error } = await supabase.rpc('track_component_interaction', {
      p_user_id: user.id,
      p_component_id: id,
      p_interaction_type: 'view'
    })

    if (error) {
      console.error('RPC error:', error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Failed to track view', details: String(error) },
      { status: 500 }
    )
  }
}