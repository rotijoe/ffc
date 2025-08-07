'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserLocation, GeolocationError } from '@/lib/supabase'
import { UseGeolocationReturn } from './types'
import { GEOLOCATION_ERROR_MESSAGES, GEOLOCATION_ERROR_CODES } from './constants'
import { 
  isGeolocationSupported, 
  createGeolocationError, 
  extractLocationFromPosition,
  getCurrentPositionAsPromise
} from './helpers'

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isSupported = isGeolocationSupported()

  const getCurrentLocation = useCallback(async () => {
    if (!isSupported) {
      setError(createGeolocationError(
        GEOLOCATION_ERROR_CODES.NOT_SUPPORTED, 
        GEOLOCATION_ERROR_MESSAGES.NOT_SUPPORTED
      ))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await getCurrentPositionAsPromise({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      })
      setLocation(extractLocationFromPosition(position))
    } catch (err: any) {
      setError(createGeolocationError(err.code))
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  // Auto-fetch location on mount if supported
  useEffect(() => {
    if (isSupported && !location && !error) {
      getCurrentLocation()
    }
  }, [isSupported, location, error, getCurrentLocation])

  return {
    location,
    error,
    isLoading,
    isSupported,
  }
}