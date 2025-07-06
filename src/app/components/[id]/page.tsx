import { notFound } from 'next/navigation'
import { getComposeComponentWithStats } from '@/lib/services/compose-components'
import { NavigationLayout } from '@/components/navigation-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Heart, Eye, Code2, Copy, Calendar, Shield, Package2 } from 'lucide-react'
import Editor from '@monaco-editor/react'
import Link from 'next/link'

export default async function ComponentDetailPage({ params }: { params: { id: string } }) {
  let component
  
  try {
    component = await getComposeComponentWithStats(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <NavigationLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
              <p className="text-muted-foreground text-lg">{component.description}</p>
            </div>

            {/* Code Preview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Component Code</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(component.code)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <a href={`/api/compose-components/${component.id}/download`} download>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Editor
                    height="500px"
                    defaultLanguage="kotlin"
                    value={component.code}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      automaticLayout: true
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imports */}
            {component.imports && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Imports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="150px"
                      defaultLanguage="kotlin"
                      value={component.imports}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>Downloads</span>
                    </div>
                    <span className="font-semibold">{component.download_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>Favorites</span>
                    </div>
                    <span className="font-semibold">{component.favorite_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Views</span>
                    </div>
                    <span className="font-semibold">{component.view_count.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" variant={component.is_favorited ? "secondary" : "default"}>
                  <Heart className={`h-4 w-4 mr-2 ${component.is_favorited ? 'fill-current' : ''}`} />
                  {component.is_favorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <a href={`/api/compose-components/${component.id}/download`} download className="w-full">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Component
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{component.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Min SDK</span>
                  <span className="font-medium">{component.min_sdk_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Compose Version</span>
                  <span className="font-medium">{component.compose_version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(component.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/profile/${component.author_id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                  <div>
                    <p className="font-semibold">Author</p>
                    <p className="text-sm text-muted-foreground">View Profile</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationLayout>
  )
}