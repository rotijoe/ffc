import type { ShopListData } from '@/lib/types'

export interface ShopsClientWrapperProps {
  initialData: ShopListData
  initialPage: number
  initialQuery?: string
}