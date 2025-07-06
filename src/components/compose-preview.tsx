'use client'

import { useState } from 'react'
import { KotlinComposeEditor } from './kotlin-playground/kotlin-compose-editor'
import { KotlinComposePreview } from './kotlin-playground/kotlin-compose-preview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Download } from 'lucide-react'
import type { ComposeComponentWithStats } from '@/lib/types'

interface ComposePreviewProps {
  component: ComposeComponentWithStats
}

export function ComposePreview({ component }: ComposePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(component.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.replace(/\s+/g, '_')}.kt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Component Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <KotlinComposePreview
              code={component.code}
              height="400px"
              showLoadingState={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Code Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Component Code</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <KotlinComposeEditor
              code={component.code}
              height="500px"
              theme="darcula"
              readOnly={true}
              autoRun={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}