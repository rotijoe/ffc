import { GeolocationError, UserLocation } from "@/lib/supabase"
  
export interface UseGeolocationReturn {
    location: UserLocation | null
    error: GeolocationError | null
    isLoading: boolean
    isSupported: boolean
}
