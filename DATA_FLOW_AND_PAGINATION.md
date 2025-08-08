### Data Flow & Pagination

This guide explains how data is fetched, transformed, and rendered, and how pagination is implemented.

## Data Sources

- `public.fried_chicken_shops` table
- Optional RPC `get_shops_with_distance` for distance sorting

## Fetching Helpers

Alphabetical query (server or client) uses `fetchShops`:

```startLine:17:endLine:49:src/lib/api-helpers.ts
export async function fetchShops(
  supabase: SupabaseClient<Database>,
  page: number,
): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('fried_chicken_shops')
    .select('fhrs_id, business_name, address, postcode, latitude, longitude', { count: 'exact' })
    .order('business_name', { ascending: true })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch shops: ${error.message}`)
  }

  const totalCount = count || 0
  const pagination = calculatePagination(totalCount, page)

  return {
    shops: (data || []).map((row) => ({
      fhrs_id: row.fhrs_id,
      business_name: row.business_name,
      address: row.address,
      postcode: row.postcode,
      latitude: row.latitude,
      longitude: row.longitude,
    })),
    pagination,
  }
}
```

Distance query (client) uses RPC and maps results including `distance_miles`:

```startLine:21:endLine:56:src/lib/shops-api-client.ts
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

  if (error) {
    // Fallback to basic query without distance calculation
    return getShopsClient(page)
  }

  const rows = (data || []) as GetShopsWithDistanceRow[]
  const totalCount = rows.length > 0 ? rows[0].total_count || 0 : 0
  const pagination = calculatePagination(totalCount, page)

  return {
    shops: rows.map((row) => ({
      fhrs_id: row.fhrs_id,
      business_name: row.business_name,
      address: row.address,
      postcode: row.postcode,
      latitude: row.latitude,
      longitude: row.longitude,
      distance_miles: row.distance_miles,
    } satisfies ShopWithDistance)),
    pagination,
  }
} catch (err) {
  return getShopsClient(page)
}
```

## Pagination

- Page size: `src/lib/constants.ts` `ITEMS_PER_PAGE`
- Calculation: `calculatePagination(totalCount, currentPage)`
- UI: `PaginationControls` builds clean URLs, shows ranges and buttons.

Display range helper:

```startLine:15:endLine:27:src/components/pagination-controls/helpers.ts
export function calculateDisplayRange(pagination: PaginationState, itemsPerPage: number = 10): {
  start: number
  end: number
  total: number
} {
  const start = (pagination.currentPage - 1) * itemsPerPage + 1
  const end = Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)
  return {
    start,
    end,
    total: pagination.totalCount
  }
}
```

## UI Rendering

- `ShopListClient` orchestrates loading, geolocation pending state, errors, and list rendering.
- `ShopCard` shows distance when available:

```startLine:10:endLine:19:src/components/shop-list-card/index.tsx
  <h3 className='text-lg font-semibold text-gray-900'>
    {formatBusinessName(shop.business_name)}
  </h3>
  {shop.distance_miles && (
    <div className='flex items-center text-sm text-blue-600 font-medium'>
      <MapPin className='w-4 h-4 mr-1' />
      {formatDistance(shop.distance_miles)}
    </div>
  )}
```
