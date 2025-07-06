import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { NavigationLayout } from '@/components/navigation-layout'
import { NewComponentForm } from './_components/new-component-form'

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
        
        <NewComponentForm />
      </div>
    </NavigationLayout>
  )
}