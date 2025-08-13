### Project Architecture Overview

This document explains how the app is structured and how data flows from the server to the UI.

## Tech Stack

- **Next.js 15 (App Router)** with React 19
- **TypeScript**
- **Tailwind CSS** and **Shadcn UI** (Radix under the hood)
- **Supabase** (Database + RPC + Auth-ready client)

## High-Level Flow

- Server renders `/shops` using a React Server Component page.
- The page fetches the first page of shops from the database on the server, optionally filtered by a `q` query string.
- A client wrapper asks the browser for the user’s geolocation.
- The main client list:
  - Debounced client-side search that uses PostgreSQL full-text search across business_name, address, and postcode
  - Updates the URL’s `?q=` using `history.replaceState` (no navigation/remount)
  - Uses distance-based results only when no `q` is present, otherwise alphabetical filtered results with full-text search

## Key Files

- Page entry (server): `src/app/shops/page.tsx`
- Server API: `src/lib/shops-api.ts`
- Client API: `src/lib/shops-api-client.ts`
- Supabase clients: `src/lib/supabase.ts` (browser) and `src/lib/supabase-server.ts` (server)
- Shared helpers: `src/lib/api-helpers.ts`
- Domain types: `src/lib/types.ts` (hand-authored), `src/lib/database.types.ts` (generated)
- Geolocation hook: `src/hooks/use-geolocation/`
- UI Components: `src/components/*`

## Page Composition

1. Server Page fetches initial data and renders the client wrapper:

```startLine:1:endLine:20:src/app/shops/page.tsx
import { getShops } from '@/lib/shops-api'
import { ShopsClientWrapper } from '@/components/shops-client-wrapper'

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function ShopsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const query = params.q || undefined

  const initialData = await getShops(page, query)

  return (
    <div className='container mx-auto px-4 py-8'>
      <ShopsClientWrapper initialData={initialData} initialPage={page} />
    </div>
  )
}
```

2. Client Wrapper wires geolocation state into the list:

```startLine:1:endLine:27:src/components/shops-client-wrapper/index.tsx
'use client'

import { useGeolocation } from '@/hooks/use-geolocation'
import { ShopListClient } from '../shop-list-client'
import type { ShopsClientWrapperProps } from './types'

export function ShopsClientWrapper({
  initialData,
  initialPage
}: ShopsClientWrapperProps) {
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError
  } = useGeolocation()

  return (
    <ShopListClient
      initialData={initialData}
      page={initialPage}
      userLocation={location}
      isLocationLoading={isLocationLoading}
      locationError={locationError}
    />
  )
}
```

3. Client List orchestrates search, geolocation, and states:

```startLine:33:endLine:87:src/components/shop-list-client/index.tsx
const [query, setQuery] = useState(searchParams.get('q') || '')

// Persist query to URL without navigation/remount
useEffect(() => {
  const id = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim() === '') params.delete('q')
    else params.set('q', query.trim())
    // reset pagination on new search
    params.delete('page')
    const qs = params.toString()
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${pathname}${qs ? `?${qs}` : ''}`)
    }
  }, 300)
  return () => clearTimeout(id)
}, [query, pathname, searchParams])

useEffect(() => {
  const fetchData = async () => {
    if (isGeoLocationPending || isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      let result: ShopListData

      // Automatically sort by distance if user location is available and no search query
      if (userLocation && query === '') {
        result = await getShopsNearLocationClient(userLocation, page, query)
      } else {
        result = await fetchShops(supabase, page, query)
      }
      setData(result)
      setHasInitiallyLoaded(true)
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }
  fetchData()
}, [userLocation, page, isGeoLocationPending, query])
```

## Data Fetching

- Server-side (alphabetical): `getShops(page, query?)` uses `fetchShops` to query `fried_chicken_shops`, ordered by `business_name`, with total count and pagination. When `query` is present, it uses PostgreSQL full-text search via `textSearch('search_vector', query)` across `business_name`, `address`, and `postcode`.
- Client-side (distance): `getShopsNearLocationClient(userLocation, page, query?)` calls RPC `get_shops_with_distance`. Distance mode is used only when no `query` is present; otherwise we fetch alphabetical filtered results.

## Pagination

- Page size is defined in `src/lib/constants.ts` and mirrored in UI helpers.
- Pagination state is derived via `calculatePagination(totalCount, page)` and rendered with `PaginationControls`.

## Geolocation

- `useGeolocation` requests the user’s position on mount and exposes `{ location, isLoading, error, isSupported }`.
- The list shows a skeleton while geolocation status is pending and switches to distance results when a valid location exists.

## Components

- `ShopCard`: displays name, address, and (if available) distance.
- `PaginationControls`: builds clean URLs and shows page numbers/ellipsis based on total pages.
- `ShopListSkeleton`: consistent skeletons for list and pagination while loading.
- `ShopsSearch`: controlled search input that updates `?q=` without navigation.

## Error Handling

- Geolocation errors are mapped to friendly messages and do not block alphabetical browsing.
- Data fetch errors are surfaced in the client with a helpful error message and a graceful UI state.
