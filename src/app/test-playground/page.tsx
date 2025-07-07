'use client'

import { KotlinPlaygroundExample } from '@/components/compose-components'

export default function TestPlaygroundPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Kotlin Playground</h1>
      <KotlinPlaygroundExample />
    </div>
  )
}