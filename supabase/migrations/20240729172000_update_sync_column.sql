ALTER TABLE "public"."fried_chicken_shops"
  RENAME COLUMN "synced_at" TO "last_seen_at";

ALTER TABLE "public"."fried_chicken_shops"
  ALTER COLUMN "last_seen_at" DROP DEFAULT; 