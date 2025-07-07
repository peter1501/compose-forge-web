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

    // Toggle favorite using RPC directly
    const { data: isFavorited, error } = await supabase.rpc('track_component_interaction', {
      p_user_id: user.id,
      p_component_id: id,
      p_interaction_type: 'favorite'
    })

    if (error) {
      console.error('RPC error:', error)
      throw error
    }

    return NextResponse.json({ success: true, isFavorited })
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to toggle favorite', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  // For backwards compatibility, DELETE also toggles favorite
  return POST(request, params)
}