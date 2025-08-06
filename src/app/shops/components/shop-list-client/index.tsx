'use client'

import { useState, useEffect, useRef } from 'react'
import { ShopCard } from '../shop-list-server/shop-card'
import { PaginationControls } from '../shop-list-server/pagination-controls'
import { ShopListSkeleton } from '../shop-list-skeleton'
import {
  getShopsClient,
  getShopsNearLocationClient,
  type ShopListData
} from '@/lib/shops-api-client'

interface UserLocation {
  latitude: number
  longitude: number
}

interface GeolocationError {
  code: number
  message: string
}

interface ShopListClientProps {
  initialData: ShopListData
  page: number
  userLocation: UserLocation | null
  isLocationLoading: boolean
  locationError: GeolocationError | null
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

  // Determine if geolocation is still determining location status
  const isGeolocationPending =
    isLocationLoading ||
    (!userLocation && !locationError && !hasInitiallyLoaded)

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch data while geolocation is still determining location status
      if (isGeolocationPending || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        let result: ShopListData

        // Automatically sort by distance if user location is available
        if (userLocation) {
          result = await getShopsNearLocationClient(userLocation, page)
        } else {
          result = await getShopsClient(page)
        }

        setData(result)
        setHasInitiallyLoaded(true)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        )
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userLocation, page, isGeolocationPending])

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8'>
          <p className='text-red-600 text-lg mb-2'>Failed to load shops</p>
          <p className='text-red-500 text-sm'>{error}</p>
        </div>
      </div>
    )
  }

  // Show loading while geolocation is determining location status or while fetching data
  if (isGeolocationPending || isLoading) {
    return <ShopListSkeleton />
  }

  if (data.shops.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='bg-gray-50 rounded-lg p-8'>
          <p className='text-gray-500 text-lg'>No fried chicken shops found.</p>
          <p className='text-gray-400 text-sm mt-2'>
            Try adjusting your search or check back later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {data.shops.map((shop) => (
          <ShopCard key={shop.fhrs_id} shop={shop} />
        ))}
      </div>

      <PaginationControls pagination={data.pagination} />
    </div>
  )
}
