'use client'

import { ComposePreview } from '@/components/compose-preview'
import type { ComposeComponentWithStats } from '@/lib/types'

interface ComponentDetailClientProps {
  component: ComposeComponentWithStats
}

export function ComponentDetailClient({ component }: ComponentDetailClientProps) {
  return <ComposePreview component={component} />
}