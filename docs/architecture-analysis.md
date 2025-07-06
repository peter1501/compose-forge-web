# Architecture Analysis: ComposeForge vs InPsychAI Reference Project

## Executive Summary

This document analyzes the architecture patterns of two projects:
1. **ComposeForge**: A marketplace for Jetpack Compose components (Current project)
2. **InPsychAI**: A psychology practice management system using clean architecture with Amplify (Reference project)

The goal is to understand how to adapt the clean architecture patterns from InPsychAI for use with Supabase in ComposeForge.

## Reference Project (InPsychAI) Architecture

### Directory Structure
```
src/
├── domain/                 # Core business logic (framework-agnostic)
│   ├── entities/          # Business entities
│   ├── repositories/      # Repository interfaces
│   └── use-cases/         # Business use cases
├── application/           # Application services layer
│   ├── services/          # Application services
│   ├── hooks/             # React hooks that use services
│   └── providers/         # Service Provider (DI container)
├── infrastructure/        # External integrations
│   ├── amplify/          # Amplify-specific implementations
│   ├── api/              # API integrations
│   └── config/           # Configuration
├── presentation/          # UI layer
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # UI-specific hooks
│   └── layouts/          # Layout components
└── shared/               # Shared utilities
```

### Key Architectural Patterns

#### 1. Clean Architecture Layers
- **Domain Layer**: Pure business logic, no framework dependencies
- **Application Layer**: Orchestrates business logic, provides services
- **Infrastructure Layer**: Implements interfaces with external services
- **Presentation Layer**: React components and UI logic

#### 2. Dependency Injection
- Uses a ServiceProvider component for dependency injection
- All services are instantiated in the provider and passed via context
- Repositories are injected into services
- Services are injected into hooks

#### 3. Repository Pattern
- Domain layer defines repository interfaces
- Infrastructure layer provides implementations (Amplify, Mock)
- Allows easy swapping of data sources

#### 4. Application Services
- Orchestrate complex business operations
- Handle cross-cutting concerns
- Provide a clean API for the presentation layer

## Current Project (ComposeForge) Structure

### Current Directory Structure
```
src/
├── app/                   # Next.js App Router pages
│   ├── auth/             # Auth routes
│   ├── components/       # Component marketplace page
│   ├── dashboard/        # Dashboard page
│   └── login/            # Login page
├── components/           # React components
│   └── ui/              # UI components
├── lib/                  # Libraries
│   └── supabase/        # Supabase client
└── utils/               # Utilities
    └── supabase/        # Supabase utilities
```

### Current Patterns
- Direct Supabase client usage in components
- Server components with data fetching
- No clear separation of concerns
- Business logic mixed with UI components

## Proposed Architecture for ComposeForge

### Recommended Directory Structure
```
src/
├── domain/                      # Core business domain
│   ├── entities/               # Business entities
│   │   ├── component.ts        # Component entity
│   │   ├── user.ts            # User entity
│   │   ├── organization.ts    # Organization entity
│   │   └── preview.ts         # Preview entity
│   ├── repositories/          # Repository interfaces
│   │   ├── component-repository.ts
│   │   ├── user-repository.ts
│   │   └── preview-repository.ts
│   └── use-cases/            # Business use cases
│       ├── component-management.ts
│       └── ai-generation.ts
├── application/              # Application services
│   ├── services/            # Application services
│   │   ├── component-service.ts
│   │   ├── auth-service.ts
│   │   ├── ai-service.ts
│   │   └── preview-service.ts
│   ├── hooks/               # React hooks
│   │   ├── useComponents.ts
│   │   ├── useAuth.ts
│   │   └── useAIGeneration.ts
│   └── providers/           # Service providers
│       └── service-provider.tsx
├── infrastructure/          # External integrations
│   ├── supabase/           # Supabase implementations
│   │   ├── supabase-component-repository.ts
│   │   ├── supabase-user-repository.ts
│   │   └── supabase-auth-repository.ts
│   ├── cloudflare/         # Cloudflare Workers
│   │   └── preview-service.ts
│   ├── openai/             # AI integrations
│   │   └── openai-service.ts
│   └── config/             # Configuration
│       └── supabase-config.ts
├── presentation/           # UI layer
│   ├── components/        # Reusable components
│   ├── features/          # Feature-specific components
│   │   ├── component-browser/
│   │   ├── ai-generator/
│   │   └── preview-viewer/
│   └── layouts/           # Layout components
└── shared/                # Shared utilities
    ├── utils/
    └── types/
```

