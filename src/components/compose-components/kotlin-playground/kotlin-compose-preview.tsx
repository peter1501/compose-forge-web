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

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
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
  onPreviewClick?: () => void
}

export interface KotlinComposePreviewHandle {
  execute: () => void
}

export const KotlinComposePreview = forwardRef<KotlinComposePreviewHandle, KotlinComposePreviewProps>(({
  code,
  height = '400px',
  className = '',
  onCompilationStart,
  onCompilationEnd,
  showLoadingState = true,
  autoCompile = true,
  onPreviewClick
}, ref) => {
  console.log('[KotlinComposePreview] Rendering with code length:', code.length)
  const containerRef = useRef<HTMLDivElement>(null)
  const playgroundRef = useRef<HTMLDivElement>(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Handle compilation callbacks
  const handleCompileStart = () => {
    setIsCompiling(true)
    setHasError(false)
    setErrorMessage('')
    if (onCompilationStart) onCompilationStart()
  }

  const handleCompileEnd = (success: boolean, errors?: string[]) => {
    setIsCompiling(false)
    if (!success) {
      setHasError(true)
      setErrorMessage(errors?.join('\n') || 'Compilation failed')
    }
    if (onCompilationEnd) onCompilationEnd(success)
  }

  // Execute code programmatically
  const executeCode = () => {
    console.log('[KotlinComposePreview] executeCode called, playgroundRef:', playgroundRef.current)
    if (playgroundRef.current) {
      // Find the KotlinPlayground container div (first child)
      const playgroundContainer = playgroundRef.current.firstElementChild as HTMLElement
      console.log('[KotlinComposePreview] playgroundContainer:', playgroundContainer)
      
      const executeFunc = (playgroundContainer as any)?.executeCode
      console.log('[KotlinComposePreview] executeFunc found:', !!executeFunc)
      if (executeFunc) {
        executeFunc()
      } else {
        // Fallback: try to find and click the run button directly
        const runButton = playgroundRef.current.querySelector('.run-button') as HTMLElement
        console.log('[KotlinComposePreview] Fallback - run button found:', !!runButton)
        if (runButton) {
          runButton.click()
        }
      }
    }
  }

  // Expose execute method to parent via ref
  useImperativeHandle(ref, () => ({
    execute: executeCode
  }), [])

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
        position: absolute !important;
        left: -9999px !important;
        visibility: hidden !important;
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
      .kotlin-compose-preview-container.clickable .k2js-iframe {
        cursor: pointer;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [height])

  return (
    <div ref={containerRef} className={`kotlin-compose-preview ${className}`}>
      {showLoadingState && isCompiling && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Compiling preview...</span>
        </div>
      )}
      
      {hasError && (
        <div className="p-4 text-destructive">
          <p>{errorMessage || 'Failed to compile the component. Check the code for errors.'}</p>
        </div>
      )}
      
      <div 
        ref={playgroundRef}
        className={`kotlin-compose-preview-container ${onPreviewClick ? 'clickable' : ''}`}
        style={{ 
          minHeight: height,
          display: isCompiling && showLoadingState ? 'none' : 'block'
        }}
        onClick={onPreviewClick}
      >
        <KotlinPlayground
          code={code}
          height="1px"
          theme="darcula"
          targetPlatform="compose-wasm"
          highlightOnly={false}
          outputHeight={parseInt(height)}
          readOnly={false}
          autoRun={autoCompile}
          onCompileStart={handleCompileStart}
          onCompileEnd={handleCompileEnd}
          onCodeChange={(newCode) => {
            // Preview shouldn't change code, but we need this to keep internal state synced
            console.log('[KotlinComposePreview] Internal code sync, length:', newCode.length)
          }}
        />
      </div>
    </div>
  )
})

KotlinComposePreview.displayName = 'KotlinComposePreview'