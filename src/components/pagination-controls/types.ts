import type { PaginationState } from '@/lib/shops-api'

export interface PaginationControlsProps {
  pagination: PaginationState
}

export type PageNumber = number | string