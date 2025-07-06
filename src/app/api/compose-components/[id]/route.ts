import { NextRequest, NextResponse } from 'next/server'
import { 
  getComposeComponent, 
  updateComposeComponent, 
  deleteComposeComponent 
} from '@/lib/services/compose-components'
import { createClient } from '@/utils/supabase/server'
import { MAX_CODE_SIZE } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const component = await getComposeComponent(params.id)
    return NextResponse.json(component)
  } catch (error) {
    console.error('Error getting compose component:', error)
    return NextResponse.json(
      { error: 'Component not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user owns the component
    const component = await getComposeComponent(params.id)
    if (component.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Validate code size if provided
    if (body.code && body.code.length > MAX_CODE_SIZE) {
      return NextResponse.json(
        { error: `Code size exceeds maximum limit of ${MAX_CODE_SIZE} bytes` },
        { status: 400 }
      )
    }
    
    const updated = await updateComposeComponent(params.id, body)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating compose component:', error)
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user owns the component
    const component = await getComposeComponent(params.id)
    if (component.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    await deleteComposeComponent(params.id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting compose component:', error)
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}