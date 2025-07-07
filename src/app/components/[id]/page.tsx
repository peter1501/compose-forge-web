import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getComposeComponentWithStats } from '@/lib/services/compose-components'
import { NavigationLayout } from '@/components/navigation-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ComponentDetailView } from '@/components/compose-components/component-detail-view'
import { ComponentDetailClient } from './_components/component-detail-client'

export default async function ComponentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let component
  try {
    component = await getComposeComponentWithStats(id)
  } catch (error) {
    notFound()
  }

  return (
    <NavigationLayout user={user}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
              <p className="text-muted-foreground text-lg">{component.description}</p>
            </div>

            <ComponentDetailView component={component} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats and Actions */}
            <ComponentDetailClient component={component} user={user} />

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{component.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Min SDK</span>
                  <span className="font-medium">{component.min_sdk_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Compose Version</span>
                  <span className="font-medium">{component.compose_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(component.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/profile/${component.author_id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                  <div>
                    <p className="font-semibold">Author</p>
                    <p className="text-sm text-muted-foreground">View Profile</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationLayout>
  )
}