# Kotlin Playground Components

This directory contains components for integrating JetBrains Kotlin Playground into the ComposeForge application.

## Component Hierarchy

```
KotlinPlayground (base component in parent directory)
├── KotlinComposeEditor (specialized editor)
└── KotlinComposePreview (preview-only renderer)
```

## Components

### KotlinPlayground (../kotlin-playground.tsx)
- **Purpose**: Base integration with Kotlin Playground library
- **Features**: Script loading, CodeMirror management, compilation handling
- **When to use**: Never directly - use specialized components instead

### KotlinComposeEditor
- **Purpose**: Code editor specialized for Compose Multiplatform
- **Features**: 
  - Pre-configured for compose-wasm platform
  - Optional run button (can be hidden)
  - Auto-completion and syntax highlighting
  - Read-only mode support
- **When to use**:
  - Editing new components (with `showRunButton={false}`)
  - Displaying code with syntax highlighting (with `readOnly={true}`)

### KotlinComposePreview
- **Purpose**: Preview-only component that hides the code editor
- **Features**:
  - Auto-compiles on mount
  - Compilation state callbacks
  - Loading states and error handling
  - Canvas detection for screenshot readiness
- **When to use**:
  - Showing live preview without code
  - When you need to track compilation state
  - When you need to capture screenshots

## Usage Examples

### For Creating New Components
```tsx
// In a form - editor with hidden run button + preview
<KotlinComposeEditor
  code={code}
  onCodeChange={handleCodeChange}
  showRunButton={false}
/>

<KotlinComposePreview
  code={code}
  onCompilationEnd={(success) => {
    // Enable create button only when preview is ready
  }}
/>
```

### For Viewing Existing Components
```tsx
// Read-only code display
<KotlinComposeEditor
  code={component.code}
  readOnly={true}
  autoRun={false}
/>

// Auto-compiling preview
<KotlinComposePreview
  code={component.code}
  autoCompile={true}
/>
```

## Configuration Options

### Common Props
- `code`: The Kotlin code to display/compile
- `height`: Height of the component (default: "400px")
- `theme`: Editor theme ("default" | "darcula" | "idea")

### Editor-Specific Props
- `onCodeChange`: Callback for code changes
- `readOnly`: Disable editing (default: false)
- `showRunButton`: Show/hide run button (default: false)
- `outputHeight`: Height of output area (default: 300)

### Preview-Specific Props
- `onCompilationStart`: Called when compilation starts
- `onCompilationEnd`: Called with success/failure status
- `showLoadingState`: Show loading indicator (default: true)
- `autoCompile`: Auto-compile on mount (default: true)

## Architecture Notes

1. **State Management**: Each component manages its own state independently
2. **Compilation Flow**: Preview component tracks compilation state for screenshot capture
3. **Error Handling**: Both components handle errors gracefully with user feedback
4. **Performance**: Code change detection uses polling due to Kotlin Playground API limitations

## Related Files
- `/src/hooks/useKotlinPlayground.ts`: Hook for loading playground scripts
- `/src/types/kotlin-playground.d.ts`: TypeScript definitions
- `/src/components/compose-preview.tsx`: High-level component using these