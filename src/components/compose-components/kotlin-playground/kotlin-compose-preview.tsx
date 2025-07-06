/**
 * KotlinComposePreview - Preview-Only Renderer Component
 * 
 * Purpose: Renders only the output of Compose code without showing the editor.
 * This component:
 * - Hides the code editor completely
 * - Auto-compiles code on mount (configurable)
 * - Provides compilation state callbacks
 * - Shows loading states during compilation
 * - Monitors iframe content to detect successful rendering
 * 
 * Used in:
 * - ComponentCreationForm: Shows live preview below the editor
 * - ComponentDetailView: Shows the interactive component preview
 * 
 * Key Features:
 * - CSS-based hiding of editor elements
 * - Compilation state management (idle, compiling, success, error)
 * - Canvas detection for proper preview readiness
 * - Error handling and display
 * 
 * Note: This component tracks compilation state to ensure screenshots
 * can only be taken when the preview is fully rendered.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { KotlinPlayground } from '../kotlin-playground'
import { Loader2 } from 'lucide-react'

interface KotlinComposePreviewProps {
  code: string
  height?: string
  className?: string
  onCompilationStart?: () => void
  onCompilationEnd?: (success: boolean) => void
  showLoadingState?: boolean
  autoCompile?: boolean
}

export function KotlinComposePreview({
  code,
  height = '400px',
  className = '',
  onCompilationStart,
  onCompilationEnd,
  showLoadingState = true,
  autoCompile = true
}: KotlinComposePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isCompiling, setIsCompiling] = useState(autoCompile)
  const [hasError, setHasError] = useState(false)
  const hasCompiledRef = useRef(false)
  const lastCodeRef = useRef(code)
  
  // Reset compilation flag when code changes
  useEffect(() => {
    if (code !== lastCodeRef.current) {
      hasCompiledRef.current = false
      lastCodeRef.current = code
    }
  }, [code])

  useEffect(() => {
    // Add styles to hide everything except the output
    const style = document.createElement('style')
    style.textContent = `
      .kotlin-compose-preview-container .executable-fragment-wrapper {
        position: relative;
      }
      .kotlin-compose-preview-container .code-area {
        display: none !important;
      }
      .kotlin-compose-preview-container .run-button {
        display: none !important;
      }
      .kotlin-compose-preview-container .compiler-info {
        display: none !important;
      }
      .kotlin-compose-preview-container .console-close {
        display: none !important;
      }
      .kotlin-compose-preview-container .js-code-output-executor {
        margin: 0 !important;
        border: none !important;
      }
      .kotlin-compose-preview-container .k2js-iframe {
        border: none !important;
        width: 100% !important;
        min-height: ${height} !important;
      }
    `
    document.head.appendChild(style)

    // Only auto-run if autoCompile is true and we haven't compiled yet
    if (autoCompile && !hasCompiledRef.current) {
      hasCompiledRef.current = true
      const runTimer = setTimeout(() => {
        const runButton = containerRef.current?.querySelector('.run-button') as HTMLElement
        if (runButton) {
          if (onCompilationStart) onCompilationStart()
          setIsCompiling(true)
          setHasError(false)
          runButton.click()
          
          // Monitor for compilation completion
          let attempts = 0
          const checkInterval = setInterval(() => {
            attempts++
            
            // Check for various output indicators
            const outputExecutor = containerRef.current?.querySelector('.js-code-output-executor')
            const iframe = containerRef.current?.querySelector('.k2js-iframe') as HTMLIFrameElement
            const errorElements = containerRef.current?.querySelectorAll('.errors-output')
            const jsException = containerRef.current?.querySelector('.js-exception')
            
            // Check if iframe has content and is fully loaded
            let hasIframeContent = false
            let iframeCanvas = null
            if (iframe) {
              try {
                const iframeDoc = iframe.contentDocument
                iframeCanvas = iframeDoc?.querySelector('canvas#ComposeTarget')
                const iframeBody = iframeDoc?.body
                
                // Check if canvas exists and has been rendered (has dimensions)
                if (iframeCanvas) {
                  const canvasRect = (iframeCanvas as HTMLCanvasElement).getBoundingClientRect()
                  hasIframeContent = canvasRect.width > 0 && canvasRect.height > 0
                } else if (iframeBody?.textContent?.trim()) {
                  hasIframeContent = true
                }
              } catch (e) {
                // Cross-origin iframe - check if iframe itself has dimensions
                const iframeRect = iframe.getBoundingClientRect()
                hasIframeContent = iframeRect.width > 0 && iframeRect.height > 0
              }
            }
            
            // Check for errors
            if ((errorElements && errorElements.length > 0) || jsException) {
              clearInterval(checkInterval)
              setIsCompiling(false)
              setHasError(true)
              if (onCompilationEnd) onCompilationEnd(false)
            } else if (outputExecutor || attempts > 40) { // Increased timeout to 20 seconds
              // Check for Kotlin Playground loading states
              const consoleWrapper = containerRef.current?.querySelector('.console-wrapper')
              const isConsoleOpen = consoleWrapper?.classList.contains('console-open')
              const hasErrors = containerRef.current?.querySelector('.console-output.error')
              
              // Check if we have actual rendered content
              if (hasIframeContent && !hasErrors) {
                clearInterval(checkInterval)
                setIsCompiling(false)
                setHasError(false)
                // Add a small delay to ensure the canvas is fully painted
                setTimeout(() => {
                  if (onCompilationEnd) onCompilationEnd(true)
                }, 500)
              } else if (hasErrors || attempts >= 40) {
                // Error or timeout
                clearInterval(checkInterval)
                setIsCompiling(false)
                setHasError(hasErrors ? true : false)
                if (onCompilationEnd) onCompilationEnd(!hasErrors)
              }
            }
          }, 500)
        } else {
          setIsCompiling(false)
        }
      }, 1500)

      return () => {
        clearTimeout(runTimer)
        document.head.removeChild(style)
      }
    } else {
      setIsCompiling(false)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [height, onCompilationStart, onCompilationEnd, autoCompile])

  return (
    <div className={`kotlin-compose-preview ${className}`}>
      {showLoadingState && isCompiling && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Compiling preview...</span>
        </div>
      )}
      
      {hasError && (
        <div className="p-4 text-destructive">
          <p>Failed to compile the component. Check the code for errors.</p>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="kotlin-compose-preview-container"
        style={{ 
          minHeight: height,
          display: isCompiling && showLoadingState ? 'none' : 'block'
        }}
      >
        <KotlinPlayground
          code={code}
          height="1px"
          theme="darcula"
          targetPlatform="compose-wasm"
          highlightOnly={false}
          outputHeight={parseInt(height)}
          readOnly={true}
          autoRun={true}
        />
      </div>
    </div>
  )
}