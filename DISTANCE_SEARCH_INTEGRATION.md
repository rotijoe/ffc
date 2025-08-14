# Distance Search Integration

This document outlines the changes made to integrate distance sorting for search results in the Fried Chicken Finder application.

## Overview

Previously, the application only provided distance-sorted results when users had location shared AND no search query was entered. Search results were always sorted alphabetically. This update enables distance sorting for search results when user location is available.

## Changes Made

### 1. Database Function Enhancement

**New Migration**: `supabase/migrations/20250109000000_add_search_with_distance_function.sql`

Created a new database function `get_shops_with_distance_and_search` that:

- Combines full-text search filtering with distance calculation
- Returns results sorted by distance from user location
- Supports pagination and total count
- Uses PostgreSQL's `plainto_tsquery` for search filtering

```sql
CREATE OR REPLACE FUNCTION get_shops_with_distance_and_search(
    user_lat FLOAT,
    user_lng FLOAT,
    search_query TEXT,
    page_offset INT DEFAULT 0,
    page_limit INT DEFAULT 10
)
```

### 2. Client API Function Update

**File**: `src/lib/shops-api-client.ts`

Enhanced `getShopsNearLocationClient` to:

- Use `get_shops_with_distance_and_search` when both location and search query are present
- Use existing `get_shops_with_distance` when location is available but no search query
- Maintain graceful fallbacks to basic search when distance functions fail
- Handle both scenarios with proper error handling

### 3. Client Logic Update

**File**: `src/components/shop-list-client/index.tsx`

Updated the fetch logic to:

- Always use distance sorting when user location is available (for both search and no search)
- Fall back to alphabetical sorting only when location is unavailable
- Maintain existing debouncing and URL state management

**Before**:

```typescript
if (userLocation && debouncedQuery === '') {
  // Distance sorting only for no search
} else {
  // Alphabetical sorting for search
}
```

**After**:

```typescript
if (userLocation) {
  // Distance sorting for both search and no search
} else {
  // Alphabetical sorting when no location
}
```

### 4. Type Definitions Update

**File**: `src/lib/database.types.ts`

Added TypeScript definitions for the new database function:

```typescript
get_shops_with_distance_and_search: {
  Args: {
    user_lat: number
    user_lng: number
    search_query: string
    page_offset?: number
    page_limit?: number
  }
  Returns: {
    fhrs_id: number
    business_name: string
    address: string
    postcode: string
    latitude: number
    longitude: number
    distance_miles: number
    total_count: number
  }[]
}
```

### 5. Documentation Updates

**Files Updated**:

- `ARCHITECTURE_OVERVIEW.md`: Updated data fetching description
- `DATA_FLOW_AND_PAGINATION.md`: Updated client-side distance query documentation

## Benefits

1. **Enhanced User Experience**: Search results are now sorted by distance when location is available
2. **Backward Compatibility**: Existing functionality remains unchanged
3. **Graceful Fallbacks**: Robust error handling ensures the app continues to work if distance functions fail
4. **Performance**: Single database call for search + distance calculation
5. **Maintainability**: Clear separation of concerns with dedicated database functions

## Usage

The integration is automatic and requires no user action:

1. **With Location + Search**: Results are sorted by distance from user location
2. **With Location + No Search**: Results are sorted by distance from user location (existing behavior)
3. **Without Location + Search**: Results are sorted alphabetically (existing behavior)
4. **Without Location + No Search**: Results are sorted alphabetically (existing behavior)

## Technical Details

### Database Functions

- `get_shops_with_distance`: Original function for distance-only queries
- `get_shops_with_distance_and_search`: New function for search + distance queries
- Both functions use PostGIS for accurate distance calculations
- Both support pagination and return total count for UI

### Error Handling

- If `get_shops_with_distance_and_search` fails, falls back to `fetchShops` (alphabetical search)
- If `get_shops_with_distance` fails, falls back to `fetchShops` (alphabetical listing)
- Comprehensive logging for debugging distance function issues

### Performance Considerations

- PostGIS spatial calculations are optimized with proper indexing
- Full-text search uses existing `search_vector` GIN index
- Pagination limits result set size for optimal performance
