'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchShops, formatAddress, formatBusinessName } from './helpers'
import { DEFAULT_PAGE } from './constants'
import type { FriedChickenShop, PaginationState } from './types'

export function ShopList() {
  const [shops, setShops] = useState<FriedChickenShop[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: DEFAULT_PAGE,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadShops = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchShops(page)
      setShops(result.shops)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShops(DEFAULT_PAGE)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadShops(newPage)
    }
  }

  if (loading) {
    return renderLoadingState()
  }

  if (error) {
    return renderErrorState()
  }

  if (shops.length === 0) {
    return renderEmptyState()
  }

  return (
    <div className='space-y-6'>
      {renderShopList()}
      {renderPagination()}
    </div>
  )

  function renderLoadingState() {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='h-6 bg-gray-200 rounded mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  function renderErrorState() {
    return (
      <Card className='border-red-200'>
        <CardContent className='p-6 text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button
            onClick={() => loadShops(pagination.currentPage)}
            variant='outline'
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  function renderEmptyState() {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p className='text-gray-500'>No fried chicken shops found.</p>
        </CardContent>
      </Card>
    )
  }

  function renderShopList() {
    return (
      <div className='space-y-4'>
        {shops.map((shop) => (
          <Card
            key={shop.fhrs_id}
            className='hover:shadow-md transition-shadow'
          >
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {formatBusinessName(shop.business_name)}
              </h3>
              <p className='text-gray-600'>{formatAddress(shop.address)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  function renderPagination() {
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
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            Previous
          </Button>

          <div className='flex items-center space-x-1'>
            {renderPageNumbers()}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
            <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        </div>
      </div>
    )
  }

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
          onClick={() => handlePageChange(pageNum as number)}
        >
          {pageNum}
        </Button>
      )
    })
  }
}
