# Debugging Authentication Issues

## Current Issue
Getting 401 Unauthorized when trying to create components, even after signing up.

## Possible Causes

1. **Email Verification is Enabled**
   - If email verification is required, users won't be authenticated until they confirm their email
   - Check Supabase Dashboard → Authentication → Providers → Email → "Enable email confirmations"

2. **Session Not Being Created**
   - The signup might be successful but the session isn't being established
   - Check browser DevTools → Application → Cookies for Supabase session cookies

3. **Middleware Issues**
   - The middleware might be blocking authenticated requests
   - Check `/src/middleware.ts`

## Quick Fixes

### 1. Disable Email Verification (Development Only)
1. Go to Supabase Dashboard
2. Navigate to Authentication → Providers → Email
3. Turn OFF "Enable email confirmations"
4. Save changes

### 2. Check Current Auth Status
Open browser console and run:
```javascript
// Check if you're logged in
const supabase = window.supabase || (await import('@/utils/supabase/client')).createClient()
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

### 3. Manual Sign In
If you've signed up but aren't authenticated:
1. Go to `/login`
2. Sign in with your credentials
3. You should be redirected and authenticated

### 4. Clear Browser Data
Sometimes stale sessions cause issues:
1. Open DevTools → Application → Storage
2. Clear all site data
3. Try signing up/in again

## Testing Authentication

After fixing, test by:
1. Going to `/components/new`
2. You should see the form (not redirected to login)
3. Try creating a component
4. It should work without 401 errors