'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  buildNavigationUrl,
  calculateDisplayRange,
  generatePageNumbers
} from './helpers'
import { PAGINATION_CONFIG, BUTTON_TEXT } from './constants'
import type { PaginationControlsProps } from './types'

export function PaginationControls({ pagination }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const url = buildNavigationUrl(searchParams, page)
    router.push(url)
  }

  if (pagination.totalPages <= 1) return null

  const displayRange = calculateDisplayRange(
    pagination,
    PAGINATION_CONFIG.ITEMS_PER_PAGE
  )

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-gray-500'>
        Showing {displayRange.start} to {displayRange.end} of{' '}
        {displayRange.total} results
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          {BUTTON_TEXT.PREVIOUS}
        </Button>

        <div className='flex items-center space-x-1'>{renderPageNumbers()}</div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => navigateToPage(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          {BUTTON_TEXT.NEXT}
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </div>
    </div>
  )

  function renderPageNumbers() {
    const { currentPage } = pagination
    const pageNumbers = generatePageNumbers(pagination)

    return pageNumbers.map((pageNum, index) => {
      if (pageNum === BUTTON_TEXT.ELLIPSIS) {
        return (
          <span key={`ellipsis-${index}`} className='px-3 py-1 text-gray-500'>
            {BUTTON_TEXT.ELLIPSIS}
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
