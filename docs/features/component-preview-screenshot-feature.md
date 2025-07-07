# Feature: Automatic Component Preview Screenshot Capture

## 🎯 Executive Summary

This feature will automatically capture screenshots of rendered Kotlin Compose components during creation and use them as preview images throughout the ComposeForge marketplace. This will significantly improve the browsing experience by providing visual previews of components without requiring users to click into each one.

## 🔍 Current State Analysis

The infrastructure is partially in place:
- ✅ Screenshot capture code exists in `component-creation-form.tsx` (lines 184-207)
- ✅ Database has `preview_url` column in `compose_components` table
- ✅ Component grid UI expects preview images
- ❌ Screenshots are captured but not saved
- ❌ No Supabase Storage bucket configured
- ❌ Upload logic is missing

## 👥 User Stories & Acceptance Criteria

### As a Component Creator
**User Story**: As a component creator, I want my component preview to be automatically captured as an image so that other developers can see what my component looks like without having to open it.

**Acceptance Criteria**:
- [ ] When I create a component, the system automatically captures a screenshot of the rendered preview
- [ ] I can see the captured preview image before submitting the component
- [ ] If the preview fails to render, I receive clear feedback and can still submit without an image
- [ ] The screenshot capture doesn't significantly slow down the component creation process

### As a Component Browser
**User Story**: As a developer browsing components, I want to see preview images of components in the marketplace so that I can quickly identify components that match my visual requirements.

**Acceptance Criteria**:
- [ ] Component cards in the grid display preview images
- [ ] Preview images load quickly and are optimized for web
- [ ] If a preview image is missing, a meaningful placeholder is shown
- [ ] Preview images are responsive and look good on all screen sizes

### As a System Administrator
**User Story**: As a system administrator, I want component preview images to be efficiently stored and served so that the platform remains performant and cost-effective.

**Acceptance Criteria**:
- [ ] Images are stored in Supabase Storage with appropriate organization
- [ ] Old/unused images can be cleaned up
- [ ] Storage costs are predictable and manageable
- [ ] Images are served through CDN for optimal performance

## 🎨 UX Design

### Component Creation Flow
1. User fills component details
2. User writes/pastes Kotlin code
3. Code compiles and renders in preview
4. **[NEW]** Screenshot is automatically captured when preview is stable
5. **[NEW]** Captured image shown in form with "Preview Image" label
6. User submits form
7. **[NEW]** Image uploaded to storage
8. Component created with preview_url

### Visual Mockup
```
┌─────────────────────────────────────┐
│ Create New Component                 │
├─────────────────────────────────────┤
│ Name: [________________]            │
│ Description: [_________]            │
│                                     │
│ ┌─────────────┬─────────────┐      │
│ │   Editor    │   Preview    │      │
│ │             │              │      │
│ │   [Code]    │  [Rendered]  │      │
│ │             │              │      │
│ └─────────────┴─────────────┘      │
│                                     │
│ Preview Image:                      │
│ ┌─────────────────────────┐        │
│ │ [Captured Screenshot]    │ ✓      │
│ └─────────────────────────┘        │
│                                     │
│ [Cancel]  [Create Component]        │
└─────────────────────────────────────┘
```

### Error States
- Preview compilation error → Show error placeholder image
- Screenshot capture failure → Allow submission without image
- Image upload failure → Retry with exponential backoff

## 🏗️ Technical Architecture

### System Flow
```
Kotlin Playground → Canvas Element → Screenshot Service → Blob/File 
→ Supabase Storage → Database (preview_url) → Component Grid Display
```

### Storage Architecture
- **Bucket**: `component-previews`
- **Path structure**: `{user_id}/{component_id}/preview.png`
- **Access**: Public read, authenticated write
- **CDN**: Automatic via Supabase

### API Design

#### New Endpoint
```typescript
// POST /api/storage/upload-preview
interface UploadPreviewRequest {
  componentId: string;
  imageBlob: Blob;
}

interface UploadPreviewResponse {
  url: string;
  error?: string;
}
```

#### Modified Component Creation
```typescript
// POST /api/components (existing)
interface CreateComponentRequest {
  name: string;
  description: string;
  code: string;
  category: string;
  // ... other fields
  preview_url?: string; // Now populated
}
```

### Implementation Details

#### 1. Storage Service (`lib/services/storage.ts`)
```typescript
export async function uploadComponentPreview(
  userId: string,
  componentId: string,
  imageBlob: Blob
): Promise<string> {
  const supabase = createClient();
  const path = `${userId}/${componentId}/preview.png`;
  
  const { data, error } = await supabase.storage
    .from('component-previews')
    .upload(path, imageBlob, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('component-previews')
    .getPublicUrl(path);
    
  return publicUrl;
}
```

