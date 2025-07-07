import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { ComposeComponentGrid } from '@/components/compose-components/component-grid'
import { Package, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's favorite component IDs
  const { data: interactions, error: interactionsError } = await supabase
    .from('component_interactions')
    .select('component_id')
    .eq('user_id', user.id)
    .eq('interaction_type', 'favorite')

  const favoriteIds = interactions?.map(i => i.component_id) || []

  // Fetch component details for favorites
  let components = []
  if (favoriteIds.length > 0) {
    const { data, error } = await supabase
      .from('compose_components')
      .select(`
        *,
        author:profiles!compose_components_author_id_fkey(username, avatarUrl)
      `)
      .in('id', favoriteIds)
      .order('created_at', { ascending: false })

    if (!error && data) {
      // Add favorite status to components
      components = data.map(component => ({
        ...component,
        is_favorited: true,
        favorite_count: 0 // Will be loaded from stats
      }))
    }
  }

  const handleFavoriteToggle = async (componentId: string, isFavorited: boolean) => {
    'use server'
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    try {
      if (isFavorited) {
        // Remove favorite
        await supabase
          .from('component_interactions')
          .delete()
          .eq('user_id', user.id)
          .eq('component_id', componentId)
          .eq('interaction_type', 'favorite')
      } else {
        // Add favorite
        await supabase
          .from('component_interactions')
          .insert({
            user_id: user.id,
            component_id: componentId,
            interaction_type: 'favorite'
          })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <NavigationLayout user={user}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Components you&apos;ve marked as favorites for quick access
          </p>
        </div>

        {components.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              You haven&apos;t favorited any components yet.
            </p>
            <Link href="/components">
              <Button>
                Browse Components
              </Button>
            </Link>
          </div>
        ) : (
          <ComposeComponentGrid 
            components={components}
            onFavoriteToggled={handleFavoriteToggle}
          />
        )}
      </div>
    </NavigationLayout>
  )
}