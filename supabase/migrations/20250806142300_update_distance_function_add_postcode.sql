-- Drop the existing function first
DROP FUNCTION IF EXISTS get_shops_with_distance;

-- Create the updated function with postcode
CREATE OR REPLACE FUNCTION get_shops_with_distance(
    user_lat FLOAT,
    user_lng FLOAT,
    page_offset INT DEFAULT 0,
    page_limit INT DEFAULT 10
)
RETURNS TABLE (
    fhrs_id BIGINT,
    business_name TEXT,
    address TEXT,
    postcode TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    distance_miles FLOAT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH shops_with_distance AS (
        SELECT 
            s.fhrs_id,
            s.business_name,
            s.address,
            s.postcode,
            s.latitude,
            s.longitude,
            -- Calculate distance in miles using PostGIS
            ST_Distance(
                ST_Point(s.longitude::float, s.latitude::float)::geography,
                ST_Point(user_lng, user_lat)::geography
            ) / 1609.344 AS dist_miles
        FROM fried_chicken_shops s
        WHERE s.latitude IS NOT NULL 
          AND s.longitude IS NOT NULL
          AND s.latitude != 0 
          AND s.longitude != 0
    ),
    total_count_cte AS (
        SELECT COUNT(*) as total_count FROM shops_with_distance
    )
    SELECT 
        swd.fhrs_id,
        swd.business_name,
        swd.address,
        swd.postcode,
        swd.latitude,
        swd.longitude,
        swd.dist_miles,
        tc.total_count
    FROM shops_with_distance swd
    CROSS JOIN total_count_cte tc
    ORDER BY swd.dist_miles ASC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;