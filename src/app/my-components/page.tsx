import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserComposeComponents } from '@/lib/services/compose-components'
import { ComposeComponentGrid } from '@/components/compose-component-grid'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function MyComponentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const components = await getUserComposeComponents(user.id)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Compose Components</h1>
          <p className="text-muted-foreground mt-2">
            Manage your published Jetpack Compose components
          </p>
        </div>
        <Link href="/components/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Component
          </Button>
        </Link>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any components yet.
          </p>
          <Link href="/components/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Component
            </Button>
          </Link>
        </div>
      ) : (
        <ComposeComponentGrid 
          components={components} 
          showActions={true}
        />
      )}
    </div>
  )
}