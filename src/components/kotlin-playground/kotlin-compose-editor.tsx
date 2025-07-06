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