'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Heart } from 'lucide-react'
import type { ComposeComponentWithStats } from '@/lib/types'

interface ComponentActionsProps {
  component: ComposeComponentWithStats
  user?: any
}

export function ComponentActions({ component, user }: ComponentActionsProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(component.is_favorited)

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    // TODO: Implement server action for favorite toggle
    setIsFavorited(!isFavorited)
    console.log('Toggle favorite:', component.id)
  }

  const handleDownload = () => {
    // The code already includes package and imports
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

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Button 
          className="w-full" 
          variant={isFavorited ? "secondary" : "default"}
          onClick={handleFavoriteToggle}
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
          {isFavorited ? 'Unfavorite' : 'Favorite'}
        </Button>
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
  )
}