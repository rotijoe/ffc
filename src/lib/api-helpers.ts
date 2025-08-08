import type { SupabaseClient } from '@supabase/supabase-js'
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
  supabase: SupabaseClient,
  page: number,
): Promise<ShopListData> {
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
  const pagination = calculatePagination(totalCount, page)

  return {
    shops: data || [],
    pagination,
  }
}
