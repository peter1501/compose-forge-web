# Feature Plan: Kotlin Playground Integration for Compose Component Preview

## Executive Summary

This feature will integrate Kotlin Playground API to enable real-time preview and rendering of Jetpack Compose components directly within the ComposeForge marketplace. Users will be able to see live previews of components, interact with them, and understand how they work before downloading or purchasing.

## Current Research Findings

### Kotlin Playground API Capabilities
- **Embedded Code Execution**: Kotlin Playground can be embedded in web pages with a single script tag
- **Backend Compilation**: Code is compiled on JetBrains servers and can run in browser (JS target) or server (JVM target)
- **Customization Options**: Supports read-only mode, autocompletion, error highlighting, and custom server endpoints
- **API Methods**: Provides programmatic control for code execution and state management
- **Canvas Support**: Kotlin Playground supports canvas rendering with `data-target-platform="canvas"`

### Recent Developments (2024-2025)
- **Compose Web Progress**: JetBrains is actively working on Compose Web support for Kotlin Playground
- **YouTrack Issue KT-56195**: Tracking "Support Compose For Web Canvas + Kotlin/Wasm at play.kotlinlang.org"
- **Community Interest**: Active discussion on Kotlin forums about Compose support in playground
- **Prototype Exists**: There's mention of a working prototype for Compose Web on Kotlin Playground
- **Kotlin/Wasm**: Now in Alpha status, enabling better web performance

### Current Limitations
- **No Production-Ready Solution**: While prototypes exist, there's no official Compose rendering in Kotlin Playground yet
- **Compose for Web**: Still in Alpha, doesn't directly support Android Compose components
- **Preview Annotations**: @Preview annotations are IDE-specific and don't translate to web execution
- **Mobile Browser Support**: Kotlin/Wasm works well on desktop browsers but needs work for mobile

## User Stories

### As a Component Consumer
1. **Preview Components**: As a developer browsing components, I want to see live previews of Compose components so that I can understand their appearance and behavior before using them.
   - **Acceptance Criteria**:
     - See rendered component preview alongside code
     - Interact with component if it has interactive elements
     - View different preview states (@Preview variations)

2. **Modify Parameters**: As a developer, I want to modify component parameters in real-time so that I can see how the component behaves with different inputs.
   - **Acceptance Criteria**:
     - Edit component parameters in playground
     - See live updates as parameters change
     - Reset to default values

3. **Copy Code**: As a developer, I want to easily copy working code snippets so that I can quickly integrate components into my project.
   - **Acceptance Criteria**:
     - One-click copy functionality
     - Copy includes necessary imports
     - Code is properly formatted

### As a Component Creator
4. **Preview Validation**: As a component creator, I want to validate that my component previews correctly so that buyers can see accurate representations.
   - **Acceptance Criteria**:
     - Test preview rendering during submission
     - Define multiple preview states
     - Ensure code compiles successfully

5. **Interactive Demos**: As a component creator, I want to create interactive demos so that I can showcase advanced features.
   - **Acceptance Criteria**:
     - Support for state management in previews
     - Animation and gesture support
     - Theme switching capabilities

## UX/UI Design

### Component Detail Page Enhancement

