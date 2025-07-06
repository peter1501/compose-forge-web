/**
 * KotlinPlayground - Base Component
 * 
 * Purpose: Core integration with the JetBrains Kotlin Playground library.
 * This component handles the low-level integration including:
 * - Loading and initializing the Kotlin Playground scripts
 * - Managing CodeMirror editor instances
 * - Handling code compilation and execution
 * - Detecting code changes through polling
 * 
 * Used by: KotlinComposeEditor, KotlinComposePreview
 * 
 * Note: This is a base component. For Compose-specific functionality,
 * use KotlinComposeEditor or KotlinComposePreview instead.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useKotlinPlayground } from '@/hooks/useKotlinPlayground'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface KotlinPlaygroundProps {
  code: string
  height?: string
  theme?: 'default' | 'darcula' | 'idea'
  targetPlatform?: 'java' | 'js' | 'canvas' | "compose-wasm"
  highlightOnly?: boolean
  outputHeight?: number
  autoComplete?: boolean
  highlightOnFly?: boolean
  onCodeChange?: (code: string) => void
  className?: string
  readOnly?: boolean
  autoRun?: boolean
}

export function KotlinPlayground({
  code,
  height = '500px',
  theme = 'darcula',
  targetPlatform = 'compose-wasm',
  highlightOnly = false,
  outputHeight = 200,
  autoComplete = false,
  highlightOnFly = false,
  onCodeChange,
  className,
  readOnly = false,
  autoRun = false
}: KotlinPlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { isLoaded, error } = useKotlinPlayground({
    theme,
    targetPlatform
  })

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !codeRef.current || isInitialized) {
      return
    }

    // Initialize Kotlin Playground on the code element
    try {
      if (window.KotlinPlayground) {
        // Create configuration object
        const config: any = {
          highlightOnly: highlightOnly,
          theme: theme,
          'data-target-platform': targetPlatform
        }

        if (outputHeight) {
          config['data-output-height'] = outputHeight.toString()
        }

        if (autoComplete) {
          config['data-autocomplete'] = 'true'
        }

        if (highlightOnFly) {
          config['highlight-on-fly'] = 'true'
        }

        if (readOnly) {
          config['none-editable'] = 'true'
        }

        // Apply configuration to the code element
        Object.entries(config).forEach(([key, value]) => {
          if (codeRef.current) {
            codeRef.current.setAttribute(key, value as string)
          }
        })

        // Initialize the playground
        window.KotlinPlayground(codeRef.current)
        setIsInitialized(true)

        // Set up code change listener if needed
        if (onCodeChange && !highlightOnly && !readOnly) {
          // Wait a bit for CodeMirror to fully initialize
          setTimeout(() => {
            // Poll for changes since Kotlin Playground doesn't expose a clean API
            const checkForChanges = () => {
              try {
                const codeMirror = containerRef.current?.querySelector('.CodeMirror')
                if (codeMirror) {
                  // Try to find the CodeMirror instance through various methods
                  let cmInstance = null
                  
                  // Method 1: Check if CodeMirror is attached to the element
                  if ((codeMirror as any).CodeMirror) {
                    cmInstance = (codeMirror as any).CodeMirror
                  }
                  
                  // Method 2: Check for global CodeMirror instances
                  if (!cmInstance && (window as any).CodeMirror) {
                    const editors = (window as any).CodeMirror.editors
                    if (editors && editors.length > 0) {
                      cmInstance = editors[editors.length - 1]
                    }
                  }
                  
                  // Method 3: Try to get value from the textarea
                  if (!cmInstance) {
                    const textarea = containerRef.current?.querySelector('textarea')
                    if (textarea) {
                      const currentCode = (textarea as HTMLTextAreaElement).value
                      if (currentCode && currentCode !== code) {
                        onCodeChange(currentCode)
                      }
                      return
                    }
                  }
                  
                  if (cmInstance && typeof cmInstance.getValue === 'function') {
                    const currentCode = cmInstance.getValue()
                    if (currentCode !== code) {
                      onCodeChange(currentCode)
                    }
                  }
                }
              } catch (err) {
                // Silently ignore errors during polling
              }
            }
            
            // Store interval for cleanup
            (containerRef.current as any)._checkInterval = window.setInterval(checkForChanges, 500)
          }, 1500) // Wait for playground to initialize
        }

        // Auto-run if specified
        if (autoRun && !highlightOnly) {
          setTimeout(() => {
            const runButton = containerRef.current?.querySelector('.run-button') as HTMLElement
            if (runButton) {
              runButton.click()
            }
          }, 500)
        }

        // Apply read-only styles if needed
        if (readOnly && !highlightOnly) {
          setTimeout(() => {
            const editor = containerRef.current?.querySelector('.CodeMirror') as HTMLElement
            if (editor) {
              editor.style.pointerEvents = 'none'
              editor.style.cursor = 'default'
              const cursors = editor.querySelector('.CodeMirror-cursors') as HTMLElement
              if (cursors) {
                cursors.style.display = 'none'
              }
              // Also make lines non-selectable
              const lines = editor.querySelector('.CodeMirror-lines') as HTMLElement
              if (lines) {
                lines.style.cursor = 'default'
              }
            }
          }, 100)
        }
      }
    } catch (err) {
      console.error('Failed to initialize Kotlin Playground:', err)
    }
  }, [isLoaded, isInitialized, highlightOnly, theme, targetPlatform, outputHeight, autoComplete, highlightOnFly, onCodeChange, readOnly, autoRun, code])

  // Cleanup on unmount
  useEffect(() => {
    const currentRef = containerRef.current
    return () => {
      const checkInterval = (currentRef as any)?._checkInterval
      if (checkInterval) {
        clearInterval(checkInterval)
      }
    }
  }, [])

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-destructive">Failed to load Kotlin Playground</p>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading Kotlin Playground...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        minHeight: height
      }}
    >
      <code 
        ref={codeRef}
        className="kotlin-code"
        style={{ display: 'block', whiteSpace: 'pre' }}
      >
        {code}
      </code>
    </div>
  )
}