import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { ITEMS_PER_PAGE } from './constants'
import type { ShopListData } from './types'

export function calculatePagination(totalCount: number, currentPage: number) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  return {
    currentPage,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

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

  // Apply full-text search when a search query is provided
  const trimmedQuery = (query || '').trim()
  if (trimmedQuery.length > 0) {
    console.log("🔍 Adding full-text search filter for:", trimmedQuery)
    builder = builder.textSearch('search_vector', trimmedQuery)
  }

  const { data, error, count } = await builder
    .order('business_name', { ascending: true })
    .range(from, to)

  if (error) {
    console.error("❌ Supabase error:", error)
    throw new Error(`Failed to fetch shops: ${error.message}`)
  }

  console.log("✅ Supabase success:", data?.length || 0, "results")
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
