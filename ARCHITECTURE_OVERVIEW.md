### Project Architecture Overview

This document explains how the app is structured and how data flows from the server to the UI.

## Tech Stack

- **Next.js 15 (App Router)** with React 19
- **TypeScript**
- **Tailwind CSS** and **Shadcn UI** (Radix under the hood)
- **Supabase** (Database + RPC + Auth-ready client)

## High-Level Flow

- Server renders `/shops` using a React Server Component page.
- The page fetches the first page of shops from the database on the server.
- A client wrapper asks the browser for the user’s geolocation.
- The main client list switches to distance-based fetching when a location is available; otherwise it falls back to alphabetical sorting.

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
  searchParams: Promise<{ page?: string }>
}

export default async function ShopsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const initialData = await getShops(page)

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

3. Client List decides how to fetch and renders UI states:

```startLine:37:endLine:114:src/components/shop-list-client/index.tsx
useEffect(() => {
  const fetchData = async () => {
    if (isGeoLocationPending || isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      let result: ShopListData
      if (userLocation) {
        result = await getShopsNearLocationClient(userLocation, page)
      } else {
        result = await getShopsClient(page)
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
}, [userLocation, page, isGeoLocationPending])
```

## Data Fetching

- Server-side (alphabetical): `getShops(page)` uses `fetchShops` to query `fried_chicken_shops`, ordered by `business_name`, with total count and pagination.
- Client-side (distance): `getShopsNearLocationClient(userLocation, page)` calls RPC `get_shops_with_distance` (PostGIS). If RPC fails or PostGIS isn’t enabled, it falls back to the basic alphabetical query.

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

## Error Handling

- Geolocation errors are mapped to friendly messages and do not block alphabetical browsing.
- Data fetch errors are surfaced in the client with a helpful error message and a graceful UI state.
