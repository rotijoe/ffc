export interface Shop {
  fhrs_id: number
  business_name: string | null
  address: string | null
  postcode: string | null
  latitude?: number | null
  longitude?: number | null
  distance_miles?: number
}

export type ShopWithDistance = Shop & {
  latitude: number
  longitude: number
  distance_miles: number
}
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
