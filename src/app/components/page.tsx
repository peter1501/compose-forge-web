'use client'

import { useState, useEffect } from 'react'
import { NavigationLayout } from '@/components/navigation-layout'
import { ComposeComponentGrid } from '@/components/compose-component-grid'
import { Package, Users, Download, Heart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComposeComponentWithStats, ComposeComponentCategory } from '@/lib/types'

const CATEGORIES: { value: ComposeComponentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'newest', label: 'Newest' },
  { value: 'most-downloaded', label: 'Most Downloaded' },
  { value: 'most-bookmarked', label: 'Most Bookmarked' },
  { value: 'trending', label: 'Trending' },
  { value: 'recommended', label: 'Recommended' },
]

export default function ComponentsPage() {
  const router = useRouter()
  const [components, setComponents] = useState<ComposeComponentWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ComposeComponentCategory | 'all'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadComponents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page])

  const loadComponents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (category !== 'all') {
        params.append('category', category)
      }
      
      const response = await fetch(`/api/compose-components?${params}`)
      const data = await response.json()
      
      setComponents(data.components)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async (componentId: string, isFavorited: boolean) => {
    try {
      const response = await fetch(`/api/compose-components/${componentId}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to toggle favorite')
      }
      
      // Reload components to get updated favorite counts
      loadComponents()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <NavigationLayout>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Component Library</h1>
          <p className="text-muted-foreground">
            Production-ready Jetpack Compose components following Material 3 guidelines
          </p>
        </div>
        <Link href="/components/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Component
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              category === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Components Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : components.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No components found in this category.
          </p>
          <Link href="/components/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create the First One
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <ComposeComponentGrid 
            components={components}
            onFavoriteToggled={handleFavoriteToggle}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </NavigationLayout>
  )
}