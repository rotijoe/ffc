import type { Database } from '../types/database.types'

type FriedChickenShopRow = Database['public']['Tables']['fried_chicken_shops']['Row']

// Base shop type aligned to your DB schema
export type Shop = Pick<
  FriedChickenShopRow,
  'fhrs_id' | 'business_name' | 'address' | 'postcode' | 'latitude' | 'longitude'
>

// RPC return row type for distance query
export type GetShopsWithDistanceRow =
  Database['public']['Functions']['get_shops_with_distance']['Returns'][number]

// Shop shape for UI when distance is present
export type ShopWithDistance = Omit<GetShopsWithDistanceRow, 'total_count'>
export interface PaginationState {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ShopListData {
  shops: Shop[]
  pagination: PaginationState
}

export interface UserLocation {
  latitude: number
  longitude: number
}
