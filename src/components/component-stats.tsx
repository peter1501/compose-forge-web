'use client'

import { Eye, Download, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComponentStatsProps {
  viewCount: number
  downloadCount: number
  favoriteCount: number
  isFavorited?: boolean
  onFavoriteClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

export function ComponentStats({
  viewCount,
  downloadCount,
  favoriteCount,
  isFavorited = false,
  onFavoriteClick,
  className,
  size = 'md',
  showLabels = false
}: ComponentStatsProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-3 w-3',
      text: 'text-xs',
      gap: 'gap-3'
    },
    md: {
      icon: 'h-4 w-4',
      text: 'text-sm',
      gap: 'gap-4'
    },
    lg: {
      icon: 'h-5 w-5',
      text: 'text-base',
      gap: 'gap-5'
    }
  }

  const { icon, text, gap } = sizeClasses[size]

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className={cn('flex items-center', gap, className)}>
      <div className="flex items-center gap-1.5">
        <Eye className={cn('text-muted-foreground', icon)} />
        <span className={cn('text-muted-foreground', text)}>
          {formatCount(viewCount)}
          {showLabels && ' views'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Download className={cn('text-muted-foreground', icon)} />
        <span className={cn('text-muted-foreground', text)}>
          {formatCount(downloadCount)}
          {showLabels && ' downloads'}
        </span>
      </div>

      <button
        onClick={onFavoriteClick}
        className={cn(
          'flex items-center gap-1.5 transition-colors',
          onFavoriteClick && 'hover:text-red-500',
          !onFavoriteClick && 'cursor-default'
        )}
        disabled={!onFavoriteClick}
      >
        <Heart
          className={cn(
            icon,
            isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          )}
        />
        <span className={cn('text-muted-foreground', text)}>
          {formatCount(favoriteCount)}
          {showLabels && ' favorites'}
        </span>
      </button>
    </div>
  )
}