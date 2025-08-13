import type { ShopListData } from '@/lib/types'

export interface UserLocation {
  latitude: number
  longitude: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface ShopListClientProps {
  initialData: ShopListData
  page: number
  initialQuery?: string
  userLocation: UserLocation | null
  isLocationLoading: boolean
  locationError: GeolocationError | null
}