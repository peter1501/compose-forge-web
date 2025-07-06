# Supabase Authentication Setup

## Disabling Email Verification

To disable email verification for development purposes:

1. **Via Supabase Dashboard (Recommended for Development)**:
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Providers** → **Email**
   - Find the "Enable email confirmations" toggle
   - Turn it **OFF** to disable email verification
   - Save your changes

2. **For Local Development**:
   If you're using Supabase CLI for local development, you can modify the `config.toml` file:
   ```toml
   [auth.email]
   enable_confirmations = false
   ```

## Important Notes

- **Security Warning**: Disabling email verification is only recommended for development environments. Always enable it in production to ensure users own the email addresses they sign up with.

- **Automatic Sign-in**: When email verification is disabled, users will be automatically signed in after registration and redirected to the dashboard.

- **Session Handling**: The app is already configured to handle both scenarios:
  - If email verification is disabled: Users are redirected to `/dashboard` immediately
  - If email verification is enabled: Users see a confirmation message

## Testing the Authentication Flow

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign Up" to create a new account
4. After successful registration:
   - With email verification disabled: You'll be redirected to the dashboard
   - With email verification enabled: You'll see a confirmation message

## Environment Variables

Ensure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```