# Kotlin Playground Component Guide

## Overview

The Kotlin Playground integration in ComposeForge consists of a hierarchy of components that provide different levels of functionality for displaying and editing Compose Multiplatform code.

## Component Structure

```
src/components/
└── compose-components/                      # All Compose-related components
    ├── kotlin-playground.tsx                # Base integration component
    ├── kotlin-playground/                   # Specialized playground components
    │   ├── kotlin-compose-editor.tsx       # Code editor for Compose
    │   ├── kotlin-compose-preview.tsx      # Preview-only renderer
    │   └── README.md                       # Component documentation
    ├── component-creation-form.tsx          # Form for creating components
    ├── component-detail-view.tsx            # Full component view
    ├── component-grid.tsx                   # Grid layout for lists
    └── index.ts                            # Barrel exports
```

## Component Descriptions

### 1. KotlinPlayground (Base Component)
**File**: `src/components/compose-components/kotlin-playground.tsx`  
**Purpose**: Low-level integration with JetBrains Kotlin Playground library  
**Key Features**:
- Loads and manages Kotlin Playground scripts
- Handles CodeMirror editor integration
- Manages compilation and execution
- Detects code changes via polling

**When to use**: Never use directly - use specialized components instead

### 2. KotlinComposeEditor
**File**: `src/components/compose-components/kotlin-playground/kotlin-compose-editor.tsx`  
**Purpose**: Specialized code editor for Compose Multiplatform  
**Key Features**:
- Pre-configured for `compose-wasm` platform
- Optional run button (can be hidden)
- Syntax highlighting and auto-completion
- Supports read-only mode

**Use Cases**:
- Editing code in forms (hide run button)
- Displaying code with syntax highlighting (read-only)

### 3. KotlinComposePreview
**File**: `src/components/compose-components/kotlin-playground/kotlin-compose-preview.tsx`  
**Purpose**: Preview-only component that hides the code editor  
**Key Features**:
- Auto-compiles on mount
- Provides compilation state callbacks
- Shows loading/error states
- Tracks when preview is ready for screenshots

**Use Cases**:
- Showing live preview without code
- Tracking compilation state for UI updates
- Ensuring preview is ready before enabling actions

### 4. ComponentDetailView
**File**: `src/components/compose-components/component-detail-view.tsx`  
**Purpose**: Complete component view for displaying existing components  
**Key Features**:
- Shows preview above code
- Copy code to clipboard
- Download code as .kt file
- Read-only code display

**Use Cases**:
- Component detail pages
- Viewing published components

### 5. ComponentCreationForm
**File**: `src/components/compose-components/component-creation-form.tsx`  
**Purpose**: Form for creating new components  
**Key Features**:
- Editable code with hidden run button
- Manual compilation control
- Preview state management
- Screenshot capture for cover photos

**Use Cases**:
- Creating new components
- Editing component metadata

## Usage Patterns

### Pattern 1: Creating New Components
```tsx
// Editor without run button
<KotlinComposeEditor
  code={code}
  onCodeChange={handleCodeChange}
  showRunButton={false}
/>

// Preview with compilation tracking
<KotlinComposePreview
  code={code}
  onCompilationStart={() => setIsCompiling(true)}
  onCompilationEnd={(success) => {
    setIsCompiling(false)
    setCanCreate(success)
  }}
/>
```

### Pattern 2: Viewing Existing Components
```tsx
// Complete view with preview and code
<ComponentDetailView component={component} />

// Or individual components:
<KotlinComposePreview code={component.code} />
<KotlinComposeEditor code={component.code} readOnly={true} />
```

### Pattern 3: Compilation State Management
```tsx
const [compilationState, setCompilationState] = useState<
  'idle' | 'compiling' | 'success' | 'error'
>('idle')

<KotlinComposePreview
  code={code}
  onCompilationStart={() => setCompilationState('compiling')}
  onCompilationEnd={(success) => {
    setCompilationState(success ? 'success' : 'error')
  }}
/>
```

## Important Notes

### Screenshot Capture
The preview component tracks when the canvas is fully rendered, which is critical for capturing screenshots for component cover photos. Only enable the "Create" button when `isPreviewReady` is true.

### Performance Considerations
- Code change detection uses polling (500ms interval)
- Preview compilation can take several seconds
- Canvas detection includes a 500ms delay for paint completion

### State Management
- Each component manages its own state independently
- Preview compilation state is separate from editor state
- Use callbacks to synchronize UI state with compilation state

### Error Handling
- Both editor and preview handle errors gracefully
- Compilation errors are shown in the preview area
- Network errors show appropriate fallback UI

## File Organization Best Practices

1. **Base components** go in `/src/components/`
2. **Specialized components** go in `/src/components/compose-components/kotlin-playground/`
3. **Page-specific components** go with their pages
4. **Shared types** go in `/src/lib/types/`
5. **Hooks** go in `/src/hooks/`

## Recent Improvements

1. **Removed Redundancy**: Deleted unnecessary `ComponentDetailClient` wrapper
2. **Added Documentation**: All components now have comprehensive JSDoc comments
3. **Clear Purpose**: Each component has a single, well-defined responsibility
4. **Better Organization**: Related components are grouped together

## Future Considerations

1. Consider renaming components if confusion persists
2. Could extract common patterns into custom hooks
3. Might benefit from a state management solution for complex forms
4. Could add more configuration options for different use cases