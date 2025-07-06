'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { 
  COMPOSE_COMPONENT_CATEGORIES, 
  MAX_CODE_SIZE,
  DEFAULT_MIN_SDK_VERSION,
  DEFAULT_COMPOSE_VERSION,
  type ComposeComponentFormData 
} from '@/lib/types'

const DEFAULT_CODE = `package com.example.composeforge

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview

@Composable
fun MyComponent(
    modifier: Modifier = Modifier
) {
    // Your Compose code here
    Text(
        text = "Hello, ComposeForge!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun MyComponentPreview() {
    MyComponent()
}`

interface ComposeComponentFormProps {
  onSubmit: (data: ComposeComponentFormData) => Promise<void>
  initialData?: Partial<ComposeComponentFormData>
  submitLabel?: string
}

export function ComposeComponentForm({ 
  onSubmit, 
  initialData,
  submitLabel = 'Create Component'
}: ComposeComponentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ComposeComponentFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    code: initialData?.code || DEFAULT_CODE,
    category: initialData?.category || 'other',
    min_sdk_version: initialData?.min_sdk_version || DEFAULT_MIN_SDK_VERSION,
    compose_version: initialData?.compose_version || DEFAULT_COMPOSE_VERSION
  })

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
      await onSubmit(formData)
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
            Basic information about your Jetpack Compose component
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
            Write your complete Jetpack Compose component code including package declaration and imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="kotlin"
              value={formData.code}
              onChange={(value) => setFormData({ ...formData, code: value || '' })}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                automaticLayout: true
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Code size: {(formData.code.length / 1024).toFixed(1)}KB / {MAX_CODE_SIZE / 1024}KB
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
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