```
┌─────────────────────────────────────────────────────────────────┐
│ Component Name                                     ⭐ 4.5 (120)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────┬─────────────────────────────────┐    │
│  │   Preview              │   Code Editor                   │    │
│  │  ┌─────────────────┐  │  @Preview                       │    │
│  │  │                 │  │  @Composable                    │    │
│  │  │   Component     │  │  fun MyButton(                  │    │
│  │  │   Preview       │  │      text: String = "Click",    │    │
│  │  │                 │  │      onClick: () -> Unit = {}   │    │
│  │  └─────────────────┘  │  ) {                            │    │
│  │                       │      Button(onClick = onClick) { │    │
│  │  Preview Controls:    │          Text(text)             │    │
│  │  [Light] [Dark]       │      }                          │    │
│  │  [Phone] [Tablet]     │  }                              │    │
│  │                       │                                 │    │
│  └───────────────────────┴─────────────────────────────────┘    │
│                                                                   │
│  [▶ Run] [📋 Copy Code] [🔄 Reset] [⚙️ Parameters]               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Interactive Parameter Panel

```
┌─────────────────────────────────────┐
│ Component Parameters                 │
├─────────────────────────────────────┤
│ text: [___"Click Me"___]            │
│ enabled: [✓]                        │
│ color: [Primary ▼]                  │
│ size: [●──────] Medium              │
└─────────────────────────────────────┘
```

### User Flow
1. User navigates to component detail page
2. Playground loads with default preview
3. User can:
   - Switch between preview variations
   - Edit code directly
   - Modify parameters via UI controls
   - Copy working code
   - Toggle theme/device preview

## Technical Architecture

### System Design

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   ComposeForge      │     │  Kotlin Playground  │     │  Rendering Service  │
│   Frontend (Next.js)│────▶│  API (JetBrains)    │────▶│  (Custom Solution)  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         │                            │                            │
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  Component Code     │     │  Compilation        │     │  Preview Generation │
│  Storage (Supabase) │     │  & Execution        │     │  (Canvas/WebGL)     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### Technical Approach Options

#### Option 1: Wait for Official Kotlin Playground Compose Support
- Monitor YouTrack issue KT-56195 progress
- Use existing prototype if available
- Contribute to JetBrains efforts

**Pros**: Official support, no maintenance overhead, best integration
**Cons**: Timeline uncertain, limited control over features

#### Option 2: Kotlin Playground Canvas Mode + Compose Web
- Use Kotlin Playground with `data-target-platform="canvas"`
- Implement Compose Web components that mirror Android Compose
- Render using CanvasBasedWindow

**Pros**: Leverages existing Kotlin Playground features, official Canvas support
**Cons**: Need to maintain Compose Web versions of components, Alpha status

#### Option 3: Custom Kotlin Playground Server + Compose Web
- Deploy custom Kotlin Playground server (open source)
- Add Compose Web dependencies
- Full control over compilation and rendering

**Pros**: Complete control, can add custom features
**Cons**: Infrastructure costs, maintenance overhead

#### Option 4: Server-Side Rendering with Screenshots
- Compile and run Compose on server
- Generate screenshots/videos of components
- Stream to frontend

**Pros**: 100% accurate rendering, supports all features
**Cons**: Higher server costs, latency issues

### Recommended Approach: Hybrid Solution

1. **Phase 1**: Kotlin Playground + Static Previews
   - Embed Kotlin Playground for code viewing/editing
   - Use pre-generated screenshots for previews
   - Support basic parameter modification

2. **Phase 2**: Dynamic Preview Generation
   - Implement server-side rendering service
   - Generate previews on-demand
   - Cache frequently used previews

3. **Phase 3**: Interactive Previews
   - Explore Compose for Web when stable
   - Build custom rendering engine for subset of components
   - Full interactivity support

### API Contracts

#### Component Preview Request
```typescript
interface PreviewRequest {
  componentId: string;
  code: string;
  parameters: Record<string, any>;
  theme: 'light' | 'dark';
  device: 'phone' | 'tablet' | 'desktop';
}
```

#### Preview Response
```typescript
interface PreviewResponse {
  previewUrl: string;
  compilationStatus: 'success' | 'error';
  errors?: CompilationError[];
  metadata: {
    renderTime: number;
    cacheHit: boolean;
  };
}
```

### Data Models

#### Enhanced Component Schema
```sql
-- Add to existing compose_components table
ALTER TABLE compose_components ADD COLUMN preview_config JSONB DEFAULT '{}';

