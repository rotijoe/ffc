import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'
import type { ShopListData } from './types'
import { ITEMS_PER_PAGE } from '@/constants/pagination'
import { calculatePagination } from './pagination'

export async function fetchShops(
  supabase: SupabaseClient<Database>,
  page: number,
  query?: string,
): Promise<ShopListData> {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Base query
  let builder = supabase
    .from('fried_chicken_shops')
    .select('fhrs_id, business_name, address, postcode, latitude, longitude', { count: 'exact' })
    .order('business_name', { ascending: true })
    .range(from, to)

  const trimmedQuery = (query || '').trim()
  if (trimmedQuery.length > 0) {
    builder = builder.textSearch('search_vector', trimmedQuery)
  }

  const { data, error, count } = await builder

  if (error) {
    console.error("Supabase error:", error)
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
