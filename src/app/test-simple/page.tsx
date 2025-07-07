'use client'

import { useState } from 'react'
import { KotlinPlayground } from '@/components/compose-components'
import { Button } from '@/components/ui/button'

const TEST_CODE = `import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.*

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
  CanvasBasedWindow { 
    MaterialTheme {
      Button(onClick = { println("Clicked!") }) {
        Text("Click me")
      }
    }
  }
}`

export default function TestSimplePage() {
  const [compileLog, setCompileLog] = useState<string[]>([])
  
  const addLog = (message: string) => {
    setCompileLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Kotlin Playground Test</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Playground</h2>
          <div className="border rounded">
            <KotlinPlayground
              code={TEST_CODE}
              height="400px"
              targetPlatform="compose-wasm"
              autoRun={false}
              onCodeChange={(code) => addLog(`Code changed: ${code.length} chars`)}
              onCompileStart={() => addLog('Compilation started')}
              onCompileEnd={(success, errors) => {
                addLog(`Compilation ended: ${success ? 'SUCCESS' : 'FAILED'}`)
                if (errors) {
                  errors.forEach(err => addLog(`Error: ${err}`))
                }
              }}
              onPlaygroundReady={(instance) => addLog('Playground ready')}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Compile Log</h2>
          <div className="border rounded p-4 h-[400px] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {compileLog.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click the Run button in the playground.</p>
            ) : (
              <ul className="space-y-1 text-sm font-mono">
                {compileLog.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            )}
          </div>
          <Button 
            className="mt-2"
            variant="outline"
            onClick={() => setCompileLog([])}
          >
            Clear Log
          </Button>
        </div>
      </div>
    </div>
  )
}