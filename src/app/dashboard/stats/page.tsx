import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Download, Heart, TrendingUp, Package } from 'lucide-react'
import { componentStatsService } from '@/lib/services/component-stats'
import Link from 'next/link'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get creator stats
  const stats = await componentStatsService.getCreatorStats(user.id)

  return (
    <NavigationLayout user={user}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Statistics</h1>
          <p className="text-muted-foreground">
            Track the performance and engagement of your components
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Components
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.componentStats.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Favorites
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFavorites.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Component Stats Table */}
        <Card>
          <CardHeader>
            <CardTitle>Component Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.componentStats.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any components yet.
                </p>
                <Link href="/components/new" className="text-primary hover:underline">
                  Create your first component
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium">Component</th>
                      <th className="text-center pb-3 font-medium">Views</th>
                      <th className="text-center pb-3 font-medium">Downloads</th>
                      <th className="text-center pb-3 font-medium">Favorites</th>
                      <th className="text-right pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.componentStats.map((component) => (
                      <tr key={component.componentId} className="border-b">
                        <td className="py-4">
                          <Link 
                            href={`/components/${component.componentId}`}
                            className="font-medium hover:text-primary"
                          >
                            {component.componentName}
                          </Link>
                        </td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{component.viewCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span>{component.downloadCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>{component.favoriteCount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="text-right py-4">
                          <Link 
                            href={`/components/${component.componentId}`}
                            className="text-sm text-primary hover:underline"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NavigationLayout>
  )
}