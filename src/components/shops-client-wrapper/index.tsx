'use client'

import { useGeolocation } from '@/hooks/use-geolocation'
import { ShopListClient } from '../shop-list-client'
import type { ShopsClientWrapperProps } from './types'

export function ShopsClientWrapper({
  initialData,
  initialPage
}: ShopsClientWrapperProps) {
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError
  } = useGeolocation()

  return (
    <ShopListClient
      initialData={initialData}
      page={initialPage}
      userLocation={location}
      isLocationLoading={isLocationLoading}
      locationError={locationError}
    />
  )
}
