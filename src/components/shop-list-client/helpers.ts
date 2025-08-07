export function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

export function isGeolocationPending(
  isLocationLoading: boolean,
  userLocation: any,
  locationError: any,
  hasInitiallyLoaded: boolean
): boolean {
  return (
    isLocationLoading ||
    (!userLocation && !locationError && !hasInitiallyLoaded)
  )
}