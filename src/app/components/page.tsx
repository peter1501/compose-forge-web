import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { ComposeComponentGrid } from '@/components/compose-component-grid'
import { Package, Users, Download, Star } from 'lucide-react'

export default async function ComponentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Sample data - replace with actual data from Supabase
  const featuredComponents = [
    {
      id: '1',
      title: 'Material 3 Button Collection',
      description: 'Complete set of Material 3 buttons including filled, outlined, text, and elevated variants with proper theming.',
      author: { name: 'Compose Forge Team' },
      downloads: 5234,
      stars: 423,
      category: 'Buttons'
    },
    {
      id: '2',
      title: 'Adaptive Navigation Rail',
      description: 'Responsive navigation rail that adapts between bottom bar, rail, and drawer based on screen size.',
      author: { name: 'Alex Chen' },
      downloads: 3876,
      stars: 312,
      category: 'Navigation'
    },
    {
      id: '3',
      title: 'Dynamic Theme Switcher',
      description: 'Material You dynamic color theme switcher with smooth animations and persistent preferences.',
      author: { name: 'Maria Garcia' },
      downloads: 4521,
      stars: 389,
      category: 'Theming'
    },
    {
      id: '4',
      title: 'Animated Card Stack',
      description: 'Swipeable card stack with spring physics animations, perfect for onboarding or content browsing.',
      author: { name: 'David Kim' },
      downloads: 2987,
      stars: 267,
      category: 'Cards'
    },
    {
      id: '5',
      title: 'Search Bar with Filters',
      description: 'Material 3 search bar with animated filter chips and real-time search suggestions.',
      author: { name: 'Sophie Turner' },
      downloads: 3654,
      stars: 298,
      category: 'Input'
    },
    {
      id: '6',
      title: 'Bottom Sheet Templates',
      description: 'Collection of bottom sheet components with different heights, drag gestures, and content layouts.',
      author: { name: 'James Wilson' },
      downloads: 4123,
      stars: 356,
      category: 'Sheets'
    },
    {
      id: '7',
      title: 'Data Table Component',
      description: 'Feature-rich data table with sorting, filtering, pagination, and row selection capabilities.',
      author: { name: 'Emma Brown' },
      downloads: 2789,
      stars: 234,
      category: 'Tables'
    },
    {
      id: '8',
      title: 'Loading Animations',
      description: 'Beautiful loading indicators including circular progress, skeleton screens, and shimmer effects.',
      author: { name: 'Lucas Martinez' },
      downloads: 5678,
      stars: 445,
      category: 'Progress'
    }
  ]

  return (
    <NavigationLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Library</h1>
        <p className="text-muted-foreground">
          Production-ready Jetpack Compose components following Material 3 guidelines
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative overflow-hidden bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 to-transparent" />
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-chart-1/10 group-hover:bg-chart-1/20 transition-colors">
            <Package className="h-5 w-5 text-chart-1" />
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-chart-1 mb-1">1,234</div>
            <div className="text-sm text-muted-foreground font-medium">Total Components</div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 to-transparent" />
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
            <Users className="h-5 w-5 text-chart-2" />
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-chart-2 mb-1">567</div>
            <div className="text-sm text-muted-foreground font-medium">Active Creators</div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent" />
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
            <Download className="h-5 w-5 text-chart-3" />
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-chart-3 mb-1">89K</div>
            <div className="text-sm text-muted-foreground font-medium">Downloads</div>
          </div>
        </div>
        <div className="relative overflow-hidden bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-4/10 to-transparent" />
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
            <Star className="h-5 w-5 text-chart-4" />
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-chart-4 mb-1">4.8</div>
            <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
          </div>
        </div>
      </div>

      <ComposeComponentGrid components={featuredComponents} />

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Load More Components
        </button>
      </div>
    </NavigationLayout>
  )
}