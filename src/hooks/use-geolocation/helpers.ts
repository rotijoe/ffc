import { GEOLOCATION_ERROR_MESSAGES } from './constants'

/**
 * Checks if geolocation is supported by the browser
 */
export const isGeolocationSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

/**
 * Maps geolocation error codes to user-friendly messages
 */
export const getGeolocationErrorMessage = (errorCode: number): string => {
  switch (errorCode) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return GEOLOCATION_ERROR_MESSAGES.POSITION_UNAVAILABLE
    case GeolocationPositionError.TIMEOUT:
      return GEOLOCATION_ERROR_MESSAGES.TIMEOUT
    default:
      return GEOLOCATION_ERROR_MESSAGES.UNKNOWN
  }
}

/**
 * Creates a geolocation error object
 */
export const createGeolocationError = (code: number, message?: string) => {
  return {
    code,
    message: message || getGeolocationErrorMessage(code)
  }
}

/**
 * Extracts location data from GeolocationPosition
 */
export const extractLocationFromPosition = (position: GeolocationPosition) => {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  }
}

/**
 * Wraps navigator.geolocation.getCurrentPosition in a Promise
 */
export const getCurrentPositionAsPromise = (options?: PositionOptions) => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}