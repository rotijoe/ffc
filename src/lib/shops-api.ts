import { supabaseServer } from './supabase-server'
import { cache } from 'react'

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
    business_name: string
    address: string
    postcode: string
    latitude?: number
    longitude?: number
    distance_miles?: number
  }>
  pagination: PaginationState
}

// Cache the function to avoid duplicate requests during the same render
export const getShops = cache(async (page: number = 1): Promise<ShopListData> => {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabaseServer
    .from('fried_chicken_shops')
    .select('fhrs_id, business_name, address, postcode', { count: 'exact' })
    .order('business_name', { ascending: true })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch shops: ${error.message}`)
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  console.log(data)
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
})
