# Database Setup for ComposeForge

## Running Database Migrations

After setting up your Supabase project, you need to apply the database migrations to create the necessary tables and views.

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy the entire contents of `/supabase/migrations/20250106_create_compose_components.sql`
6. Paste it into the SQL editor
7. Click **Run** or press `Cmd/Ctrl + Enter`

The migration will:
- Create the `compose_components` table for storing Jetpack Compose components
- Create the `compose_favorites` table for user favorites
- Set up the `compose_components_with_stats` view for component statistics
- Configure Row Level Security (RLS) policies
- Create necessary indexes for performance

### Option 2: Using Supabase CLI

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push
```

### Option 3: Manual SQL Execution

You can also run the SQL directly in any PostgreSQL client connected to your Supabase database.

## Verifying the Migration

After running the migration, verify it was successful:

1. In the Supabase Dashboard, go to **Table Editor**
2. You should see:
   - `compose_components` table
   - `compose_favorites` table
3. Go to **SQL Editor** and run:
   ```sql
   SELECT * FROM compose_components_with_stats LIMIT 1;
   ```
   This should return an empty result (not an error)

## Troubleshooting

### Error: "relation does not exist"

If you see errors like `relation "public.compose_components_with_stats" does not exist`, it means the migration hasn't been applied yet.

### RLS Policies Not Working

Make sure RLS is enabled for the tables:
```sql
ALTER TABLE compose_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE compose_favorites ENABLE ROW LEVEL SECURITY;
```

### Missing UUID Extension

If you get an error about `uuid_generate_v4()`, ensure the UUID extension is enabled:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Next Steps

After successfully applying the migration:
1. Restart your development server: `npm run dev`
2. Navigate to `/dashboard` - it should now load without errors
3. Try creating your first Compose component at `/components/new`