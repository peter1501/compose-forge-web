import { NextRequest, NextResponse } from 'next/server'
import { downloadComposeComponent } from '@/lib/services/compose-components'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, filename } = await downloadComposeComponent(params.id)
    
    // Return the Kotlin file as a download
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error downloading compose component:', error)
    return NextResponse.json(
      { error: 'Failed to download component' },
      { status: 500 }
    )
  }
}