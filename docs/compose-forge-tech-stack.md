# Compose Forge - Recommended Technology Stack

## Overview
This document outlines the recommended technology stack for Compose Forge, optimized for rapid development, scalability, and developer experience.

## Core Infrastructure

### Frontend Hosting
**Platform**: Vercel  
**Why**: 
- Optimized for Next.js with zero-config deployment
- Global edge network for fast component browsing
- Automatic preview deployments for every PR
- Built-in analytics and performance monitoring

### Backend Services
**Platform**: Supabase  
**Components**:
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: Supabase Auth with OAuth providers
- **File Storage**: Supabase Storage for component files
- **Real-time**: WebSocket subscriptions for live updates
- **Edge Functions**: For AI component generation

**Why Supabase**:
- PostgreSQL perfect for complex component relationships
- Native vector search for AI-powered discovery
- Generous free tier for startup phase
- Excellent developer experience with type-safe SDK

### Component File Storage
**Primary**: Supabase Storage  
**CDN**: Cloudflare CDN  
**Structure**:
```
components/
├── {user_id}/
│   └── {component_slug}/
│       ├── Component.kt
│       ├── Preview.kt
│       ├── README.md
│       ├── metadata.json
│       └── screenshots/
```

### Preview Rendering
**Platform**: Cloudflare Workers  
**Why**:
- Execute Kotlin/JS at the edge
- 50ms cold starts for instant previews
- WebAssembly support for Compose for Web
- Pay-per-request pricing model

## Application Layer

### Web Framework
**Framework**: Next.js 14 (App Router)  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**UI Components**: shadcn/ui

**Key Libraries**:
- React Query for data fetching
- Zustand for state management
- React Hook Form for forms
- Prism.js for code highlighting

### API Design
**Type**: REST API with tRPC for type safety  
**Documentation**: OpenAPI/Swagger  
**Rate Limiting**: Upstash Redis

### AI Integration
**LLM Provider**: OpenAI API (GPT-4)  
**Vector Database**: Supabase pgvector  
**Embeddings**: OpenAI text-embedding-ada-002  
**Function Calling**: For structured component generation

## Developer Tools

### IDE Integration
**Protocol**: Model Context Protocol (MCP)  
**Server Language**: Kotlin  
**Distribution**: 
- npm package for the MCP server
- IntelliJ/Android Studio plugin
- VS Code extension

### CLI Tool
**Framework**: Kotlin Multiplatform  
**Features**:
- Component search and installation
- Dependency management
- Local preview server
- AI generation interface

## Search & Discovery

### Search Infrastructure
**Primary**: PostgreSQL full-text search  
**Vector Search**: pgvector for semantic search  
**Filtering**: PostgreSQL indexes for categories/tags  
**Analytics**: PostHog for usage tracking

### Component Analysis
**Static Analysis**: Custom Kotlin parser  
**Performance Metrics**: Android Lint integration  
**Accessibility**: Automated accessibility scoring  
**Screenshot Generation**: Headless Chrome with Compose for Web

## Monitoring & Operations

### Application Monitoring
**APM**: Vercel Analytics + Sentry  
**Uptime**: Better Uptime  
**Logs**: Supabase Logs + Axiom

### Infrastructure
**DNS**: Cloudflare  
**SSL**: Cloudflare SSL  
**DDoS Protection**: Cloudflare  
**Backup**: Supabase automatic backups

## Development Workflow

### Version Control
**Platform**: GitHub  
**Branching**: GitHub Flow  
**CI/CD**: GitHub Actions

### Testing
**Unit Tests**: Vitest  
**Integration**: Playwright  
**Component Tests**: Compose UI Testing  
**Load Testing**: k6

### Deployment Pipeline
```
1. Push to GitHub
2. GitHub Actions run tests
3. Vercel preview deployment
4. Manual review for main branch
5. Automatic production deployment
6. Cloudflare cache