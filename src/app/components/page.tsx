import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { listComposeComponents } from '@/lib/services/compose-components'
import { ComponentsList } from './_components/components-list'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { ComposeComponentCategory } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{
    category?: ComposeComponentCategory
    page?: string
  }>
}

export default async function ComponentsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const params = await searchParams
  const category = params.category
  const page = params.page ? parseInt(params.page) : 1

  // Fetch components
  let components = []
  let totalPages = 1
  try {
    const result = await listComposeComponents({ 
      category, 
      page,
      limit: 12 
    }, supabase)
    components = result.components
    totalPages = result.totalPages
  } catch (error) {
    console.error('Error loading components:', error)
  }

  return (
    <NavigationLayout user={user}>
      <Suspense 
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ComponentsList 
          initialComponents={components}
          initialCategory={category || 'newest'}
          initialPage={page}
          totalPages={totalPages}
          user={user}
        />
      </Suspense>
    </NavigationLayout>
  )
}