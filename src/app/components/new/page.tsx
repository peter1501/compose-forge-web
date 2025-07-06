'use client'

import { useRouter } from 'next/navigation'
import { ComposeComponentForm } from '@/components/compose-component-form'
import { createComposeComponent } from '@/lib/services/compose-components'
import type { ComposeComponentFormData } from '@/lib/types'

export default function NewComponentPage() {
  const router = useRouter()

  const handleSubmit = async (data: ComposeComponentFormData) => {
    try {
      const response = await fetch('/api/compose-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Check for specific error cases
        if (response.status === 503 && error.error.includes('migration')) {
          throw new Error('Database setup required. Please follow the instructions in /docs/tech/database-setup.md to run the migration.')
        }
        
        throw new Error(error.error || 'Failed to create component')
      }

      const component = await response.json()
      router.push(`/components/${component.id}`)
    } catch (error) {
      console.error('Error creating component:', error)
      throw error
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Compose Component</h1>
        <p className="text-muted-foreground mt-2">
          Share your Jetpack Compose component with the community
        </p>
      </div>
      
      <ComposeComponentForm onSubmit={handleSubmit} />
    </div>
  )
}