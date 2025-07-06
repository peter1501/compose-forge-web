-- Migration to merge imports field into code field
-- This updates existing components to include imports in the code field

-- First drop the view that depends on the imports column
DROP VIEW IF EXISTS compose_components_with_stats;

-- Update existing components to merge imports into code
UPDATE compose_components
SET code = CASE 
    WHEN imports IS NOT NULL AND imports != '' THEN 
        imports || E'\n\n' || code
    ELSE 
        code
END
WHERE imports IS NOT NULL AND imports != '';

-- Now we can drop the imports column
ALTER TABLE compose_components DROP COLUMN imports;

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
    c.view_count,
    c.download_count,
    c.min_sdk_version,
    c.compose_version,
    COUNT(DISTINCT f.user_id) as favorite_count,
    CASE WHEN auth.uid() IS NOT NULL 
         THEN EXISTS(SELECT 1 FROM compose_favorites WHERE user_id = auth.uid() AND compose_component_id = c.id)
         ELSE false 
    END as is_favorited
FROM compose_components c
LEFT JOIN compose_favorites f ON c.id = f.compose_component_id
GROUP BY c.id;

-- Grant permissions on the updated view
GRANT SELECT ON compose_components_with_stats TO authenticated;
GRANT SELECT ON compose_components_with_stats TO anon;