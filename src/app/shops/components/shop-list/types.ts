export interface FriedChickenShop {
  fhrs_id: number
  business_name: string | null
  address: string | null
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}