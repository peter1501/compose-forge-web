# Kotlin Playground Event-Based Architecture Guide

## Overview

This guide documents the event-based architecture implemented for the Kotlin Playground integration in ComposeForge. The new system replaces the previous polling-based approach with proper event handling, eliminating race conditions and improving performance.

## Key Improvements

### Before (Polling-Based)
- Used 100ms polling intervals to detect code changes
- Race conditions between editor and preview updates
- Delayed feedback and poor user experience
- Unreliable compilation state tracking

### After (Event-Based)
- Instant code change detection via CodeMirror events
- Real-time compilation state tracking with MutationObserver
- Synchronized editor/preview state through shared hook
- Zero race conditions

## Architecture Components

### 1. Base KotlinPlayground Component
Location: `/src/components/compose-components/kotlin-playground.tsx`

Key features:
- **CodeMirror Event Integration**: Direct attachment to CodeMirror's change events
- **Compilation State Tracking**: MutationObserver monitors output area for compilation results
- **Programmatic Execution**: Exposed `executeCode` method for parent components
- **Smart Button Handling**: Waits for run button to be enabled before clicking

```typescript
// CodeMirror change handler setup
if (onCodeChange && !highlightOnly && !readOnly) {
  const codeMirrorElement = wrapper.querySelector('.CodeMirror') as any
  if (codeMirrorElement?.CodeMirror) {
    const cm = codeMirrorElement.CodeMirror
    cm.on('change', () => {
      const newCode = cm.getValue()
      onCodeChange(newCode)
    })
  }
}
```

### 2. Shared State Hook (useKotlinCompose)
Location: `/src/hooks/useKotlinCompose.ts`

Provides centralized state management for editor/preview synchronization:
- Single source of truth for code state
- Manages compilation state and callbacks
- Provides props for both editor and preview components
- Handles code execution through refs

```typescript
const {
  code,
  setCode,
  isCompiling,
  compileCode,
  editorProps,    // Props for KotlinComposeEditor
  previewProps,   // Props for KotlinComposePreview
  previewRef      // Ref for programmatic execution
} = useKotlinCompose({
  initialCode: '...',
  onCodeChange: (newCode) => { /* ... */ },
  onCompilationStart: () => { /* ... */ },
  onCompilationEnd: (success) => { /* ... */ }
})
```

### 3. KotlinComposePreview Component
Location: `/src/components/compose-components/kotlin-playground/kotlin-compose-preview.tsx`

Critical changes:
- **readOnly={false}**: Enables internal CodeMirror state updates
- **forwardRef Implementation**: Exposes execute method to parent
- **Proper State Sync**: Updates internal CodeMirror when code prop changes

### 4. Component Creation Form Integration
Location: `/src/components/compose-components/component-creation-form.tsx`

Features:
- Uses shared hook for state management
- Resets compilation state when code changes after success
- Proper button state management (Compile vs Create)
- Screenshot capture from preview canvas
- **Stable Callbacks**: Uses `useCallback` and refs to prevent stale closures

## Event Flow Diagram

```
User Types in Editor
        ↓
CodeMirror 'change' event
        ↓
onCodeChange callback
        ↓
Updates shared state (useKotlinCompose)
        ↓
Preview component receives new code prop
        ↓
Updates internal CodeMirror instance
        ↓
User clicks "Compile"
        ↓
onCompilationStart callback
        ↓
MutationObserver watches output
        ↓
Detects success/error
        ↓
onCompilationEnd callback
        ↓
UI updates (button state, messages)
```

## Implementation Details

### MutationObserver Setup
The MutationObserver monitors the output area for compilation results:

```typescript
const observer = new MutationObserver((mutations) => {
  // Check for errors
  const hasErrors = wrapper.querySelector('.errors-output') || 
                   wrapper.querySelector('.js-exception')
  
  // Check for successful output (iframe with canvas)
  const iframe = wrapper.querySelector('.k2js-iframe') as HTMLIFrameElement
  let success = false
  
  if (iframe && !hasErrors) {
    const iframeDoc = iframe.contentDocument
    const canvas = iframeDoc?.querySelector('canvas#ComposeTarget')
    success = !!canvas
  }

  if (hasErrors || success) {
    observer.disconnect()
    onCompileEnd(!hasErrors && success, errors)
  }
})
```

### Preventing Infinite Loops
When updating CodeMirror value programmatically:

```typescript
// Temporarily remove change listener
const changeHandler = cm._handlers?.change?.[0]
if (changeHandler) cm.off('change', changeHandler)

// Update the value
cm.setValue(code)

// Re-add change listener after delay
if (changeHandler) {
  setTimeout(() => cm.on('change', changeHandler), 100)
}
```

### Button State Management
The form properly manages button states:
- Shows "Compile Component" initially
- Changes to "Create Component" after successful compilation
- Resets to "Compile Component" when code is edited

### Stable Callbacks Pattern
To prevent stale closures in callbacks:

```typescript
// Use refs to track states
const compilationStateRef = useRef(compilationState)
const isPreviewReadyRef = useRef(isPreviewReady)

// Update refs when states change
useEffect(() => {
  compilationStateRef.current = compilationState
}, [compilationState])

// Use stable callbacks with refs
const handleCodeChange = useCallback((newCode: string) => {
  setFormData(prev => ({ ...prev, code: newCode }))
  if (compilationStateRef.current === 'success') {
    setCompilationState('idle')
    setIsPreviewReady(false)
  }
}, [])
```

## Best Practices

1. **Always use the shared hook** (`useKotlinCompose`) for editor/preview pairs
2. **Set appropriate delays** when triggering compilation (1000ms recommended)
3. **Handle all compilation states** (idle, compiling, success, error)
4. **Clean up event handlers** on component unmount
5. **Use refs for imperative actions** like programmatic compilation
6. **Use stable callbacks** with `useCallback` and refs to avoid stale closures

## Troubleshooting

### Preview not updating
- Ensure `readOnly={false}` on KotlinComposePreview
- Check that code prop is being passed correctly
- Verify CodeMirror instance exists before updating

### Compilation not triggering
- Check if run button has `_disabled` class
- Ensure sufficient delay before calling execute
- Verify playground scripts are loaded

### Button state not resetting
- Ensure callbacks are stable (use `useCallback`)
- Use refs to track state in callbacks
- Check that onCodeChange is being called

### Race conditions
- Use the shared hook to ensure single source of truth
- Don't rely on timeouts for state synchronization
- Let events drive the state flow

## Migration Guide

To migrate from polling to event-based:

1. Replace direct KotlinPlayground usage with shared hook
2. Remove any polling intervals or timeouts for state sync
3. Use the provided editor/preview props from the hook
4. Handle compilation callbacks properly
5. Use stable callbacks with `useCallback` and refs
6. Test thoroughly for edge cases

## Technical Details

### Kotlin Playground API Integration
The Kotlin Playground library provides limited callback support. We work around this by:
- Directly accessing the CodeMirror instance for change events
- Using MutationObserver to track DOM changes
- Overriding button click handlers to intercept compilation events

### Performance Considerations
- Event handlers are attached once during initialization
- No polling or intervals running in the background
- Minimal re-renders due to stable callback references
- Efficient DOM observation with specific selectors

## Future Improvements

- WebSocket integration for real-time collaboration
- Better error message parsing from Kotlin compiler
- Performance metrics and monitoring
- Advanced code analysis and suggestions
- Integration with Kotlin Language Server Protocol