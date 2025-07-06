"use client"

import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Star, Code2, Eye, Edit, Trash2, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ComposeComponentWithStats, ComposeComponentWithAuthor } from "@/lib/types"

interface ComposeComponentCardProps {
  component: ComposeComponentWithStats | ComposeComponentWithAuthor
  index: number
  showActions?: boolean
  onDelete?: (id: string) => void
  onToggleFavorite?: (id: string, isFavorited: boolean) => void
}

export function ComposeComponentCard({ 
  component, 
  index,
  showActions = false,
  onDelete,
  onToggleFavorite
}: ComposeComponentCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const isWithStats = 'favorite_count' in component
  const favoriteCount = isWithStats ? component.favorite_count : 0
  const isFavorited = isWithStats ? component.is_favorited : false
  
  const author = 'author' in component 
    ? component.author 
    : { username: 'Unknown', avatarUrl: null }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this component?')) {
      return
    }
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/compose-components/${component.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete component')
      }
      
      if (onDelete) {
        onDelete(component.id)
      }
    } catch (error) {
      console.error('Error deleting component:', error)
      alert('Failed to delete component')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/components/${component.id}/edit`)
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onToggleFavorite) {
      onToggleFavorite(component.id, isFavorited)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-muted-foreground hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/components/${component.id}`}>
        {/* Preview Section */}
        <div className="relative h-48 bg-background overflow-hidden">
          {component.preview_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={component.preview_url} 
              alt={component.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-4">
              <Code2 className="h-12 w-12 text-muted-foreground mb-2" />
              <pre className="text-xs text-muted-foreground overflow-hidden text-center max-h-20">
                {component.code.substring(0, 150)}...
              </pre>
            </div>
          )}
          
          {/* Hover overlay with preview button */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
              <Eye className="h-4 w-4" />
              <span>View Component</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {component.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {component.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{component.download_count.toLocaleString()}</span>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "flex items-center space-x-1 text-sm transition-colors",
                  isFavorited 
                    ? "text-red-500" 
                    : "text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                <span>{favoriteCount}</span>
              </button>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {component.category}
            </span>
          </div>

          {/* Author */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={author.avatarUrl} 
                  alt={author.username}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/80" />
              )}
              <span className="text-sm text-muted-foreground">by {author.username}</span>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface ComposeComponentGridProps {
  components: (ComposeComponentWithStats | ComposeComponentWithAuthor)[]
  showActions?: boolean
  onComponentDeleted?: (id: string) => void
  onFavoriteToggled?: (id: string, isFavorited: boolean) => void
}

export function ComposeComponentGrid({ 
  components,
  showActions = false,
  onComponentDeleted,
  onFavoriteToggled
}: ComposeComponentGridProps) {
  const [displayComponents, setDisplayComponents] = React.useState(components)
  
  React.useEffect(() => {
    setDisplayComponents(components)
  }, [components])
  
  const handleDelete = (id: string) => {
    setDisplayComponents(prev => prev.filter(c => c.id !== id))
    if (onComponentDeleted) {
      onComponentDeleted(id)
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayComponents.map((component, index) => (
        <ComposeComponentCard 
          key={component.id} 
          component={component} 
          index={index}
          showActions={showActions}
          onDelete={handleDelete}
          onToggleFavorite={onFavoriteToggled}
        />
      ))}
    </div>
  )
}