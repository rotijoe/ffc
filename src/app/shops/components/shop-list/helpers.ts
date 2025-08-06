import { supabase } from '@/lib/supabase'
import { ITEMS_PER_PAGE } from './constants'
import type { FriedChickenShop, PaginationState } from './types'

export async function fetchShops(page: number) {
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('fried_chicken_shops')
    .select('fhrs_id, business_name, address', { count: 'exact' })
    .order('business_name', { ascending: true })
    .range(from, to)

  if (error) {
    throw new Error(`Failed to fetch shops: ${error.message}`)
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const paginationState: PaginationState = {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }

  return {
    shops: data as FriedChickenShop[],
    pagination: paginationState
  }
}

export function formatAddress(address: string | null): string {
  if (!address) return 'Address not available'
  return address.trim()
}

export function formatBusinessName(name: string | null): string {
  if (!name) return 'Name not available'
  return name.trim()
}