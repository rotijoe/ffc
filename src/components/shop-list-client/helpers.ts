import { Database } from "@/types/database.types"
import { ShopListData, ShopWithDistance } from "@/lib/types"
import { UserLocation } from "./types"
import { supabase } from "@/lib/supabase"
import { fetchShops } from "@/lib/fetch-shops"
import { ITEMS_PER_PAGE } from "./constants"
import { calculatePagination } from "@/lib/pagination"

export function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

export function isGeolocationPending(
  isLocationLoading: boolean,
  userLocation: any,
  locationError: any,
  hasInitiallyLoaded: boolean
): boolean {
  return (
    isLocationLoading ||
    (!userLocation && !locationError && !hasInitiallyLoaded)
  )
}

type GetShopsWithDistanceRow =
  Database['public']['Functions']['get_shops_with_distance']['Returns'][number]

export async function getShopsNearLocationClient(
  userLocation: UserLocation,
  page: number = 1,
  query?: string,
): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE
  const trimmedQuery = (query || '').trim()

  try {
    let result: ShopListData

    if (trimmedQuery.length > 0) {
      const { data, error } = await supabase.rpc(
        'get_shops_with_distance_and_search',
        {
          user_lat: userLocation.latitude,
          user_lng: userLocation.longitude,
          search_query: trimmedQuery,
          page_offset: from,
          page_limit: ITEMS_PER_PAGE,
        },
      )

      if (error) {
        console.log('getShopsNearLocationClient- error 111', error)
        console.warn(
          'Search + distance function not available, falling back to basic search:',
          error.message,
        )
        // Fallback to basic search without distance
        return fetchShops(supabase, page, trimmedQuery)
      }

      const rows = (data || []) as GetShopsWithDistanceRow[]
      const totalCount = rows.length > 0 ? rows[0].total_count || 0 : 0
      const pagination = calculatePagination(totalCount, page)

      result = {
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
      console.log('getShopsNearLocationClient- result', result)
    } else {
      // Use existing function for distance-only (no search)
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
        console.log('getShopsNearLocationClient- error', error)
        console.warn(
          'Distance function not available, falling back to basic query:',
          error.message,
        )
        return fetchShops(supabase, page)
      }

      const rows = (data || []) as GetShopsWithDistanceRow[]
      const totalCount = rows.length > 0 ? rows[0].total_count || 0 : 0
      const pagination = calculatePagination(totalCount, page)

      result = {
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
      console.log('getShopsNearLocationClient- result 222', result)
    }

    return result
  } catch (err) {
    console.warn('Distance query failed, falling back to basic query:', err)
    console.log('getShopsNearLocationClient- result 333')
    return fetchShops(supabase, page, trimmedQuery)
  }
}
