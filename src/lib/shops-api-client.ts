import { supabase } from './supabase'
import type { Database } from './database.types'
import { ITEMS_PER_PAGE } from './constants'
import { calculatePagination, fetchShops } from './api-helpers'
import type { ShopListData, UserLocation, ShopWithDistance } from './types'

type GetShopsWithDistanceRow =
  Database['public']['Functions']['get_shops_with_distance']['Returns'][number]

export function getShopsClient(page: number = 1): Promise<ShopListData> {
  return fetchShops(supabase, page)
}

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

    if (error) {
      console.warn(
        'PostGIS function not available, falling back to basic query:',
        error.message,
      )
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
    console.warn('Distance query failed, falling back to basic query:', err)
    // Fallback to basic query
    return getShopsClient(page)
  }
}
