import { supabaseServer } from './supabase-server'
import { cache } from 'react'
import { fetchShops } from './api-helpers'
import type { ShopListData } from './types'

export const getShops = cache(
  (page: number = 1): Promise<ShopListData> => {
    return fetchShops(supabaseServer, page)
  },
)
