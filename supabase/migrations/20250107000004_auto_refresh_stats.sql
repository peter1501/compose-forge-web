-- Create a function to refresh stats for a specific component
CREATE OR REPLACE FUNCTION refresh_component_stats_for_component(p_component_id UUID)
RETURNS void AS $$
BEGIN
    -- Update the materialized view data for a specific component
    -- Since we can't partially refresh a materialized view, we'll update
    -- the view to be a regular view that queries real-time data
    NULL; -- This function is a placeholder for future optimization
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to handle stat updates
CREATE OR REPLACE FUNCTION handle_component_interaction_change()
RETURNS TRIGGER AS $$
BEGIN
    -- For now, we'll rely on the real-time view
    -- In production, you might want to implement a queue system
    -- or use pg_cron to refresh the materialized view periodically
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for component interactions
CREATE TRIGGER on_component_interaction_change
AFTER INSERT OR DELETE ON component_interactions
FOR EACH ROW
EXECUTE FUNCTION handle_component_interaction_change();

-- For immediate results, let's convert component_stats to a regular view
-- instead of a materialized view for real-time updates

-- First drop the dependent view
DROP VIEW IF EXISTS compose_components_with_stats;

-- Then drop the materialized view
DROP MATERIALIZED VIEW IF EXISTS component_stats;

-- Create as a regular view for real-time updates
CREATE VIEW component_stats AS
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

-- Grant permissions
GRANT SELECT ON component_stats TO authenticated;
GRANT SELECT ON component_stats TO anon;

-- Update the get_component_stats_for_user function to handle NULLs better
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
    
    -- If no stats exist, return zeros
    IF NOT FOUND THEN
        RETURN QUERY SELECT 0::BIGINT, 0::BIGINT, 0::BIGINT, FALSE, FALSE, FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Recreate the compose_components_with_stats view
CREATE VIEW compose_components_with_stats AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.code,
    c.category,
    c.preview_url,
    c.author_id,
    c.created_at,
    c.updated_at,
    c.min_sdk_version,
    c.compose_version,
    -- Use stats from component_stats view (now real-time)
    COALESCE(cs.view_count, 0)::integer as view_count,
    COALESCE(cs.download_count, 0)::integer as download_count,
    COALESCE(cs.favorite_count, 0)::integer as favorite_count,
    CASE WHEN auth.uid() IS NOT NULL 
         THEN EXISTS(
            SELECT 1 FROM component_interactions 
            WHERE user_id = auth.uid() 
            AND component_id = c.id 
            AND interaction_type = 'favorite'
         )
         ELSE false 
    END as is_favorited
FROM compose_components c
LEFT JOIN component_stats cs ON c.id = cs.component_id;

-- Grant permissions on the recreated view
GRANT SELECT ON compose_components_with_stats TO authenticated;
GRANT SELECT ON compose_components_with_stats TO anon;