'use client'

import { useEffect, useState } from 'react'
import { useComponentStats } from '@/hooks/useComponentStats'
import { ComponentStats } from '@/components/component-stats'
import { FavoriteButton } from '@/components/favorite-button'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ComposeComponentWithStats } from '@/lib/types'

interface ComponentDetailClientProps {
  component: ComposeComponentWithStats
  user?: any
}

export function ComponentDetailClient({ component, user }: ComponentDetailClientProps) {
  const { stats, trackView, trackDownload, toggleFavorite } = useComponentStats(component.id)
  const [debugMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('debugStats') === 'true'
    }
    return false
  })

  // Track view on mount
  useEffect(() => {
    if (user) {
      trackView()
    }
  }, [user, trackView])

  // Debug logging
  useEffect(() => {
    if (debugMode) {
      console.log('Component Detail Debug:', {
        componentId: component.id,
        initialData: {
          view_count: component.view_count,
          download_count: component.download_count,
          favorite_count: component.favorite_count,
          is_favorited: component.is_favorited
        },
        hookStats: stats,
        user: user?.id
      })
    }
  }, [component, stats, user, debugMode])

  const handleDownload = async () => {
    // Track download
    if (user) {
      await trackDownload()
    }

    // Download the file
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.replace(/\s+/g, '_')}.kt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Use stats from hook if available, otherwise use initial data
  const viewCount = stats?.viewCount ?? component.view_count
  const downloadCount = stats?.downloadCount ?? component.download_count
  const favoriteCount = stats?.favoriteCount ?? component.favorite_count
  const isFavorited = stats?.isFavoritedByUser ?? component.is_favorited

  return (
    <>
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ComponentStats
            viewCount={viewCount}
            downloadCount={downloadCount}
            favoriteCount={favoriteCount}
            isFavorited={isFavorited}
            size="lg"
            showLabels
            className="justify-between"
          />
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <FavoriteButton
            componentId={component.id}
            isFavorited={isFavorited}
            onToggle={toggleFavorite}
            className="w-full"
            variant={isFavorited ? "secondary" : "default"}
          />
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Component
          </Button>
        </CardContent>
      </Card>
    </>
  )
}