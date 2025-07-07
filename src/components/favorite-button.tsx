'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  componentId: string
  isFavorited: boolean
  onToggle: () => Promise<void>
  className?: string
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
}

export function FavoriteButton({
  componentId,
  isFavorited,
  onToggle,
  className,
  variant = 'outline',
  size = 'default',
  showLabel = true
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      await onToggle()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all',
        isFavorited && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          showLabel && 'mr-2',
          isFavorited && 'fill-current'
        )}
      />
      {showLabel && (isFavorited ? 'Remove from Favorites' : 'Add to Favorites')}
    </Button>
  )
}