import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NavigationLayout } from '@/components/navigation-layout'
import { ComponentGrid } from '@/components/component-grid'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Sample data - replace with actual data from Supabase
  const sampleComponents = [
    {
      id: '1',
      title: 'Modern Button Component',
      description: 'A sleek, customizable button with hover effects and multiple variants for Material 3.',
      author: { name: 'John Doe' },
      downloads: 2456,
      stars: 189,
      category: 'Buttons'
    },
    {
      id: '2',
      title: 'Dashboard Template',
      description: 'Complete dashboard layout with sidebar navigation and responsive Material 3 design.',
      author: { name: 'Jane Smith' },
      downloads: 1823,
      stars: 234,
      category: 'Templates'
    },
    {
      id: '3',
      title: 'Card Collection',
      description: 'Beautiful card components with various layouts and smooth animations.',
      author: { name: 'Mike Johnson' },
      downloads: 3201,
      stars: 412,
      category: 'Cards'
    },
    {
      id: '4',
      title: 'Navigation Drawer',
      description: 'Material 3 navigation drawer with gesture support and customizable items.',
      author: { name: 'Sarah Wilson' },
      downloads: 1567,
      stars: 178,
      category: 'Navigation'
    }
  ]

  return (
    <NavigationLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Components</h1>
        <p className="text-gray-400">
          Browse our collection of Material 3 Jetpack Compose components
        </p>
      </div>

      <ComponentGrid components={sampleComponents} />

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Load More Components
        </button>
      </div>

      {/* Floating Action Button */}
      <Link 
        href="/components/new"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Plus className="h-6 w-6 text-white" />
      </Link>
    </NavigationLayout>
  )
}