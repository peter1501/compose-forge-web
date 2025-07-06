# Architecture Decisions

## Why `app` Directory Remains at `src/app`

### Next.js 13+ App Router Constraint
The Next.js App Router (introduced in v13) **requires** the `app` directory to be located at either:
- `/app` (root level)
- `/src/app` (when using src directory)

This is a **hard framework constraint** that cannot be changed. Attempting to move it to `src/presentation/pages/app` would break Next.js routing entirely.

### Our Approach to Clean Architecture with Next.js

Despite this constraint, we maintain clean architecture principles by:

1. **Treating `src/app` as a thin routing layer**
   - Only contains page components and route handlers
   - No business logic or complex UI components
   - Acts as an adapter between Next.js routing and our domain

2. **All UI components in `src/presentation/components`**
   - Shared components, UI primitives, and feature components
   - Organized by type (ui, features, layouts)
   - Maintains separation from routing concerns

3. **Hooks and contexts in `src/presentation`**
   - Custom hooks for data fetching and state management
   - React contexts for dependency injection
   - Keeps React-specific code organized

4. **Business logic remains pure**
   - Domain layer has no framework dependencies
   - Application layer orchestrates use cases
   - Infrastructure layer handles external integrations

## Updated Directory Structure

```
src/
├── app/                      # Next.js routing (framework constraint)
│   ├── page.tsx             # Route pages only
│   ├── layout.tsx           # Route layouts only
│   └── [routes]/            # Other routes
│
├── presentation/            # UI Layer (our choice)
│   ├── components/          # All UI components
│   │   ├── ui/             # Base UI components
│   │   ├── features/       # Feature-specific components
│   │   └── layouts/        # Layout components
│   ├── hooks/              # Custom React hooks
│   └── contexts/           # React contexts
│
├── domain/                  # Business logic (pure)
├── application/            # Use cases
├── infrastructure/         # External services
└── lib/                    # Utilities
```

## Benefits of This Approach

1. **Framework Compliance**: Works with Next.js without fighting the framework
2. **Clear Separation**: Business logic remains independent of Next.js
3. **Maintainability**: Easy to understand where code belongs
4. **Testability**: Can test business logic without Next.js
5. **Future Flexibility**: If Next.js changes, only `app` directory affected

## Import Aliases

To maintain clean imports, we've configured TypeScript path aliases:

```typescript
"@/components/*": ["./src/presentation/components/*"]
"@/domain/*": ["./src/domain/*"]
"@/application/*": ["./src/application/*"]
"@/infrastructure/*": ["./src/infrastructure/*"]
"@/presentation/*": ["./src/presentation/*"]
```

This allows clean imports like:
```typescript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/presentation/hooks/useAuth'
```

## Conclusion

While Next.js App Router constrains where we place our routing files, we can still achieve clean architecture by:
- Keeping the `app` directory minimal and routing-focused
- Organizing all other code according to clean architecture principles
- Using the presentation layer for all UI concerns beyond routing

This pragmatic approach balances framework requirements with architectural best practices.