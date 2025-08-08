import { supabase } from './supabase'
import { ITEMS_PER_PAGE } from './constants'
import { calculatePagination, fetchShops } from './api-helpers'
import type {
  ShopListData,
  UserLocation,
  ShopWithDistance,
} from './types'

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

    const totalCount = data?.length > 0 ? data[0].total_count || 0 : 0
    const pagination = calculatePagination(totalCount, page)

    return {
      shops:
        data?.map(
          (shop: ShopWithDistance) => ({
            ...shop,
          }),
        ) || [],
      pagination,
    }
  } catch (err) {
    console.warn('Distance query failed, falling back to basic query:', err)
    // Fallback to basic query
    return getShopsClient(page)
  }
}
