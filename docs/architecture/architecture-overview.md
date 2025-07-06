# ComposeForge Architecture Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Philosophy](#architecture-philosophy)
3. [Directory Structure](#directory-structure)
4. [Core Concepts](#core-concepts)
5. [Data Flow Patterns](#data-flow-patterns)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [FAQ](#faq)

## Introduction

ComposeForge uses a simplified, pragmatic architecture that embraces Next.js conventions while maintaining clean code principles. This guide explains how our architecture works and how to effectively work within it.

## Architecture Philosophy

### Why We Chose Simplicity

After extensive research into Next.js best practices and real-world enterprise applications, we discovered that successful Next.js projects favor simplicity over complex architectural patterns. Our architecture is based on these principles:

1. **Work with the framework, not against it** - Embrace Next.js patterns
2. **Optimize for developer experience** - Easy to understand and modify
3. **Ship features fast** - Less boilerplate, more functionality
4. **YAGNI (You Aren't Gonna Need It)** - Add complexity only when needed

### What We're NOT Using

- ❌ Clean Architecture layers (Domain/Application/Infrastructure)
- ❌ Repository pattern with interfaces
- ❌ Use Cases as separate classes
- ❌ DTOs and complex mappers
- ❌ Dependency Injection containers

### What We ARE Using

- ✅ Direct service functions
- ✅ Next.js App Router patterns
- ✅ React Server Components
- ✅ Simple, testable functions
- ✅ TypeScript for type safety

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups for organization
│   │   ├── login/
│   │   │   ├── page.tsx   # Login page component
│   │   │   └── actions.ts # Server actions (if needed)
│   │   └── signup/
│   ├── components/        # Component marketplace routes
│   │   ├── [id]/         # Dynamic routes
│   │   └── page.tsx
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
│
├── components/           # Shared UI components
│   ├── ui/              # Base design system
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── features/        # Feature-specific components
│       └── component-card.tsx
│
├── lib/                 # Core business logic
│   ├── services/       # Business logic functions
│   │   ├── auth.ts
│   │   └── components.ts
│   ├── supabase/      # Database utilities
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── types/         # TypeScript types
│   └── utils/         # Helper functions
│
├── hooks/             # Shared React hooks
│   ├── useAuth.ts
│   └── useComponents.ts
│
└── config/           # Configuration files
```

### Directory Responsibilities

#### `/app` - Next.js Routing
- **Purpose**: Handle routing and page rendering
- **Contains**: Page components, layouts, route handlers
- **Rules**: 
  - Minimal business logic
  - Delegate to services or hooks
  - Use Server Components by default
  - Colocate page-specific components using `_components` folders

#### `/components` - Shared UI
- **Purpose**: Reusable UI components
- **Contains**: Design system components, shared UI elements
- **Rules**:
  - No business logic
  - Props-driven
  - Fully typed interfaces
  - Storybook-ready (if using Storybook)

#### `/lib` - Business Logic
- **Purpose**: Core application logic
- **Contains**: Services, database queries, utilities
- **Rules**:
  - Pure functions when possible
  - Handle errors gracefully
  - Direct database queries (no abstraction layers)
  - Well-typed inputs and outputs

#### `/hooks` - React Hooks
- **Purpose**: Shared React logic and state management
- **Contains**: Custom hooks for common patterns
- **Rules**:
  - Client-side only
  - Handle loading and error states
  - Compose smaller hooks into larger ones

## Core Concepts

### 1. Services Pattern

Services are simple modules that export functions for business operations:

```typescript
// lib/services/compose-components.ts
export async function searchComponents(query: string) {
  // Direct implementation
}

export async function getComponent(id: string) {
  // Direct implementation
}
```

**Why Services?**
- Easy to test
- Easy to understand
- No class instantiation overhead
- Works great with Server Components

### 2. Direct Database Access

We use Supabase client directly without abstraction layers:

```typescript
// lib/services/auth.ts
import { createClient } from '@/utils/supabase/client'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data.user
}
```

**Benefits:**
- No mapping overhead
- Use Supabase's excellent TypeScript types
- Easier to debug
- Less code to maintain

### 3. Server Components First

Whenever possible, use React Server Components:

```typescript
// app/components/page.tsx
import { searchComponents } from '@/lib/services/compose-components'

export default async function ComponentsPage({ searchParams }) {
  const components = await searchComponents(searchParams.q)
  return <ComposeComponentGrid components={components} />
}
```

**Advantages:**
- No client-side data fetching
- Better SEO
- Smaller bundle size
- Direct database access

### 4. Client Hooks for Interactivity

Use hooks for client-side interactivity:

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Handle auth state
  return { user, loading, signIn, signOut }
}
```

## Data Flow Patterns

### Server-Side Flow (Recommended)

```
User Request
    ↓
Route Handler (app/page.tsx)
    ↓
Service Function (lib/services/*)
    ↓
Database Query (Supabase)
    ↓
Return JSX
```

### Client-Side Flow (When Needed)

```
Component Mount
    ↓
Hook (hooks/*)
    ↓
Service Function (lib/services/*)
    ↓
State Update
    ↓
Re-render
```

### Form Handling

For forms, prefer Server Actions:

```typescript
// app/components/new/actions.ts
'use server'

import { createComponent } from '@/lib/services/compose-components'
import { revalidatePath } from 'next/cache'

export async function createComponentAction(formData: FormData) {
  const component = await createComponent({
    name: formData.get('name') as string,
    // ... other fields
  })
  
  revalidatePath('/components')
  return component
}
```

## Implementation Guidelines

### Creating a New Feature

1. **Start with the page** (`app/feature/page.tsx`)
2. **Identify shared UI** → Create in `components/`
3. **Add business logic** → Create service in `lib/services/`
4. **Need client interactivity?** → Create hook in `hooks/`
5. **Page-specific components?** → Colocate in `app/feature/_components/`

### Adding Business Logic

```typescript
// lib/services/libraries.ts
import { createClient } from '@/utils/supabase/client'

export async function createLibrary(data: {
  name: string
  description: string
  isPublic: boolean
}) {
  const supabase = createClient()
  
  // Direct implementation
  const { data: library, error } = await supabase
    .from('libraries')
    .insert(data)
    .select()
    .single()
    
  if (error) throw error
  return library
}
```

### Error Handling

```typescript
// Consistent error handling pattern
export async function riskyOperation() {
  try {
    const result = await someOperation()
    return { data: result, error: null }
  } catch (error) {
    console.error('Operation failed:', error)
    return { data: null, error: error.message }
  }
}

// Or just throw and let the caller handle
export async function simpleOperation() {
  const { data, error } = await supabase.from('table').select()
  if (error) throw new Error(`Failed to fetch: ${error.message}`)
  return data
}
```

## Code Examples

### Example: Component Search Feature

#### 1. Service Layer
```typescript
// lib/services/compose-components.ts
import { createClient } from '@/utils/supabase/client'

export interface SearchOptions {
  query?: string
  category?: string
  limit?: number
}

export async function searchComponents(options: SearchOptions = {}) {
  const supabase = createClient()
  const { query, category, limit = 20 } = options
  
  let queryBuilder = supabase
    .from('components')
    .select('*, profiles!authorId(username, avatarUrl)')
  
  if (query) {
    queryBuilder = queryBuilder.textSearch('name', query)
  }
  
  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }
  
  const { data, error } = await queryBuilder.limit(limit)
  
  if (error) throw error
  return data
}
```

#### 2. Server Component Page
```typescript
// app/components/page.tsx
import { searchComponents } from '@/lib/services/compose-components'
import { ComposeComponentGrid } from '@/components/compose-component-grid'

export default async function ComponentsPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string }
}) {
  const components = await searchComponents({
    query: searchParams.q,
    category: searchParams.category
  })
  
  return (
    <div>
      <h1>Component Marketplace</h1>
      <ComposeComponentGrid components={components} />
    </div>
  )
}
```

#### 3. Client Hook (if needed)
```typescript
// hooks/useComponentSearch.ts
import { useState, useCallback } from 'react'
import { searchComponents } from '@/lib/services/compose-components'

export function useComponentSearch() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  
  const search = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const results = await searchComponents({ query })
      setComponents(results)
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { components, loading, search }
}
```

### Example: Authentication Flow

#### 1. Auth Service
```typescript
// lib/services/auth.ts
import { createClient } from '@/utils/supabase/client'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data.user
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

#### 2. Auth Hook
```typescript
// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import * as authService from '@/lib/services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])
  
  return {
    user,
    loading,
    signIn: authService.signIn,
    signOut: authService.signOut
  }
}
```

## Best Practices

### 1. Keep It Simple
- Don't create abstractions until you need them
- Prefer functions over classes
- Use TypeScript for documentation

### 2. Colocation
- Keep related code together
- Page-specific components in `_components` folders
- Shared components in `/components`

### 3. Type Safety
```typescript
// Always type your service functions
export async function getComponent(id: string): Promise<Component> {
  // Implementation
}

// Use TypeScript interfaces
interface CreateComponentData {
  name: string
  description: string
  code: string
}
```

### 4. Error Handling
```typescript
// Be consistent with error handling
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  // Log for debugging
  console.error('Operation failed:', error)
  // Re-throw with context
  throw new Error(`Failed to perform operation: ${error.message}`)
}
```

### 5. Performance
- Use Server Components by default
- Only use Client Components when needed
- Implement proper caching strategies
- Use Suspense boundaries

## Common Patterns

### Loading States
```typescript
// Server Component with Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AsyncComponent />
    </Suspense>
  )
}

