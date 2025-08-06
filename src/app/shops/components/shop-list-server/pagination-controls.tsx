'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationState } from '@/lib/shops-api'

type Props = {
  pagination: PaginationState
}

export function PaginationControls({ pagination }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page') // Remove page param for page 1 (cleaner URLs)
    } else {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    router.push(`/shops${queryString ? `?${queryString}` : ''}`)
  }

  if (pagination.totalPages <= 1) return null

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-gray-500'>
        Showing {(pagination.currentPage - 1) * 10 + 1} to{' '}
        {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{' '}
        {pagination.totalCount} results
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          Previous
        </Button>

        <div className='flex items-center space-x-1'>{renderPageNumbers()}</div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </div>
    </div>
  )

  function renderPageNumbers() {
    const { currentPage, totalPages } = pagination
    const pageNumbers = []

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

    return pageNumbers.map((pageNum, index) => {
      if (pageNum === '...') {
        return (
          <span key={`ellipsis-${index}`} className='px-3 py-1 text-gray-500'>
            ...
          </span>
        )
      }

      return (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => navigateToPage(pageNum as number)}
        >
          {pageNum}
        </Button>
      )
    })
  }
}
