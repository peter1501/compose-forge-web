'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { KotlinComposeEditor } from '@/components/compose-components/kotlin-playground/kotlin-compose-editor'
import { KotlinComposePreview } from '@/components/compose-components/kotlin-playground/kotlin-compose-preview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Play, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useKotlinCompose } from '@/hooks/useKotlinCompose'
import { 
  COMPOSE_COMPONENT_CATEGORIES, 
  MAX_CODE_SIZE,
  DEFAULT_MIN_SDK_VERSION,
  DEFAULT_COMPOSE_VERSION,
  type ComposeComponentFormData 
} from '@/lib/types'

const DEFAULT_CODE = `import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
  CanvasBasedWindow { App() }
}

@Composable
fun App() {
  MaterialTheme {
    var greetingText by remember { mutableStateOf("Hello World!") }
    var showImage by remember { mutableStateOf(false) }
    var counter by remember { mutableStateOf(0) }
    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
      Button(onClick = {
        counter++
        greetingText = "Compose: \${Greeting().greet()}"
        showImage = !showImage
      }) {
        Text(greetingText)
      }
      AnimatedVisibility(showImage) {
        Text(counter.toString())
      }
    }
  }
}

private val platform = object : Platform {

  override val name: String
    get() = "Web with Kotlin/Wasm"
}

fun getPlatform(): Platform = platform

class Greeting {
  private val platform = getPlatform()

  fun greet(): String {
    return "Hello, \${platform.name}!"
  }
}

interface Platform {
  val name: String
}`

interface ComposeComponentFormProps {
  onSubmit: (data: ComposeComponentFormData) => Promise<void>
  initialData?: Partial<ComposeComponentFormData>
  submitLabel?: string
}