### Key Adaptations for Supabase

#### 1. Repository Pattern with Supabase
```typescript
// Domain layer - defines interface
export interface ComponentRepository {
  findAll(criteria?: ComponentSearchCriteria): Promise<ComponentListResult>
  findById(id: string): Promise<Component | null>
  search(query: string, limit?: number): Promise<Component[]>
  create(component: CreateComponentInput): Promise<Component>
  update(id: string, data: UpdateComponentInput): Promise<Component>
  delete(id: string): Promise<void>
}

// Infrastructure layer - Supabase implementation
export class SupabaseComponentRepository implements ComponentRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findAll(criteria?: ComponentSearchCriteria): Promise<ComponentListResult> {
    const query = this.supabase
      .from('components')
      .select('*', { count: 'exact' })
    
    // Apply filters based on criteria
    if (criteria?.category) {
      query.eq('category', criteria.category)
    }
    
    const { data, error, count } = await query
    // Transform and return
  }
}
```

#### 2. Service Layer Pattern
```typescript
export class ComponentService {
  constructor(
    private componentRepo: ComponentRepository,
    private aiService: AIService,
    private previewService: PreviewService
  ) {}
  
  async generateComponent(prompt: string): Promise<Component> {
    // Orchestrate AI generation
    const code = await this.aiService.generateCode(prompt)
    const preview = await this.previewService.generatePreview(code)
    const component = await this.componentRepo.create({
      code,
      preview,
      // ... other fields
    })
    return component
  }
}
```

#### 3. Dependency Injection with React Context
```typescript
export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient()
  
  const services = useMemo(() => {
    // Create repositories
    const componentRepo = new SupabaseComponentRepository(supabase)
    const userRepo = new SupabaseUserRepository(supabase)
    
    // Create services
    const componentService = new ComponentService(componentRepo, ...)
    const authService = new AuthService(userRepo, supabase.auth)
    
    return {
      componentService,
      authService,
      // ... other services
    }
  }, [supabase])
  
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}
```

#### 4. Hooks Layer for UI Integration
```typescript
export function useComponents(options?: UseComponentsOptions) {
  const { componentService } = useServices()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true)
      try {
        const result = await componentService.getComponents(options)
        setComponents(result.components)
      } finally {
        setLoading(false)
      }
    }
    loadComponents()
  }, [componentService, options])
  
  return { components, loading, refetch: loadComponents }
}
```

### Supabase-Specific Considerations

#### 1. Real-time Subscriptions
- Implement in repository layer
- Expose through services with proper cleanup
- Use hooks to manage subscription lifecycle

#### 2. Row Level Security (RLS)
- Design entities with ownership in mind
- Repository implementations handle RLS transparently
- Services focus on business logic, not security

#### 3. Edge Functions Integration
- Create separate service interfaces for Edge Functions
- Infrastructure layer handles deployment and invocation
- Application services orchestrate calls

#### 4. Storage Integration
- Abstract file storage behind repository interface
- Handle public/private URLs in infrastructure layer
- Services work with domain entities, not storage details

### Migration Strategy

1. **Phase 1**: Create domain entities and repository interfaces
2. **Phase 2**: Implement Supabase repositories
3. **Phase 3**: Build application services
4. **Phase 4**: Create hooks and providers
5. **Phase 5**: Refactor existing components to use services
6. **Phase 6**: Add new features using clean architecture

### Benefits of This Architecture

1. **Testability**: Easy to test business logic without Supabase
2. **Flexibility**: Can swap Supabase for another backend
3. **Maintainability**: Clear separation of concerns
4. **Type Safety**: Full TypeScript support throughout
5. **Scalability**: Easy to add new features and services

### Key Differences from Amplify

1. **Authentication**: Supabase Auth vs Cognito
2. **Real-time**: Built-in Supabase real-time vs AppSync subscriptions
3. **Storage**: Supabase Storage vs S3
4. **Database**: PostgreSQL with RLS vs DynamoDB with IAM

The core architectural patterns remain the same, only the infrastructure implementations change.