import type { ShopListData } from '@/lib/shops-api-client'

export interface ShopsClientWrapperProps {
  initialData: ShopListData
  initialPage: number
}