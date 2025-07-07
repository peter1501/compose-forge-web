'use client'

import { useState } from 'react'
import { KotlinComposeEditor } from '@/components/compose-components/kotlin-playground/kotlin-compose-editor'
import { KotlinComposePreview } from '@/components/compose-components/kotlin-playground/kotlin-compose-preview'
import { useKotlinCompose } from '@/hooks/useKotlinCompose'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Loader2 } from 'lucide-react'

const EXAMPLE_CODE = `import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
  CanvasBasedWindow { App() }
}

@Composable
fun App() {
  MaterialTheme {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
      Text("Clicked $count times")
    }
  }
}`

/**
 * Example component demonstrating the new event-based Kotlin Playground
 * This shows how to use the shared state hook for proper synchronization
 * between editor and preview without polling or race conditions.
 */
export function KotlinPlaygroundExample() {
  const [compilationSuccess, setCompilationSuccess] = useState<boolean | null>(null)
  
  // Use the shared state hook
  const {
    code,
    setCode,
    isCompiling,
    compileCode,
    editorProps,
    previewProps,
    previewRef
  } = useKotlinCompose({
    initialCode: EXAMPLE_CODE,
    autoCompile: false,
    onCompilationStart: () => {
      console.log('Compilation started')
      setCompilationSuccess(null)
    },
    onCompilationEnd: (success) => {
      console.log('Compilation ended:', success ? 'success' : 'failure')
      setCompilationSuccess(success)
    }
  })

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Editor Section */}
      <Card>
        <CardHeader>
          <CardTitle>Kotlin Code Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <KotlinComposeEditor
            {...editorProps}
            height="500px"
            theme="darcula"
          />
          <div className="mt-4">
            <Button 
              onClick={compileCode}
              disabled={isCompiling}
              className="w-full"
            >
              {isCompiling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Compile & Run
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={previewRef as any} className="border rounded">
            <KotlinComposePreview
              {...previewProps}
              height="500px"
              showLoadingState={true}
            />
          </div>
          {compilationSuccess !== null && (
            <div className={`mt-4 p-2 rounded text-center ${
              compilationSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {compilationSuccess ? 'Compilation successful!' : 'Compilation failed'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}