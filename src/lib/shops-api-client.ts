import { supabase } from './supabase'
import type { UserLocation } from './supabase'

const ITEMS_PER_PAGE = 10

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ShopListData {
  shops: Array<{
    fhrs_id: number
    business_name: string | null
    address: string | null
    postcode: string | null
    latitude?: number | null
    longitude?: number | null
    distance_miles?: number
  }>
  pagination: PaginationState
}

// Client-side function to get shops without location
export async function getShopsClient(page: number = 1): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('fried_chicken_shops')
    .select('fhrs_id, business_name, address, postcode', { count: 'exact' })
    .order('business_name', { ascending: true })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch shops: ${error.message}`)
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  return {
    shops: data || [],
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}

// Client-side function to get shops sorted by distance from user location
export async function getShopsNearLocationClient(
  userLocation: UserLocation,
  page: number = 1
): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE

  try {
    const { data, error } = await supabase
      .rpc('get_shops_with_distance', {
        user_lat: userLocation.latitude,
        user_lng: userLocation.longitude,
        page_offset: from,
        page_limit: ITEMS_PER_PAGE
      })

    if (error) {
      console.warn('PostGIS function not available, falling back to basic query:', error.message)
      // Fallback to basic query without distance calculation
      return getShopsClient(page)
    }

    const totalCount = data?.length > 0 ? data[0].total_count || 0 : 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    return {
      shops: data?.map((shop: any) => ({
        fhrs_id: shop.fhrs_id,
        business_name: shop.business_name,
        address: shop.address,
        postcode: shop.postcode,
        latitude: shop.latitude,
        longitude: shop.longitude,
        distance_miles: shop.distance_miles
      })) || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  } catch (err) {
    console.warn('Distance query failed, falling back to basic query:', err)
    // Fallback to basic query
    return getShopsClient(page)
  }
}