export function ComponentCreationForm({ 
  onSubmit, 
  initialData,
  submitLabel = 'Create Component'
}: ComposeComponentFormProps) {
  const router = useRouter()
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compilationState, setCompilationState] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle')
  const [compilationError, setCompilationError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isPreviewReady, setIsPreviewReady] = useState(false)
  
  // Use refs to track states for callbacks to avoid stale closures
  const compilationStateRef = useRef(compilationState)
  const isPreviewReadyRef = useRef(isPreviewReady)
  
  // Update refs when states change
  useEffect(() => {
    compilationStateRef.current = compilationState
  }, [compilationState])
  
  useEffect(() => {
    isPreviewReadyRef.current = isPreviewReady
  }, [isPreviewReady])
  
  const [formData, setFormData] = useState<ComposeComponentFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    code: initialData?.code || DEFAULT_CODE,
    category: initialData?.category || 'other',
    min_sdk_version: initialData?.min_sdk_version || DEFAULT_MIN_SDK_VERSION,
    compose_version: initialData?.compose_version || DEFAULT_COMPOSE_VERSION
  })

  // Create stable callbacks that won't change
  const handleCodeChange = useCallback((newCode: string) => {
    setFormData(prev => ({ ...prev, code: newCode }))
    // Reset compilation state when code changes after successful compilation
    if (compilationStateRef.current === 'success' || isPreviewReadyRef.current) {
      console.log('[ComponentCreationForm] Code changed after success, resetting states')
      setCompilationState('idle')
      setIsPreviewReady(false)
      // Don't hide preview - keep it visible but reset the compilation state
    }
  }, [])

  const handleCompilationStart = useCallback(() => {
    console.log('[ComponentCreationForm] onCompilationStart called')
    setCompilationState('compiling')
    setCompilationError(null)
    setIsPreviewReady(false)
  }, [])

  const handleCompilationEnd = useCallback((success: boolean) => {
    console.log('[ComponentCreationForm] onCompilationEnd called, success:', success)
    if (success) {
      setCompilationState('success')
      setCompilationError(null)
      setIsPreviewReady(true)
    } else {
      setCompilationState('error')
      setCompilationError('Compilation failed. Check your code for errors.')
      setIsPreviewReady(false)
    }
  }, [])

  // Use the shared state hook for editor/preview synchronization
  const {
    code,
    setCode,
    isCompiling,
    compileCode,
    editorProps,
    previewProps,
    previewRef
  } = useKotlinCompose({
    initialCode: formData.code,
    autoCompile: false,
    onCodeChange: handleCodeChange,
    onCompilationStart: handleCompilationStart,
    onCompilationEnd: handleCompilationEnd
  })

  const handleCompile = () => {
    setShowPreview(true)
    // Use a longer delay to ensure preview is mounted and playground is ready
    setTimeout(() => {
      compileCode()
    }, 1000) // Increased delay to give playground time to initialize
  }

  const capturePreviewScreenshot = async (): Promise<Blob | null> => {
    if (!previewContainerRef.current) return null
    
    try {
      // Find the iframe inside the preview container
      const iframe = previewContainerRef.current.querySelector('.k2js-iframe') as HTMLIFrameElement
      if (!iframe) return null
      
      // Get the canvas element from inside the iframe
      const iframeDoc = iframe.contentDocument
      const canvas = iframeDoc?.querySelector('canvas#ComposeTarget') as HTMLCanvasElement
      if (!canvas) return null
      
      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png')
      })
    } catch (error) {
      console.error('Failed to capture preview screenshot:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate code size
    if (formData.code.length > MAX_CODE_SIZE) {
      setError(`Code size exceeds maximum limit of ${MAX_CODE_SIZE / 1024}KB`)
      return
    }
    
    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim() || !formData.code.trim()) {
      setError('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Capture screenshot before submission
      const screenshot = await capturePreviewScreenshot()
      
      // Pass both form data and screenshot to onSubmit
      await onSubmit({
        ...formData,
        screenshot
      } as any) // TODO: Update type definition to include screenshot
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save component')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Component Details</CardTitle>
          <CardDescription>
            Basic information about your Compose Multiplatform component
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name *</Label>
            <Input
              id="name"
              placeholder="e.g., AnimatedButton, CustomCard"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe what your component does and how to use it..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {COMPOSE_COMPONENT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_sdk_version">Min SDK Version</Label>
              <Input
                id="min_sdk_version"
                type="number"
                min="21"
                max="35"
                value={formData.min_sdk_version}
                onChange={(e) => setFormData({ ...formData, min_sdk_version: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compose_version">Compose Version</Label>
              <Input
                id="compose_version"
                placeholder="e.g., 1.5.0"
                value={formData.compose_version}
                onChange={(e) => setFormData({ ...formData, compose_version: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Component Code *</CardTitle>
          <CardDescription>
            Write your Compose Multiplatform component code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <KotlinComposeEditor
                {...editorProps}
                height="400px"
                theme="darcula"
                outputHeight={0}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Code size: {(formData.code.length / 1024).toFixed(1)}KB / {MAX_CODE_SIZE / 1024}KB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card style={{ display: showPreview ? 'block' : 'none' }}>
        <CardHeader>
          <CardTitle>Component Preview</CardTitle>
          <CardDescription>
            Live preview of your component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={previewContainerRef} className="border rounded-md overflow-hidden">
            <KotlinComposePreview
              ref={previewRef}
              {...previewProps}
              height="400px"
              showLoadingState={false}
              autoCompile={false}
            />
          </div>
            
            {/* Show loading state while compiling */}
            {compilationState === 'compiling' && (
              <div className="mt-4 flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Compiling component...</span>
              </div>
            )}
            
            {/* Compilation Status Messages */}
            {compilationState === 'success' && isPreviewReady && (
              <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Component compiled successfully! You can now create the component.
                </AlertDescription>
              </Alert>
            )}
            
            {compilationState === 'error' && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {compilationError || 'Compilation failed. Please fix the errors and try again.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {/* Only show create button when preview is ready and compilation succeeded */}
        {compilationState === 'success' && isPreviewReady ? (
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={handleCompile}
            disabled={isCompiling || (compilationState === 'success' && !isPreviewReady)}
            className="flex-1"
          >
            {isCompiling || (compilationState === 'success' && !isPreviewReady) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Compile Component
              </>
            )}
          </Button>
        )}
        
        {compilationState === 'error' && (
          <Button 
            type="button"
            variant="secondary"
            onClick={() => {
              setCompilationState('success')
              setIsPreviewReady(true)
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Create Anyway
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}