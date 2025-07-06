# Kotlin Playground Components - Refactoring Plan

## Current Issues

1. **Redundant Wrapper**: `ComponentDetailClient` is just a thin wrapper around `ComposePreview`
2. **Unclear Naming**: Component names don't clearly indicate their specific use cases
3. **Missing Documentation**: No clear documentation explaining what each component does
4. **Potential Confusion**: Similar names (e.g., `ComposePreview` vs `KotlinComposePreview`)

## Proposed Changes

### 1. Remove Redundancy

- **Delete**: `component-detail-client.tsx` - This wrapper adds no value
- **Update**: Import `ComposePreview` directly in the page component

### 2. Rename Components for Clarity

```
Current Name              →  Proposed Name                   Purpose
────────────────────────────────────────────────────────────────────────
KotlinPlayground         →  KotlinPlaygroundBase           Base integration component
KotlinComposeEditor      →  ComposeCodeEditor              Editable code with optional run button
KotlinComposePreview     →  ComposePreviewRenderer         Preview-only output renderer
ComposePreview           →  ComponentDetailView            Full component view (preview + code + actions)
compose-component-form   →  compose-component-form         (Keep as is - clear purpose)
```

### 3. Reorganize File Structure

```
src/
├── components/
│   ├── kotlin-playground/                    # Core playground components
│   │   ├── index.ts                         # Barrel exports
│   │   ├── base/
│   │   │   └── kotlin-playground-base.tsx  # Base component
│   │   ├── compose/
│   │   │   ├── compose-code-editor.tsx     # Editor component
│   │   │   └── compose-preview-renderer.tsx # Preview component
│   │   └── README.md                        # Component documentation
│   │
│   ├── component-views/                      # High-level component views
│   │   └── component-detail-view.tsx        # Full component view
│   │
│   └── forms/
│       └── compose-component-form.tsx       # Component creation form
```

### 4. Add Documentation Headers

Each component should have a clear documentation header:

```typescript
/**
 * ComponentDetailView
 * 
 * Purpose: Displays a complete view of a Compose component including:
 * - Live preview rendered from the component code
 * - Read-only code viewer with syntax highlighting
 * - Copy and download functionality
 * 
 * Used in: Component detail pages (/components/[id])
 * 
 * Props:
 * - component: ComposeComponentWithStats - The component data to display
 */
```

### 5. Create Component Documentation

Create a README.md in the kotlin-playground directory explaining:
- Component hierarchy
- When to use each component
- Configuration options
- Example usage

## Implementation Steps

1. **Phase 1: Documentation** (Do first)
   - Add JSDoc comments to all components
   - Create README.md files
   - Document the component hierarchy

2. **Phase 2: Remove Redundancy**
   - Delete `component-detail-client.tsx`
   - Update imports in page.tsx

3. **Phase 3: Rename Components** (Optional - only if confusion persists)
   - Rename files and components
   - Update all imports
   - Test everything still works

4. **Phase 4: Reorganize** (Optional - only if needed)
   - Create new directory structure
   - Move files
   - Update imports

## Benefits

1. **Clarity**: Each component's purpose is immediately clear
2. **Maintainability**: Easier to understand and modify
3. **Discoverability**: New developers can quickly understand the codebase
4. **Less Confusion**: Clear naming prevents misuse of components