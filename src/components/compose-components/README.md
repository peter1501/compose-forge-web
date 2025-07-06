# Compose Components

This directory contains all components related to Compose Multiplatform components in ComposeForge.

## Directory Structure

```
compose-components/
├── kotlin-playground/              # Kotlin Playground integration components
│   ├── kotlin-compose-editor.tsx  # Code editor specialized for Compose
│   ├── kotlin-compose-preview.tsx # Preview-only renderer
│   └── README.md                  # Detailed playground documentation
├── kotlin-playground.tsx          # Base Kotlin Playground component
├── component-creation-form.tsx    # Form for creating new components
├── component-detail-view.tsx      # Full view for displaying components
├── component-grid.tsx             # Grid layout for component lists
└── index.ts                       # Barrel exports
```

## Component Overview

### High-Level Components

#### ComponentCreationForm
- **Purpose**: Form for creating new Compose components
- **Features**: Code editor, preview, metadata fields, screenshot capture
- **Used in**: `/components/new` page

#### ComponentDetailView  
- **Purpose**: Complete view of an existing component
- **Features**: Live preview, read-only code, copy/download actions
- **Used in**: `/components/[id]` page

#### ComposeComponentGrid
- **Purpose**: Grid display of multiple components
- **Features**: Card layout, stats display, navigation
- **Used in**: Dashboard, component listing pages

### Kotlin Playground Components

See [kotlin-playground/README.md](./kotlin-playground/README.md) for detailed documentation on:
- KotlinPlayground (base component)
- KotlinComposeEditor
- KotlinComposePreview

## Import Examples

```typescript
// Import individual components
import { ComponentCreationForm } from '@/components/compose-components/component-creation-form'
import { ComponentDetailView } from '@/components/compose-components/component-detail-view'
import { ComposeComponentGrid } from '@/components/compose-components/component-grid'

// Or use barrel imports
import { 
  ComponentCreationForm,
  ComponentDetailView,
  ComposeComponentGrid,
  KotlinComposeEditor,
  KotlinComposePreview
} from '@/components/compose-components'
```

## Component Relationships

```
ComponentCreationForm
├── Uses: KotlinComposeEditor (editable, no run button)
└── Uses: KotlinComposePreview (with compilation callbacks)

ComponentDetailView
├── Uses: KotlinComposeEditor (read-only)
└── Uses: KotlinComposePreview (auto-compile)

ComposeComponentGrid
└── Displays: Multiple component cards with stats
```

## Naming Convention

- **component-**: Prefix for high-level components
- **kotlin-**: Prefix for Kotlin Playground related components
- Descriptive suffixes: `-form`, `-view`, `-grid`

## State Management

Each component manages its own state:
- **ComponentCreationForm**: Form data, compilation state, preview readiness
- **ComponentDetailView**: Copy status, download handling
- **ComposeComponentGrid**: Grid layout, filtering (if applicable)