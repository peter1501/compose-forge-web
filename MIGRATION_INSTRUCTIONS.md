# 🚀 Quick Migration Guide

## The Issue
You're getting a 500 error because the database tables haven't been created yet. Here's how to fix it:

## Quick Fix (Copy & Paste)

1. **Open your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy this entire SQL script and paste it:**

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create compose_components table
CREATE TABLE compose_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    preview_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    imports TEXT,
    min_sdk_version INTEGER DEFAULT 21,
    compose_version VARCHAR(20) DEFAULT '1.5.0',
    CONSTRAINT code_size_limit CHECK (LENGTH(code) <= 51200)
);

-- Create compose_favorites table
CREATE TABLE compose_favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    compose_component_id UUID NOT NULL REFERENCES compose_components(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, compose_component_id)
);

-- Create indexes
CREATE INDEX idx_compose_components_author ON compose_components(author_id);
CREATE INDEX idx_compose_components_category ON compose_components(category);
CREATE INDEX idx_compose_components_created_at ON compose_components(created_at DESC);
CREATE INDEX idx_compose_components_view_count ON compose_components(view_count DESC);
CREATE INDEX idx_compose_components_download_count ON compose_components(download_count DESC);
CREATE INDEX idx_compose_favorites_component ON compose_favorites(compose_component_id);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_compose_components_updated_at BEFORE UPDATE
    ON compose_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE compose_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE compose_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view compose components" ON compose_components
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create compose components" ON compose_components
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own compose components" ON compose_components
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own compose components" ON compose_components
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can view their own favorites" ON compose_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON compose_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON compose_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Create view
CREATE VIEW compose_components_with_stats AS
SELECT 
    c.*,
    COUNT(DISTINCT f.user_id) as favorite_count,
    CASE WHEN auth.uid() IS NOT NULL 
         THEN EXISTS(SELECT 1 FROM compose_favorites WHERE user_id = auth.uid() AND compose_component_id = c.id)
         ELSE false 
    END as is_favorited
FROM compose_components c
LEFT JOIN compose_favorites f ON c.id = f.compose_component_id
GROUP BY c.id;

-- Grant permissions
GRANT SELECT ON compose_components_with_stats TO authenticated;
GRANT SELECT ON compose_components_with_stats TO anon;
```

4. **Click "Run" or press Cmd/Ctrl + Enter**

5. **You should see "Success. No rows returned"**

## Verify It Worked

Go back to your app and try creating a component again. It should work now!

## Still Having Issues?

1. Make sure you're signed in to your app
2. Check the browser console for more detailed error messages
3. Try refreshing the page

## Alternative: Reset Everything

If you're still having issues, you can drop everything and start fresh:

```sql
-- Drop everything first
DROP VIEW IF EXISTS compose_components_with_stats CASCADE;
DROP TABLE IF EXISTS compose_favorites CASCADE;
DROP TABLE IF EXISTS compose_components CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

Then run the migration script above again.