export type ShopCardProps = {
    shop: {
      fhrs_id: number
      business_name: string
      address: string
      postcode: string
      latitude?: number
      longitude?: number
      distance_miles?: number
    }
  }