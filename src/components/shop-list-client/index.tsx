'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShopCard } from '../shop-list-card'
import { PaginationControls } from '../pagination-controls'
import { ShopListSkeleton } from '../shop-list-skeleton'
import { getShopsNearLocationClient } from '@/lib/shops-api-client'
import { formatErrorMessage, isGeolocationPending } from './helpers'
import { ERROR_MESSAGES } from './constants'
import type { ShopListClientProps } from './types'
import { ShopListData } from '@/lib/types'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { ShopsSearch } from '@/components/shops-search'
import { supabase } from '@/lib/supabase'
import { fetchShops } from '@/lib/api-helpers'

// Custom hook for debounced URL updates
function useUrlUpdate(query: string, delay: number = 500) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    // Update query parameter
    if (query.trim() === '') {
      params.delete('q')
    } else {
      params.set('q', query.trim())
    }

    // Reset pagination on new search
    params.delete('page')

    // Update URL without navigation
    const newUrl = `${pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }`
    router.replace(newUrl, { scroll: false })
  }, [query, pathname, searchParams, router, delay])
}

// Custom hook for debounced search query
function useDebouncedQuery(query: string, delay: number = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [query, delay])

  return debouncedQuery
}

export function ShopListClient({
  initialData,
  page,
  userLocation,
  isLocationLoading,
  locationError
}: ShopListClientProps) {
  const [data, setData] = useState<ShopListData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useUrlUpdate(query)

  // Debounced query for API calls (500ms for better UX)
  const debouncedQuery = useDebouncedQuery(query, 500)

  // Determine if geolocation is still determining location status
  const isGeoLocationPending = isGeolocationPending(
    isLocationLoading,
    userLocation,
    locationError,
    hasInitiallyLoaded
  )

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    // Don't fetch data while geolocation is still determining location status
    if (isGeoLocationPending || isLoadingRef.current) return

    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      let result: ShopListData

      // Use distance sorting when user location is available (for both search and no search)
      if (userLocation) {
        result = await getShopsNearLocationClient(
          userLocation,
          page,
          debouncedQuery
        )
        console.log('result', result)
      } else {
        result = await fetchShops(supabase, page, debouncedQuery)
      }

      setData(result)
      setHasInitiallyLoaded(true)
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [userLocation, page, isGeoLocationPending, debouncedQuery])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='space-y-6'>
      <ShopsSearch value={query} onChange={setQuery} />

      {error ? (
        <div className='text-center py-12'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-8'>
            <p className='text-red-600 text-lg mb-2'>
              {ERROR_MESSAGES.FAILED_TO_LOAD}
            </p>
            <p className='text-red-500 text-sm'>{error}</p>
          </div>
        </div>
      ) : isGeoLocationPending || isLoading ? (
        <ShopListSkeleton />
      ) : data.shops.length === 0 ? (
        <div className='text-center py-12'>
          <div className='bg-gray-50 rounded-lg p-8'>
            <p className='text-gray-500 text-lg'>
              {ERROR_MESSAGES.NO_SHOPS_FOUND}
            </p>
            <p className='text-gray-400 text-sm mt-2'>
              {ERROR_MESSAGES.TRY_AGAIN}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className='space-y-4'>
            {data.shops.map((shop) => (
              <ShopCard key={shop.fhrs_id} shop={shop} />
            ))}
          </div>

          <PaginationControls pagination={data.pagination} />
        </>
      )}
    </div>
  )
}
