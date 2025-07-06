# Kotlin Playground Integration - Current Limitations

## Overview

The Kotlin Playground integration in ComposeForge provides syntax highlighting for Android Jetpack Compose components. However, there are some limitations regarding live code execution.

## Current Limitations

### 1. No Android/Compose Dependencies
The standard Kotlin Playground server (play.kotlinlang.org) doesn't include Android or Jetpack Compose dependencies. This means:
- `androidx.compose.*` imports cannot be resolved
- Android-specific APIs are not available
- `@Preview` annotations don't work in the playground

### 2. Target Platform Options
Available target platforms in Kotlin Playground:
- `java` - Standard JVM (no Android libraries)
- `js` - JavaScript target
- `canvas` - Canvas rendering (for graphics)
- `junit` - For unit tests

None of these include Android Compose libraries.

## Why This Happens

Kotlin Playground runs on JetBrains' servers with a predefined set of libraries. Android Compose requires:
- Android SDK
- AndroidX libraries
- Compose compiler plugin
- Compose runtime libraries

These are not available in the standard playground environment.

## Current Solution

We use Kotlin Playground in "highlight-only" mode to provide:
- Syntax highlighting
- Code formatting
- Familiar editor experience
- Copy/download functionality

## Future Possibilities

### 1. Custom Kotlin Playground Backend
Set up a custom instance of kotlin-compiler-server with Compose dependencies:
```bash
# Clone and modify kotlin-compiler-server
# Add Compose dependencies
# Deploy custom server
# Use data-server attribute to point to custom backend
```

### 2. Compose for Web/Wasm
When Compose for Web becomes more stable:
- Convert Android Compose to Compose Multiplatform
- Use Canvas-based rendering
- Run in browser with Kotlin/Wasm

### 3. Server-Side Rendering
Build a separate service that:
- Compiles Android Compose code
- Renders components server-side
- Returns screenshots/videos
- Provides accurate previews

### 4. Integration with Appetize.io or Similar
- Upload APK with component previews
- Embed Android emulator in browser
- Show live component interaction

## Recommended Approach

For now, we recommend:
1. Use syntax highlighting for code display
2. Allow users to upload static preview images
3. Provide clear copy/download buttons
4. Link to Android Studio for testing

## Example Configuration

```typescript
<KotlinPlayground
  code={component.code}
  height="500px"
  theme="darcula"
  highlightOnly={true}  // Syntax highlighting only
  targetPlatform="java" // Best highlighting for Kotlin
/>
```

## Resources

- [Kotlin Playground Documentation](https://github.com/JetBrains/kotlin-playground)
- [Custom Kotlin Compiler Server](https://github.com/JetBrains/kotlin-compiler-server)
- [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)