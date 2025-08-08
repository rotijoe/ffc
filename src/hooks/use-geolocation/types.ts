import type { UserLocation } from "@/lib/types"

export interface GeolocationError {
  code: number
  message: string
}
  
export interface UseGeolocationReturn {
    location: UserLocation | null
    error: GeolocationError | null
    isLoading: boolean
    isSupported: boolean
}
