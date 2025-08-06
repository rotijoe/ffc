'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserLocation, GeolocationError } from '@/lib/supabase'

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

interface UseGeolocationReturn {
  location: UserLocation | null
  error: GeolocationError | null
  isLoading: boolean
  isSupported: boolean
  getCurrentLocation: () => void
  clearError: () => void
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000 // 5 minutes
  } = options

  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!isSupported) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      })
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setIsLoading(false)
      },
      (err) => {
        let message: string
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location access denied by user'
            break
          case err.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable'
            break
          case err.TIMEOUT:
            message = 'Location request timed out'
            break
          default:
            message = 'An unknown error occurred while retrieving location'
            break
        }

        setError({
          code: err.code,
          message
        })
        setIsLoading(false)
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )
  }, [isSupported, enableHighAccuracy, timeout, maximumAge])

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
    getCurrentLocation,
    clearError
  }
}