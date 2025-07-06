/**
 * KotlinComposeEditor - Compose Code Editor Component
 * 
 * Purpose: Specialized editor for Compose Multiplatform code with:
 * - Pre-configured for compose-wasm target platform
 * - Optional run button visibility
 * - Auto-completion and syntax highlighting enabled
 * - Configurable output height for preview area
 * 
 * Used in:
 * - ComponentCreationForm: For editing new components (with hidden run button)
 * - ComponentDetailView: For read-only code display with syntax highlighting
 * 
 * Key Features:
 * - Wraps KotlinPlayground with Compose-specific defaults
 * - Can hide run button for controlled compilation workflows
 * - Supports both editable and read-only modes
 */
'use client'

import { useEffect } from 'react'
import { KotlinPlayground } from '../kotlin-playground'

interface KotlinComposeEditorProps {
  code: string
  onCodeChange?: (code: string) => void
  height?: string
  theme?: 'default' | 'darcula' | 'idea'
  readOnly?: boolean
  autoRun?: boolean
  className?: string
  outputHeight?: number
  showRunButton?: boolean
}

export function KotlinComposeEditor({
  code,
  onCodeChange,
  height = '400px',
  theme = 'darcula',
  readOnly = false,
  autoRun = false,
  className = '',
  outputHeight = 300,
  showRunButton = false
}: KotlinComposeEditorProps) {
  useEffect(() => {
    if (!showRunButton) {
      // Add styles to hide the run button
      const style = document.createElement('style')
      style.textContent = `
        .kotlin-compose-editor-no-run-button .run-button {
          display: none !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [showRunButton])

  return (
    <div className={`kotlin-compose-editor ${!showRunButton ? 'kotlin-compose-editor-no-run-button' : ''} ${className}`}>
      <KotlinPlayground
        code={code}
        onCodeChange={onCodeChange}
        height={height}
        theme={theme}
        targetPlatform="compose-wasm"
        highlightOnly={false}
        readOnly={readOnly}
        autoRun={autoRun}
        outputHeight={outputHeight}
        autoComplete={true}
        highlightOnFly={true}
      />
    </div>
  )
}