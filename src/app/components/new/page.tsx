import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { ComposeComponentForm } from '@/components/compose-component-form'
import type { ComposeComponentFormData } from '@/lib/types'

async function createComponent(data: ComposeComponentFormData) {
  'use server'
  
  try {
    const supabase = await createClient()
    
    // Debug: Check session and user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session in server action:', session?.user?.id, sessionError)
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('User in server action:', user?.id, userError)
    
    if (!user) {
      throw new Error('Not authenticated')
    }
  
  const componentData = {
    name: data.name,
    description: data.description,
    code: data.code,
    category: data.category,
    min_sdk_version: data.min_sdk_version,
    compose_version: data.compose_version,
    author_id: user.id
  }
  
  console.log('Creating component with user:', user.id)
  console.log('Component data:', componentData)
  
  // First check if we can bypass RLS temporarily for debugging
  const { data: testAuth } = await supabase.auth.getUser()
  console.log('Auth user in server action:', testAuth.user?.id)
  
  const { data: component, error } = await supabase
    .from('compose_components')
    .insert(componentData)
    .select()
    .single()
  
    if (error) {
      console.error('Error creating component:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(error.message)
    }
    
    console.log('Component created successfully:', component.id)
    revalidatePath('/components')
    revalidatePath(`/components/${component.id}`)
    redirect(`/components/${component.id}`)
  } catch (error) {
    console.error('Server action error:', error)
    throw error
  }
}

export default async function NewComponentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <NavigationLayout user={user}>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Compose Component</h1>
          <p className="text-muted-foreground mt-2">
            Share your Jetpack Compose component with the community
          </p>
        </div>
        
        <ComposeComponentForm onSubmit={createComponent} />
      </div>
    </NavigationLayout>
  )
}