#### 2. Enhanced Screenshot Capture
```typescript
async function capturePreview(): Promise<Blob | null> {
  // Wait for compilation success
  if (compilationState !== 'success') return null;
  
  // Wait additional time for render stabilization
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const iframe = document.querySelector('.k2js-iframe');
  const canvas = iframe?.contentDocument
    ?.getElementById('ComposeTarget');
    
  if (!canvas) return null;
  
  // Capture and optimize
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 0.9);
  });
  
  return optimizeImage(blob);
}
```

### Security Considerations
- Image upload requires authentication
- File size limit: 5MB
- Allowed formats: PNG only
- Rate limiting: 10 uploads per minute per user
- Content validation to prevent malicious uploads

## 📋 Implementation Tasks

### Phase 1: Storage Setup (2 days)
- [ ] Create Supabase Storage bucket `component-previews`
- [ ] Configure bucket policies:
  ```sql
  -- Public read access
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'component-previews');
  
  -- Authenticated write access
  CREATE POLICY "Authenticated Users"
  ON storage.objects FOR INSERT
  USING (auth.role() = 'authenticated');
  ```
- [ ] Create storage service functions in `lib/services/storage.ts`
- [ ] Add storage configuration to environment variables

### Phase 2: Screenshot Capture Enhancement (3 days)
- [ ] Fix canvas capture timing to wait for render completion
- [ ] Add image optimization (resize to max 800x600px)
- [ ] Implement capture status indicator
- [ ] Show captured preview in creation form
- [ ] Add retry mechanism for failed captures

### Phase 3: Upload Integration (3 days)
- [ ] Create `/api/storage/upload-preview` endpoint
- [ ] Integrate upload into component creation flow
- [ ] Add upload progress indicators
- [ ] Implement error handling and retries
- [ ] Update component creation to include preview_url

### Phase 4: Display Implementation (2 days)
- [ ] Update `ComponentCard` to show preview images
- [ ] Add loading skeleton for images
- [ ] Implement error placeholders
- [ ] Add responsive image sizing
- [ ] Update component detail pages

### Phase 5: Testing & Polish (2 days)
- [ ] Unit tests for storage service
- [ ] Integration tests for upload flow
- [ ] E2E tests for complete flow
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization
- [ ] Documentation updates

## 🚀 MVP Implementation (2 weeks)

### Week 1
- Days 1-2: Storage setup and configuration
- Days 3-5: Screenshot capture improvements and upload integration

### Week 2
- Days 6-7: Display implementation
- Days 8-9: Testing and bug fixes
- Day 10: Documentation and deployment prep

## 📊 Success Metrics
- Screenshot capture success rate > 95%
- Image load time < 200ms (CDN cached)
- User engagement increase of 20% on component grid
- Component detail page views increase by 15%
- Zero increase in component creation time

## 🔧 Technical Decisions
- **Storage**: Supabase Storage (integrated with existing auth)
- **Image Format**: PNG for quality, consider WebP in future
- **Image Size**: Max 800x600px, ~200KB target
- **Processing**: Client-side only for MVP
- **Caching**: Browser cache + Supabase CDN
- **Fallback**: Material Design component icon

## 🚦 Rollout Strategy

1. **Alpha Testing** (Internal team)
   - Enable for staff accounts only
   - Monitor capture success rates
   - Gather performance metrics

2. **Beta Testing** (10% of users)
   - Gradual rollout with feature flag
   - Monitor storage costs
   - Collect user feedback

3. **Full Release**
   - Enable for all users
   - Marketing announcement
   - Update documentation

## 📝 Future Enhancements

1. **Phase 2 Features**
   - Multiple screenshots per component
   - GIF recordings of interactions
   - Dark/light mode previews
   - Different device size previews

2. **Advanced Features**
   - AI-powered image optimization
   - Automatic thumbnail generation
   - Preview regeneration for updated components
   - Bulk preview generation for existing components

## 🔍 Open Questions

1. Should we generate previews for existing components retroactively?
2. What's the maximum acceptable file size for preview images?
3. Should we support animated previews (GIF/WebM)?
4. How long should we retain previews for deleted components?

## 📚 References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Performance - Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**Created**: 2025-07-07
**Status**: Planning Complete
**Owner**: ComposeForge Team
**Priority**: High
**Impact**: High