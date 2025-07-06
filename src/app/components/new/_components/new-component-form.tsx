'use client'

import { useRouter } from 'next/navigation'
import { ComposeComponentForm } from '@/components/compose-component-form'
import type { ComposeComponentFormData } from '@/lib/types'

export function NewComponentForm() {
  const router = useRouter()

  const handleSubmit = async (data: ComposeComponentFormData) => {
    try {
      const response = await fetch('/api/compose-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Check for specific error cases
        if (response.status === 503 && error.error.includes('migration')) {
          throw new Error('Database setup required. Please follow the instructions in /docs/tech/database-setup.md to run the migration.')
        }
        
        if (response.status === 401) {
          throw new Error('Please sign in to create components')
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

  return <ComposeComponentForm onSubmit={handleSubmit} />
}