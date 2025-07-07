-- Drop the old view
DROP VIEW IF EXISTS compose_components_with_stats;

-- Recreate the view using component_interactions instead of compose_favorites
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
    -- Use stats from component_stats materialized view
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

-- Grant permissions on the updated view
GRANT SELECT ON compose_components_with_stats TO authenticated;
GRANT SELECT ON compose_components_with_stats TO anon;

-- Also ensure the refresh function is scheduled or can be called
-- This could be done with pg_cron or called periodically from your app
-- For now, let's refresh it once
REFRESH MATERIALIZED VIEW component_stats;