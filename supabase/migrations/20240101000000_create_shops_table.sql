create table fried_chicken_shops (
  fhrs_id           bigint primary key,
  business_name     text,
  rating_value      text,
  rating_key        text,
  business_type     text,
  address           text,
  postcode          text,
  latitude          numeric,
  longitude         numeric,
  synced_at         timestamptz default now()
); 