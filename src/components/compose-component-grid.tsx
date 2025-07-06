"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Download, Star, Code2, Eye } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ComposeComponentCardProps {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
  }
  downloads: number
  stars: number
  category: string
  preview?: string
}

export function ComposeComponentCard({ component, index }: { component: ComposeComponentCardProps; index: number }) {
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
          {component.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={component.preview} 
              alt={component.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Code2 className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Hover overlay with preview button */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {component.title}
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
                <span>{component.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{component.stars.toLocaleString()}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {component.category}
            </span>
          </div>

          {/* Author */}
          <div className="mt-4 pt-4 border-t border-border flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/80" />
            <span className="text-sm text-muted-foreground">by {component.author.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface ComposeComponentGridProps {
  components: ComposeComponentCardProps[]
}

export function ComposeComponentGrid({ components }: ComposeComponentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {components.map((component, index) => (
        <ComposeComponentCard key={component.id} component={component} index={index} />
      ))}
    </div>
  )
}