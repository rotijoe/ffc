### Supabase Setup & Types Workflow

This guide covers environment setup, local dev, migrations, RPC usage, and how to keep generated types in sync.

## Environment Variables

Set these in your shell or `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to the browser)
- `SUPABASE_PROJECT_ID` (used by types generation command)

The clients are created in:

- Browser: `src/lib/supabase.ts`
- Server: `src/lib/supabase-server.ts`

## Local Development

If you use the Supabase local stack:

1. Install the CLI and start local services.
2. The code defaults to `http://127.0.0.1:54321` and demo keys for local dev if env vars are missing.
3. Run the app with `npm run dev`.

## SQL: PostGIS & RPC

- Enable PostGIS and create the `get_shops_with_distance` function per `DISTANCE_FEATURE_SETUP.md`.
- The app will gracefully fall back to a basic alphabetical query when PostGIS/RPC isn’t available.

## Generated Database Types

The file `src/lib/database.types.ts` is generated from your database schema and contains:

- Table row/insert/update types (e.g. `public.Tables.fried_chicken_shops`)
- RPC function return types (e.g. `public.Functions.get_shops_with_distance`)

These types are used throughout the app, for example:

```startLine:1:endLine:17:src/lib/types.ts
import type { Database } from './database.types'

type FriedChickenShopRow = Database['public']['Tables']['fried_chicken_shops']['Row']

// Base shop type aligned to your DB schema
export type Shop = Pick<
  FriedChickenShopRow,
  'fhrs_id' | 'business_name' | 'address' | 'postcode' | 'latitude' | 'longitude'
>
```

## How to Update Types When the Database Changes

Whenever you add tables/columns, change RPCs, or run migrations, regenerate types:

- From a hosted project (requires `SUPABASE_PROJECT_ID`):

```bash
npm run db:types
```

- From a local Supabase instance:

```bash
npm run db:types:local
```

This overwrites `src/lib/database.types.ts`. Commit the change.

### Troubleshooting Types

- If TypeScript errors reference outdated table columns or RPC names, your `database.types.ts` is likely stale. Regenerate as above.
- Ensure RPC names and return tuple fields match what your code expects (e.g., `distance_miles`, `total_count`). Update either the SQL or the mapping in `getShopsNearLocationClient` accordingly.

## Migrations

Migrations live in `supabase/migrations/`. Use the Supabase CLI to create/apply them:

```bash
npx supabase migration new add_my_change
npx supabase db push
```

Keep SQL helpers in `supabase/sql/` for re-use via Dashboard or CLI.

## Calling RPC from the Client

```startLine:14:endLine:41:src/lib/shops-api-client.ts
// Client-side function to get shops sorted by distance from user location
export async function getShopsNearLocationClient(
  userLocation: UserLocation,
  page: number = 1,
): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE

  try {
    const { data, error } = await supabase.rpc(
      'get_shops_with_distance',
      {
        user_lat: userLocation.latitude,
        user_lng: userLocation.longitude,
        page_offset: from,
        page_limit: ITEMS_PER_PAGE,
      },
    )
```

If `error` occurs, we fall back to the standard query. This makes the feature optional in non-PostGIS environments.
