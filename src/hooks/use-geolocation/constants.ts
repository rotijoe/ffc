// Error messages for different geolocation error codes
export const GEOLOCATION_ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Location access denied by user',
  POSITION_UNAVAILABLE: 'Location information is unavailable',
  TIMEOUT: 'Location request timed out',
  NOT_SUPPORTED: 'Geolocation is not supported by this browser',
  UNKNOWN: 'An unknown error occurred while retrieving location'
} as const

// Geolocation error codes
export const GEOLOCATION_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  NOT_SUPPORTED: 0
} as const