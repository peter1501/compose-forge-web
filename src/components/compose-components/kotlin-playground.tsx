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
  onCompileStart?: () => void
  onCompileEnd?: (success: boolean, errors?: string[]) => void
  onPlaygroundReady?: (instance: any) => void
  className?: string
  readOnly?: boolean
  autoRun?: boolean
  compileOnClick?: () => boolean
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
  onCompileStart,
  onCompileEnd,
  onPlaygroundReady,
  className,
  readOnly = false,
  autoRun = false,
  compileOnClick
}: KotlinPlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const playgroundInstanceRef = useRef<any>(null)
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

        // Set up code change listener BEFORE initialization
        if (onCodeChange && !highlightOnly && !readOnly) {
          // Define the callback in window scope
          (window as any).onCodeChangeHandler = (newCode: string) => {
            console.log('[KotlinPlayground] onChange callback triggered, code length:', newCode.length)
            onCodeChange(newCode)
          }
          // Set the onChange callback via data attribute
          if (codeRef.current) {
            codeRef.current.setAttribute('data-on-change-opened', 'onCodeChangeHandler')
            console.log('[KotlinPlayground] onChange attribute set')
          }
        }

        // Apply configuration to the code element
        Object.entries(config).forEach(([key, value]) => {
          if (codeRef.current) {
            codeRef.current.setAttribute(key, value as string)
          }
        })


        // Initialize the playground
        console.log('[KotlinPlayground] Initializing playground')
        window.KotlinPlayground(codeRef.current)
        setIsInitialized(true)
        console.log('[KotlinPlayground] Playground initialized')
        
        // Set up event handlers after initialization
        setTimeout(() => {
          const wrapper = containerRef.current?.querySelector('.executable-fragment-wrapper') as HTMLElement
          if (wrapper) {
            console.log('[KotlinPlayground] Setting up event handlers on wrapper')
            
            // Try to set up CodeMirror change handler directly
            if (onCodeChange && !highlightOnly && !readOnly) {
              const codeMirrorElement = wrapper.querySelector('.CodeMirror') as any
              if (codeMirrorElement?.CodeMirror) {
                const cm = codeMirrorElement.CodeMirror
                console.log('[KotlinPlayground] Found CodeMirror instance, setting up change handler')
                cm.on('change', () => {
                  const newCode = cm.getValue()
                  console.log('[KotlinPlayground] CodeMirror change detected, code length:', newCode.length)
                  onCodeChange(newCode)
                })
              }
            }
            
            // Find the run button
            const runButton = wrapper.querySelector('.run-button') as HTMLElement
            if (runButton && (onCompileStart || onCompileEnd)) {
              console.log('[KotlinPlayground] Found run button, setting up click handler')
              
              // Store original onclick
              const originalOnClick = runButton.onclick
              
              // Override onclick
              runButton.onclick = function(e) {
                console.log('[KotlinPlayground] Run button clicked via our handler')
                if (onCompileStart) {
                  console.log('[KotlinPlayground] Calling onCompileStart')
                  onCompileStart()
                }
                
                // Set up mutation observer for compilation results
                const outputArea = wrapper.querySelector('.js-code-output-executor') || 
                                  wrapper.querySelector('.console')
                console.log('[KotlinPlayground] Output area found:', !!outputArea)
                
                if (outputArea && onCompileEnd) {
                  const observer = new MutationObserver((mutations) => {
                    console.log('[KotlinPlayground] Mutation observed')
                    // Check for errors
                    const hasErrors = wrapper.querySelector('.errors-output') || 
                                     wrapper.querySelector('.js-exception')
                    
                    // Check for successful output (iframe with content)
                    const iframe = wrapper.querySelector('.k2js-iframe') as HTMLIFrameElement
                    let success = false
                    
                    if (iframe && !hasErrors) {
                      try {
                        const iframeDoc = iframe.contentDocument
                        const canvas = iframeDoc?.querySelector('canvas#ComposeTarget')
                        success = !!canvas || !!(iframeDoc?.body?.textContent?.trim())
                      } catch (e) {
                        // Cross-origin, assume success if iframe exists
                        success = true
                      }
                    }

                    if (hasErrors || success) {
                      observer.disconnect()
                      if (onCompileEnd) {
                        const errors = hasErrors ? 
                          Array.from(wrapper.querySelectorAll('.errors-output')).map(e => e.textContent || '') : 
                          undefined
                        onCompileEnd(!hasErrors && success, errors)
                      }
                    }
                  })
                  
                  observer.observe(outputArea.parentElement || outputArea, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                  })
                }
                
                // Call original handler
                if (originalOnClick) {
                  return originalOnClick.call(this, e)
                }
              }
            }
          }
        }, 500) // Wait for playground DOM to be ready

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
  }, [isLoaded, isInitialized, highlightOnly, theme, targetPlatform, outputHeight, autoComplete, highlightOnFly, onCodeChange, readOnly, autoRun, onCompileStart, onCompileEnd, onPlaygroundReady, compileOnClick])

  // Update code in CodeMirror when prop changes
  useEffect(() => {
    if (isInitialized) {
      const wrapper = containerRef.current?.querySelector('.executable-fragment-wrapper') as HTMLElement
      if (wrapper) {
        // Update the hidden textarea that Kotlin Playground uses
        const textarea = wrapper.querySelector('textarea') as HTMLTextAreaElement
        if (textarea && textarea.value !== code) {
          console.log('[KotlinPlayground] Updating internal code, new length:', code.length)
          textarea.value = code
          
          // Update CodeMirror instance if it exists
          const codeMirrorElement = wrapper.querySelector('.CodeMirror') as any
          if (codeMirrorElement?.CodeMirror) {
            const cm = codeMirrorElement.CodeMirror
            const currentValue = cm.getValue()
            if (currentValue !== code) {
              console.log('[KotlinPlayground] Updating CodeMirror value')
              // Temporarily remove change listener to avoid infinite loop
              const changeHandler = cm._handlers?.change?.[0]
              if (changeHandler) cm.off('change', changeHandler)
              
              cm.setValue(code)
              
              // Re-add change listener after a short delay
              if (changeHandler) {
                setTimeout(() => cm.on('change', changeHandler), 100)
              }
            }
          }
          
          // Also update the visible code display
          const codeDisplay = wrapper.querySelector('.code-area pre') as HTMLElement
          if (codeDisplay) {
            codeDisplay.textContent = code
          }
        }
      }
    }
  }, [code, isInitialized])

  // Expose execute method via ref
  useEffect(() => {
    if (containerRef.current && isInitialized) {
      (containerRef.current as any).executeCode = () => {
        const runButton = containerRef.current?.querySelector('.run-button') as HTMLElement
        console.log('[KotlinPlayground] executeCode called, runButton:', runButton)
        
        if (runButton) {
          // Log current code content before execution
          const wrapper = containerRef.current?.querySelector('.executable-fragment-wrapper') as HTMLElement
          if (wrapper) {
            const textarea = wrapper.querySelector('textarea') as HTMLTextAreaElement
            const codeArea = wrapper.querySelector('.code-area pre') as HTMLElement
            console.log('[KotlinPlayground] Before execution - textarea length:', textarea?.value?.length, 'codeArea length:', codeArea?.textContent?.length)
            console.log('[KotlinPlayground] Current prop code length:', code.length)
          }
          
          // Check if button is disabled - check both classList and className
          const isDisabled = runButton.classList.contains('_disabled') || runButton.className.includes('_disabled')
          console.log('[KotlinPlayground] Run button classes:', runButton.className, 'isDisabled:', isDisabled)
          
          if (isDisabled) {
            console.log('[KotlinPlayground] Run button is disabled, waiting for it to be enabled...')
            
            // Wait for button to be enabled
            let attempts = 0
            const checkInterval = setInterval(() => {
              attempts++
              const button = containerRef.current?.querySelector('.run-button') as HTMLElement
              
              if (button && !button.classList.contains('_disabled') && !button.className.includes('_disabled')) {
                clearInterval(checkInterval)
                console.log('[KotlinPlayground] Run button is now enabled, clicking it')
                button.click()
              } else if (attempts > 50) { // 5 seconds timeout
                clearInterval(checkInterval)
                console.warn('[KotlinPlayground] Timeout waiting for run button to be enabled')
              }
            }, 100)
          } else {
            // Button is already enabled, click it
            console.log('[KotlinPlayground] Run button is enabled, clicking it')
            console.log('[KotlinPlayground] Button onclick:', runButton.onclick)
            runButton.click()
            console.log('[KotlinPlayground] Button clicked')
          }
        } else if (playgroundInstanceRef.current?.execute) {
          console.log('[KotlinPlayground] Using instance.execute()')
          playgroundInstanceRef.current.execute()
        } else {
          console.warn('[KotlinPlayground] No execution method available')
        }
      }
      console.log('[KotlinPlayground] executeCode method attached to container')
    }
  }, [isInitialized, code])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up global onChange handler
      if ((window as any).onCodeChangeHandler) {
        delete (window as any).onCodeChangeHandler
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