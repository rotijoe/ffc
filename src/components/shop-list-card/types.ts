export type ShopCardProps = {
    shop: {
      fhrs_id: number
      business_name: string | null
      address: string | null
      postcode: string | null
      latitude?: number | null
      longitude?: number | null
      distance_miles?: number
    }
  }