-- Add a computed column for full-text search
ALTER TABLE fried_chicken_shops 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(business_name, '') || ' ' || 
    coalesce(address, '') || ' ' || 
    coalesce(postcode, '')
  )
) STORED;

-- Create an index for fast searching
CREATE INDEX fried_chicken_shops_search_idx ON fried_chicken_shops USING GIN (search_vector);