// Client Component with hook
function ClientComponent() {
  const { data, loading } = useData()
  
  if (loading) return <LoadingSkeleton />
  return <DataDisplay data={data} />
}
```

### Form Handling
```typescript
// Server Action approach (recommended)
async function submitForm(formData: FormData) {
  'use server'
  
  const data = {
    name: formData.get('name') as string,
    // ... other fields
  }
  
  await createRecord(data)
  revalidatePath('/records')
}

// Client-side approach
function Form() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createRecord(data)
      router.push('/success')
    } finally {
      setLoading(false)
    }
  }
}
```

### Data Fetching
```typescript
// Server Component (preferred)
export default async function Page() {
  const data = await fetchData()
  return <Display data={data} />
}

// Client Component with SWR/React Query
function ClientComponent() {
  const { data, error } = useSWR('/api/data', fetcher)
  // Handle states
}
```

## FAQ

### Q: Why no repository pattern?
**A:** The repository pattern adds unnecessary abstraction for most Next.js apps. Supabase already provides an excellent type-safe client. If we need to switch databases (unlikely), we can refactor the service layer.

### Q: How do we handle testing?
**A:** Services are pure functions - easy to test with Jest. Components can be tested with React Testing Library. E2E tests with Playwright.

### Q: What about dependency injection?
**A:** Not needed. JavaScript modules are already a form of DI. For testing, use Jest mocks.

### Q: When should we add more abstraction?
**A:** Only when you have a concrete need:
- Multiple implementations of the same interface
- Complex business rules requiring domain modeling
- Team scaling beyond 10+ developers
- Regulatory compliance requirements

### Q: How do we handle complex business logic?
**A:** Break it down into smaller functions within services. If it gets too complex, create a dedicated service module.

### Q: What about state management?
**A:** Use React's built-in state for component state. For global state, consider Zustand or Context API. Server state should be managed by Server Components or SWR/React Query.

## Conclusion

Our architecture prioritizes simplicity, developer experience, and Next.js best practices. By avoiding unnecessary abstractions and embracing the framework's patterns, we can build features faster while maintaining code quality.

Remember: **The best architecture is the one that lets you ship features quickly while keeping the code maintainable.**