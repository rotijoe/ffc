import type { PaginationState } from '@/lib/types'
import type { PageNumber } from './types'

export function buildNavigationUrl(searchParams: URLSearchParams, page: number): string {
  const params = new URLSearchParams(searchParams.toString())
  if (page === 1) {
    params.delete('page') // Remove page param for page 1 (cleaner URLs)
  } else {
    params.set('page', page.toString())
  }
  const queryString = params.toString()
  return `/shops${queryString ? `?${queryString}` : ''}`
}

export function calculateDisplayRange(pagination: PaginationState, itemsPerPage: number = 10): {
  start: number
  end: number
  total: number
} {
  const start = (pagination.currentPage - 1) * itemsPerPage + 1
  const end = Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)
  return {
    start,
    end,
    total: pagination.totalCount
  }
}

export function generatePageNumbers(pagination: PaginationState): PageNumber[] {
  const { currentPage, totalPages } = pagination
  const pageNumbers: PageNumber[] = []

  // Show first page
  if (currentPage > 3) {
    pageNumbers.push(1)
    if (currentPage > 4) {
      pageNumbers.push('...')
    }
  }

  // Show pages around current page
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pageNumbers.push(i)
  }

  // Show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      pageNumbers.push('...')
    }
    pageNumbers.push(totalPages)
  }

  return pageNumbers
}