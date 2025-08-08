import type { PaginationState } from '@/lib/types'

export interface PaginationControlsProps {
  pagination: PaginationState
}

export type PageNumber = number | string