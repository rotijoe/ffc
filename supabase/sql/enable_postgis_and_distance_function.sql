-- Enable PostGIS extension for geographic data handling
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create a function to get shops with distance calculation
-- This function calculates distance from user location and returns paginated results
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

-- Create a spatial index on the latitude/longitude columns for better performance
-- Note: This assumes your fried_chicken_shops table has latitude and longitude columns
-- If you want to use a proper geography column, you would need to alter the table structure

-- Optional: Create a geography column and populate it (more efficient for spatial queries)
-- Uncomment the lines below if you want to add a proper geography column:

-- ALTER TABLE fried_chicken_shops ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- UPDATE fried_chicken_shops 
-- SET location = ST_Point(longitude, latitude)::geography 
-- WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- CREATE INDEX IF NOT EXISTS idx_fried_chicken_shops_location ON fried_chicken_shops USING GIST (location);

-- Alternative function using the geography column (more efficient):
-- CREATE OR REPLACE FUNCTION get_shops_with_distance_geo(
--     user_lat FLOAT,
--     user_lng FLOAT,
--     page_offset INT DEFAULT 0,
--     page_limit INT DEFAULT 10
-- )
-- RETURNS TABLE (
--     fhrs_id BIGINT,
--     business_name TEXT,
--     address TEXT,
--     latitude NUMERIC,
--     longitude NUMERIC,
--     distance_miles FLOAT,
--     total_count BIGINT
-- ) AS $$
-- BEGIN
--     RETURN QUERY
--     WITH shops_with_distance AS (
--         SELECT 
--             s.fhrs_id,
--             s.business_name,
--             s.address,
--             s.latitude,
--             s.longitude,
--             ST_Distance(s.location, ST_Point(user_lng, user_lat)::geography) / 1609.344 AS dist_miles
--         FROM fried_chicken_shops s
--         WHERE s.location IS NOT NULL
--     ),
--     total_count_cte AS (
--         SELECT COUNT(*) as total_count FROM shops_with_distance
--     )
--     SELECT 
--         swd.fhrs_id,
--         swd.business_name,
--         swd.address,
--         swd.latitude,
--         swd.longitude,
--         swd.dist_miles,
--         tc.total_count
--     FROM shops_with_distance swd
--     CROSS JOIN total_count_cte tc
--     ORDER BY swd.dist_miles ASC
--     LIMIT page_limit
--     OFFSET page_offset;
-- END;
-- $$ LANGUAGE plpgsql;