-- Preview configuration structure
{
  "defaultPreview": "@Preview annotation code",
  "previewVariations": [
    {
      "name": "Dark Theme",
      "code": "@Preview(uiMode = Configuration.UI_MODE_NIGHT_YES)",
      "parameters": {}
    }
  ],
  "interactiveParameters": [
    {
      "name": "text",
      "type": "string",
      "default": "Click Me",
      "control": "textfield"
    }
  ]
}
```

## Implementation Roadmap

### MVP (Sprint 1-2)
- [ ] Integrate Kotlin Playground for code display
- [ ] Implement syntax highlighting and read-only mode
- [ ] Add copy code functionality
- [ ] Display static preview images

### Enhanced Preview (Sprint 3-4)
- [ ] Build preview generation service
- [ ] Implement parameter modification UI
- [ ] Add theme switching
- [ ] Cache preview results

### Interactive Features (Sprint 5-6)
- [ ] Enable code editing in playground
- [ ] Real-time compilation feedback
- [ ] Multiple preview variations
- [ ] Device preview options

### Advanced Features (Future)
- [ ] Full interactive previews
- [ ] Animation support
- [ ] State management demos
- [ ] Performance profiling

## Technical Dependencies

1. **Kotlin Playground Script**
   ```html
   <script src="https://unpkg.com/kotlin-playground@1" 
           data-selector=".kotlin-code"
           data-server="https://compile.kotlinlang.org">
   </script>
   ```

2. **Canvas Mode Configuration**
   ```html
   <div class="kotlin-code" 
        data-target-platform="canvas" 
        data-output-height="400">
   // Compose Web code here
   </div>
   ```

3. **Additional Libraries**
   - React wrapper for Kotlin Playground
   - Compose Web dependencies for Canvas rendering
   - Code formatting library (Prettier for Kotlin)

4. **Infrastructure**
   - Preview generation service (Docker containers)
   - CDN for caching previews
   - WebSocket for real-time updates

## Implementation Examples

### Canvas-Based Kotlin Playground Example
```kotlin
// For Compose Web with Canvas in Kotlin Playground
import androidx.compose.ui.window.CanvasBasedWindow
import androidx.compose.material3.*
import androidx.compose.runtime.*

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    CanvasBasedWindow(canvasElementId = "ComposeTarget") {
        MaterialTheme {
            Button(onClick = { /* Handle click */ }) {
                Text("Compose Button")
            }
        }
    }
}
```

## Security Considerations

1. **Code Execution Sandboxing**
   - All code execution on isolated servers
   - Resource limits (CPU, memory, time)
   - No network access from preview environment

2. **Input Validation**
   - Sanitize all user inputs
   - Validate Kotlin syntax before execution
   - Rate limiting on preview generation

3. **Content Security Policy**
   - Restrict iframe sources
   - Prevent XSS in playground
   - Secure communication with compilation servers

## Performance Optimization

1. **Caching Strategy**
   - Cache compilation results
   - CDN for preview images
   - Local storage for user modifications

2. **Lazy Loading**
   - Load playground only when needed
   - Progressive enhancement
   - Optimistic UI updates

3. **Resource Management**
   - Limit concurrent compilations
   - Queue management for preview requests
   - Graceful degradation

## Success Metrics

1. **User Engagement**
   - % of users who interact with preview
   - Average time spent on component pages
   - Preview-to-download conversion rate

2. **Technical Performance**
   - Preview generation time < 3 seconds
   - 99% uptime for preview service
   - < 100ms for cached previews

3. **Creator Adoption**
   - % of components with previews
   - Number of preview variations per component
   - Creator satisfaction score

## Risks and Mitigation

1. **Technical Complexity**
   - Risk: Building accurate Compose renderer
   - Mitigation: Start with static previews, iterate

2. **Performance Issues**
   - Risk: Slow preview generation
   - Mitigation: Aggressive caching, CDN usage

3. **Compatibility**
   - Risk: Not all Compose features supported
   - Mitigation: Clear documentation of limitations

4. **Cost**
   - Risk: High server costs for compilation
   - Mitigation: Usage limits, premium features

## Next Steps

1. Prototype Kotlin Playground integration
2. Evaluate rendering service options
3. Design detailed UI mockups
4. Create technical spike for preview generation
5. Estimate infrastructure costs