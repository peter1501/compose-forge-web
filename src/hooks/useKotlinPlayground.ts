'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    KotlinPlayground: any
  }
}

interface KotlinPlaygroundConfig {
  server?: string
  version?: string
  targetPlatform?: 'java' | 'js' | 'canvas' | 'compose-wasm'
  highlightOnly?: boolean
  theme?: 'default' | 'darcula' | 'idea'
  scrollbarStyle?: string
}

export function useKotlinPlayground(config?: KotlinPlaygroundConfig) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Check if script is already loaded
    if (window.KotlinPlayground) {
      setIsLoaded(true)
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="kotlin-playground"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsLoaded(true)
      })
      return
    }

    // Create and load the script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/kotlin-playground@1'
    script.async = true
    
    // Set data attributes for configuration
    if (config?.server) script.setAttribute('data-server', config.server)
    if (config?.version) script.setAttribute('data-version', config.version)
    if (config?.targetPlatform) script.setAttribute('data-target-platform', config.targetPlatform)
    if (config?.highlightOnly !== undefined) {
      script.setAttribute('data-highlight-only', config.highlightOnly.toString())
    }
    if (config?.theme) script.setAttribute('data-theme', config.theme)
    if (config?.scrollbarStyle) script.setAttribute('data-scrollbar-style', config.scrollbarStyle)

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      setError(new Error('Failed to load Kotlin Playground script'))
    }

    document.head.appendChild(script)

    return () => {
      // We don't remove the script on cleanup as it might be used by other components
    }
  }, [config])

  return { isLoaded, error }
}