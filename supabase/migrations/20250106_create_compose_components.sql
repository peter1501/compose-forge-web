-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create compose_components table
CREATE TABLE compose_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL, -- Stores the full Jetpack Compose Kotlin code
    category VARCHAR(100) NOT NULL,
    preview_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    
    -- Additional metadata for Compose code
    imports TEXT, -- Store required imports separately (optional)
    min_sdk_version INTEGER DEFAULT 21,
    compose_version VARCHAR(20) DEFAULT '1.5.0',
    
    -- Constraints
    CONSTRAINT code_size_limit CHECK (LENGTH(code) <= 51200) -- 50KB limit
);

-- Create compose_favorites table
CREATE TABLE compose_favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    compose_component_id UUID NOT NULL REFERENCES compose_components(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, compose_component_id)
);

-- Create indexes for better performance
CREATE INDEX idx_compose_components_author ON compose_components(author_id);
CREATE INDEX idx_compose_components_category ON compose_components(category);
CREATE INDEX idx_compose_components_created_at ON compose_components(created_at DESC);
CREATE INDEX idx_compose_components_view_count ON compose_components(view_count DESC);
CREATE INDEX idx_compose_components_download_count ON compose_components(download_count DESC);

-- Create index for favorites
CREATE INDEX idx_compose_favorites_component ON compose_favorites(compose_component_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_compose_components_updated_at BEFORE UPDATE
    ON compose_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE compose_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE compose_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for compose_components
-- Anyone can view components
CREATE POLICY "Anyone can view compose components" ON compose_components
    FOR SELECT USING (true);

-- Only authenticated users can create components
CREATE POLICY "Authenticated users can create compose components" ON compose_components
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Only authors can update their components
CREATE POLICY "Authors can update their own compose components" ON compose_components
    FOR UPDATE USING (auth.uid() = author_id);

-- Only authors can delete their components
CREATE POLICY "Authors can delete their own compose components" ON compose_components
    FOR DELETE USING (auth.uid() = author_id);

-- Policies for compose_favorites
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites" ON compose_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites" ON compose_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON compose_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Create view for component with favorite counts
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

-- Grant permissions on the view
GRANT SELECT ON compose_components_with_stats TO authenticated;
GRANT SELECT ON compose_components_with_stats TO anon;