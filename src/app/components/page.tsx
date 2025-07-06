import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/presentation/components/navigation-layout'
import { ComponentGrid } from '@/presentation/components/component-grid'

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
        <p className="text-gray-400">
          Production-ready Jetpack Compose components following Material 3 guidelines
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">1,234</div>
          <div className="text-sm text-gray-400">Total Components</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">567</div>
          <div className="text-sm text-gray-400">Active Creators</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">89K</div>
          <div className="text-sm text-gray-400">Downloads</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">4.8</div>
          <div className="text-sm text-gray-400">Average Rating</div>
        </div>
      </div>

      <ComponentGrid components={featuredComponents} />

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Load More Components
        </button>
      </div>
    </NavigationLayout>
  )
}