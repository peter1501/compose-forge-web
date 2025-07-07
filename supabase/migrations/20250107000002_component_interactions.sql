-- Create component_interactions table for tracking user engagement
CREATE TABLE component_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES compose_components(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('view', 'download', 'favorite')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, component_id, interaction_type)
);

-- Create indexes for performance
CREATE INDEX idx_component_interactions_component_id ON component_interactions(component_id);
CREATE INDEX idx_component_interactions_user_component ON component_interactions(user_id, component_id);
CREATE INDEX idx_component_interactions_type ON component_interactions(interaction_type);
CREATE INDEX idx_component_interactions_created_at ON component_interactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE component_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own interactions
CREATE POLICY "Users can view their own interactions" ON component_interactions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own interactions
CREATE POLICY "Users can create their own interactions" ON component_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own interactions (for removing favorites)
CREATE POLICY "Users can update their own interactions" ON component_interactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own interactions
CREATE POLICY "Users can delete their own interactions" ON component_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create materialized view for component statistics
CREATE MATERIALIZED VIEW component_stats AS
SELECT 
    c.id as component_id,
    COUNT(DISTINCT CASE WHEN ci.interaction_type = 'view' THEN ci.user_id END) as view_count,
    COUNT(DISTINCT CASE WHEN ci.interaction_type = 'download' THEN ci.user_id END) as download_count,
    COUNT(DISTINCT CASE WHEN ci.interaction_type = 'favorite' THEN ci.user_id END) as favorite_count,
    MAX(CASE WHEN ci.interaction_type = 'view' THEN ci.created_at END) as last_viewed_at,
    MAX(CASE WHEN ci.interaction_type = 'download' THEN ci.created_at END) as last_downloaded_at
FROM compose_components c
LEFT JOIN component_interactions ci ON c.id = ci.component_id
GROUP BY c.id;

-- Create index on materialized view
CREATE INDEX idx_component_stats_component_id ON component_stats(component_id);

-- Function to refresh component stats
CREATE OR REPLACE FUNCTION refresh_component_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY component_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to track component interaction
CREATE OR REPLACE FUNCTION track_component_interaction(
    p_user_id UUID,
    p_component_id UUID,
    p_interaction_type VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if interaction already exists
    SELECT EXISTS(
        SELECT 1 FROM component_interactions 
        WHERE user_id = p_user_id 
        AND component_id = p_component_id 
        AND interaction_type = p_interaction_type
    ) INTO v_exists;
    
    -- If favorite interaction and already exists, delete it (toggle off)
    IF p_interaction_type = 'favorite' AND v_exists THEN
        DELETE FROM component_interactions 
        WHERE user_id = p_user_id 
        AND component_id = p_component_id 
        AND interaction_type = p_interaction_type;
        RETURN FALSE; -- Unfavorited
    END IF;
    
    -- Insert new interaction if it doesn't exist
    IF NOT v_exists THEN
        INSERT INTO component_interactions (user_id, component_id, interaction_type)
        VALUES (p_user_id, p_component_id, p_interaction_type)
        ON CONFLICT (user_id, component_id, interaction_type) DO NOTHING;
    END IF;
    
    RETURN TRUE; -- Interaction tracked/favorited
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get component stats with user interaction status
CREATE OR REPLACE FUNCTION get_component_stats_for_user(
    p_component_id UUID,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    view_count BIGINT,
    download_count BIGINT,
    favorite_count BIGINT,
    is_viewed_by_user BOOLEAN,
    is_downloaded_by_user BOOLEAN,
    is_favorited_by_user BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(cs.view_count, 0)::BIGINT,
        COALESCE(cs.download_count, 0)::BIGINT,
        COALESCE(cs.favorite_count, 0)::BIGINT,
        CASE WHEN p_user_id IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM component_interactions 
                   WHERE user_id = p_user_id 
                   AND component_id = p_component_id 
                   AND interaction_type = 'view')
        ELSE FALSE END,
        CASE WHEN p_user_id IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM component_interactions 
                   WHERE user_id = p_user_id 
                   AND component_id = p_component_id 
                   AND interaction_type = 'download')
        ELSE FALSE END,
        CASE WHEN p_user_id IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM component_interactions 
                   WHERE user_id = p_user_id 
                   AND component_id = p_component_id 
                   AND interaction_type = 'favorite')
        ELSE FALSE END
    FROM component_stats cs
    WHERE cs.component_id = p_component_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant permissions
GRANT EXECUTE ON FUNCTION track_component_interaction TO authenticated;
GRANT EXECUTE ON FUNCTION get_component_stats_for_user TO authenticated;
GRANT EXECUTE ON FUNCTION get_component_stats_for_user TO anon;
GRANT SELECT ON component_stats TO authenticated;
GRANT SELECT ON component_stats TO anon;

-- Migrate existing data from compose_favorites to component_interactions
INSERT INTO component_interactions (user_id, component_id, interaction_type, created_at)
SELECT user_id, compose_component_id, 'favorite', created_at
FROM compose_favorites
ON CONFLICT (user_id, component_id, interaction_type) DO NOTHING;

-- Initial refresh of materialized view
REFRESH MATERIALIZED VIEW component_stats;