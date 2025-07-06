'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ComposeComponentGrid } from '@/components/compose-components/component-grid'
import { Package, Plus, Filter, Download, Star, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ComposeComponentWithStats, ComposeComponentCategory } from '@/lib/types'

const FILTER_OPTIONS: { value: ComposeComponentCategory | 'all'; label: string; icon: any }[] = [
  { value: 'recommended', label: 'Recommended', icon: Sparkles },
  { value: 'most-downloaded', label: 'Most Downloaded', icon: Download },
  { value: 'most-bookmarked', label: 'Most Bookmarked', icon: Star },
  { value: 'newest', label: 'Newest', icon: Filter },
  { value: 'trending', label: 'Trending', icon: TrendingUp }
]

interface ComponentsListProps {
  initialComponents: ComposeComponentWithStats[]
  initialCategory: ComposeComponentCategory | 'all'
  initialPage: number
  totalPages: number
  user?: any
}

export function ComponentsList({ 
  initialComponents, 
  initialCategory, 
  initialPage, 
  totalPages,
  user 
}: ComponentsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [components] = useState(initialComponents)
  const [category, setCategory] = useState(initialCategory)
  const [page, setPage] = useState(initialPage)

  const updateCategory = (newCategory: typeof category) => {
    setCategory(newCategory)
    const params = new URLSearchParams(searchParams.toString())
    if (newCategory === 'all' || newCategory === 'newest') {
      params.delete('category')
    } else {
      params.set('category', newCategory)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const updatePage = (newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleFavoriteToggle = async (componentId: string, isFavorited: boolean) => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // TODO: Implement server action for favorite toggle
    console.log('Toggle favorite:', componentId, isFavorited)
    router.refresh()
  }

  return (
    <>
      {/* Filter Pills */}
      <div className="flex items-center space-x-2 pb-6 overflow-x-auto">
        {FILTER_OPTIONS.map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.value}
              onClick={() => updateCategory(filter.value)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                category === filter.value
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>

      {/* Components Grid */}
      {components.length === 0 ? (
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
                onClick={() => updatePage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => updatePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}