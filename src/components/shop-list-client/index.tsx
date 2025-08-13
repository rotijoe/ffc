'use client'

import { useState, useEffect, useRef } from 'react'
import { ShopCard } from '../shop-list-card'
import { PaginationControls } from '../pagination-controls'
import { ShopListSkeleton } from '../shop-list-skeleton'
import { getShopsNearLocationClient } from '@/lib/shops-api-client'
import { formatErrorMessage, isGeolocationPending } from './helpers'
import { ERROR_MESSAGES } from './constants'
import type { ShopListClientProps } from './types'
import { ShopListData } from '@/lib/types'
import { usePathname, useSearchParams } from 'next/navigation'
import { ShopsSearch } from '@/components/shops-search'
import { supabase } from '@/lib/supabase'
import { fetchShops } from '@/lib/api-helpers'

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
  const pathname = usePathname()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  // Persist query to URL without causing full rerender
  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim() === '') params.delete('q')
      else params.set('q', query.trim())
      // reset pagination on new search
      params.delete('page')
      const qs = params.toString()
      if (typeof window !== 'undefined') {
        window.history.replaceState(
          null,
          '',
          `${pathname}${qs ? `?${qs}` : ''}`
        )
      }
    }, 300)
    return () => clearTimeout(id)
  }, [query, pathname, searchParams])

  // Determine if geolocation is still determining location status
  const isGeoLocationPending = isGeolocationPending(
    isLocationLoading,
    userLocation,
    locationError,
    hasInitiallyLoaded
  )

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch data while geolocation is still determining location status
      if (isGeoLocationPending || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        let result: ShopListData

        // Automatically sort by distance if user location is available and no search query
        if (userLocation && query === '') {
          result = await getShopsNearLocationClient(userLocation, page, query)
        } else {
          result = await fetchShops(supabase, page, query)
        }

        setData(result)
        setHasInitiallyLoaded(true)
      } catch (err) {
        setError(formatErrorMessage(err))
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userLocation, page, isGeoLocationPending, query])

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
