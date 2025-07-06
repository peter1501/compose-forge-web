import { NextRequest, NextResponse } from 'next/server'
import { createComposeComponent, listComposeComponents } from '@/lib/services/compose-components'
import { createClient } from '@/utils/supabase/server'
import { MAX_CODE_SIZE } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as any
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const result = await listComposeComponents({
      category,
      search,
      page,
      limit
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing compose components:', error)
    return NextResponse.json(
      { error: 'Failed to list components' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth check:', { user: user?.id, authError })
    
    if (!user) {
      console.error('No user found in request')
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to create components' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.description || !body.code || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate code size
    if (body.code.length > MAX_CODE_SIZE) {
      return NextResponse.json(
        { error: `Code size exceeds maximum limit of ${MAX_CODE_SIZE} bytes` },
        { status: 400 }
      )
    }
    
    const component = await createComposeComponent({
      name: body.name,
      description: body.description,
      code: body.code,
      category: body.category,
      imports: body.imports,
      min_sdk_version: body.min_sdk_version,
      compose_version: body.compose_version,
      author_id: user.id
    })
    
    return NextResponse.json(component, { status: 201 })
  } catch (error: any) {
    console.error('Error creating compose component:', error)
    
    // Check for specific database errors
    if (error.code === '42P01') {
      return NextResponse.json(
        { error: 'Database tables not found. Please run the migration first.' },
        { status: 503 }
      )
    }
    
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Please sign in to create components' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create component' },
      { status: 500 }
    )
  }
}