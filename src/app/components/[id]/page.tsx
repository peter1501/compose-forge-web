import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getComposeComponentWithStats } from '@/lib/services/compose-components'
import { NavigationLayout } from '@/components/navigation-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import { ComponentDetailView } from '@/components/compose-components/component-detail-view'
import { ComponentActions } from './_components/component-actions'

export default async function ComponentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let component
  try {
    component = await getComposeComponentWithStats(id)
    
    // Increment view count
    try {
      await supabase
        .from('compose_components')
        .update({ view_count: component.view_count + 1 })
        .eq('id', id)
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
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
            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>Downloads</span>
                    </div>
                    <span className="font-semibold">{component.download_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>Favorites</span>
                    </div>
                    <span className="font-semibold">{component.favorite_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Views</span>
                    </div>
                    <span className="font-semibold">{component.view_count.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <ComponentActions component={component} user={user} />

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