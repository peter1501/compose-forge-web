# Kotlin Playground Debugging Guide

## Testing the New Event-Based System

### Test Pages Created

1. **Simple Test Page**: `/test-simple`
   - Basic playground with logging
   - Shows all events in real-time
   - Use this to verify events are firing

2. **Example Page**: `/test-playground`
   - Full editor/preview example
   - Tests the shared state hook

### What to Check in Browser Console

When you click "Compile Component", you should see these logs in order:

1. `[useKotlinCompose] compileCode called`
2. `[KotlinComposePreview] executeCode called`
3. `[KotlinPlayground] executeCode called`
4. `[KotlinPlayground] Run button clicked`
5. `[KotlinPlayground] Calling onCompileStart`
6. `[KotlinPlayground] Output area found: true/false`
7. `[KotlinPlayground] Mutation observed` (when compilation completes)

### Common Issues and Solutions

#### Issue: "Nothing happens when clicking compile"

**Check 1**: Is the preview component mounted?
- The preview must be visible (showPreview=true) before compilation
- We added a 100ms delay in handleCompile to ensure this

**Check 2**: Is the run button found?
- Look for log: `[KotlinPlayground] Run button found: true`
- If false, the Kotlin Playground DOM structure may have changed

**Check 3**: Is the output area found?
- Look for log: `[KotlinPlayground] Output area found: true`
- If false, the mutation observer won't detect compilation completion

#### Issue: "Compilation callbacks not firing"

**Check 1**: Is the playground callback being called?
- Look for log: `[KotlinPlayground] Callback called`
- This should happen during initialization

**Check 2**: Is the run button click handler attached?
- The run button should have our custom onclick handler
- Check if `[KotlinPlayground] Run button clicked` appears

#### Issue: "Code changes not detected"

**Check 1**: Is the onChange handler set up?
- The `data-on-change-opened` attribute must be set before initialization
- Check if `window.onCodeChangeHandler` exists in console

### Manual Testing Steps

1. Navigate to `/components/new`
2. Open browser console (F12)
3. Click "Compile Component"
4. Watch for the debug logs
5. Check if preview appears
6. Try editing code and see if changes are detected

### Debugging Commands

Run these in browser console:

```javascript
// Check if onChange handler exists
window.onCodeChangeHandler

// Find all Kotlin Playground instances
document.querySelectorAll('.kotlin-code')

// Check if run button exists
document.querySelector('.run-button')

// Check if output area exists
document.querySelector('.js-code-output-executor')

// Manually trigger compilation
document.querySelector('.run-button')?.click()
```

### Architecture Summary

The new system works as follows:

1. **Code Changes**: Detected via Kotlin Playground's `onChange` callback
2. **Compilation Trigger**: Via programmatic button click or instance.execute()
3. **Compilation State**: Tracked via MutationObserver on output area
4. **Shared State**: Managed by useKotlinCompose hook
5. **Ref Forwarding**: KotlinComposePreview uses forwardRef for imperative API

### If Still Not Working

1. Check if Kotlin Playground script loaded:
   ```javascript
   typeof window.KotlinPlayground !== 'undefined'
   ```

2. Check if playground is initialized:
   - Look for `.executable-fragment-wrapper` in DOM
   - Should contain `.run-button` and `.code-area`

3. Verify compose-wasm platform:
   - Check for `data-target-platform="compose-wasm"` attribute
   - This is required for Compose rendering

4. Check browser console for errors:
   - CORS errors when loading playground
   - JavaScript errors during initialization
   - Network errors loading dependencies