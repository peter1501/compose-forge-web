'use client'

import { useState, useCallback, useRef } from 'react'
import type { KotlinComposePreviewHandle } from '@/components/compose-components/kotlin-playground/kotlin-compose-preview'

interface UseKotlinComposeOptions {
  initialCode?: string
  autoCompile?: boolean
  onCodeChange?: (code: string) => void
  onCompilationStart?: () => void
  onCompilationEnd?: (success: boolean) => void
}

interface UseKotlinComposeReturn {
  code: string
  setCode: (code: string) => void
  isCompiling: boolean
  compileCode: () => void
  editorProps: {
    code: string
    onCodeChange: (code: string) => void
    showRunButton: false
  }
  previewProps: {
    code: string
    autoCompile: boolean
    onCompilationStart: () => void
    onCompilationEnd: (success: boolean) => void
  }
  previewRef: React.RefObject<KotlinComposePreviewHandle | null>
}

export function useKotlinCompose({
  initialCode = '',
  autoCompile = false,
  onCodeChange,
  onCompilationStart,
  onCompilationEnd
}: UseKotlinComposeOptions = {}): UseKotlinComposeReturn {
  const [code, setCodeState] = useState(initialCode)
  const [isCompiling, setIsCompiling] = useState(false)
  const previewRef = useRef<KotlinComposePreviewHandle>(null)

  const setCode = useCallback((newCode: string) => {
    console.log('[useKotlinCompose] setCode called with length:', newCode.length)
    setCodeState(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }, [onCodeChange])

  const handleCompilationStart = useCallback(() => {
    setIsCompiling(true)
    if (onCompilationStart) {
      onCompilationStart()
    }
  }, [onCompilationStart])

  const handleCompilationEnd = useCallback((success: boolean) => {
    setIsCompiling(false)
    if (onCompilationEnd) {
      onCompilationEnd(success)
    }
  }, [onCompilationEnd])

  const compileCode = useCallback(() => {
    console.log('[useKotlinCompose] compileCode called, current code length:', code.length)
    console.log('[useKotlinCompose] previewRef:', previewRef.current)
    if (previewRef.current?.execute) {
      console.log('[useKotlinCompose] Calling execute on preview')
      previewRef.current.execute()
    } else {
      console.warn('[useKotlinCompose] No execute method on previewRef')
    }
  }, [code])

  const editorProps = {
    code,
    onCodeChange: setCode,
    showRunButton: false as const
  }

  const previewProps = {
    code,
    autoCompile,
    onCompilationStart: handleCompilationStart,
    onCompilationEnd: handleCompilationEnd
  }

  return {
    code,
    setCode,
    isCompiling,
    compileCode,
    editorProps,
    previewProps,
    previewRef
  }
}