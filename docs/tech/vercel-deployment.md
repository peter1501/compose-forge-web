# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with your code
- Supabase project with environment variables

## Step 1: Connect GitHub Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `compose-forge-web` repository

## Step 2: Configure Environment Variables in Vercel

You **MUST** add your Supabase environment variables in the Vercel dashboard:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add the following variables:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

3. Get these values from your `.env.local` file or Supabase dashboard:
   - **Supabase URL**: Found in Settings → API → Project URL
   - **Anon Key**: Found in Settings → API → Project API keys → anon public

## Step 3: Deploy

1. After adding environment variables, click "Deploy"
2. Vercel will automatically build and deploy your application
3. Your app will be available at `https://your-project.vercel.app`

## Important Notes

### Environment Variables
- **NEXT_PUBLIC_** prefix is required for client-side variables in Next.js
- These variables are safe to expose as they're protected by Row Level Security (RLS)
- Never commit `.env.local` to version control

### Automatic Deployments
- Every push to `main` branch triggers a production deployment
- Every pull request gets a preview deployment
- Preview deployments use the same environment variables

### Supabase Configuration
Make sure your Supabase project has:
1. **Email confirmations disabled** (for development) or properly configured email templates
2. **Site URL** configured to include your Vercel domains:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URLs to "Redirect URLs":
     - `https://your-project.vercel.app/*`
     - `https://your-project-*.vercel.app/*` (for preview deployments)
     - `http://localhost:3000/*` (for local development)

### Post-Deployment Checklist
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test protected routes (dashboard)
- [ ] Test logout functionality
- [ ] Verify Supabase connection

## Troubleshooting

### "Invalid API Key" Error
- Double-check environment variables in Vercel dashboard
- Ensure variables are added to all environments
- Redeploy after adding/updating variables

### Authentication Not Working
- Check Supabase URL Configuration for correct redirect URLs
- Verify email templates if email confirmation is enabled
- Check browser console for specific error messages

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

## Using Vercel CLI (Optional)

Install Vercel CLI:
```bash
npm i -g vercel
```

Link your project:
```bash
vercel link
```

Pull environment variables locally:
```bash
vercel env pull .env.local
```

Deploy from CLI:
```bash
vercel --prod
```