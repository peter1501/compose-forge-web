import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NavigationLayout } from '@/components/navigation-layout'
import { listComposeComponents } from '@/lib/services/compose-components'
import { ComposeComponentGrid } from '@/components/compose-component-grid'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get recent components for the dashboard
  const { components } = await listComposeComponents({ limit: 8 })

  return (
    <NavigationLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here are the latest Jetpack Compose components.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Components</h2>
        {components.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              No components available yet. Be the first to create one!
            </p>
            <Link href="/components/new">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Create Component
              </button>
            </Link>
          </div>
        ) : (
          <ComposeComponentGrid components={components} />
        )}
      </div>

      {/* Floating Action Button */}
      <Link 
        href="/components/new"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Link>
    </NavigationLayout>
  )
}