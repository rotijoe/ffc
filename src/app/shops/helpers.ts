import { fetchShops } from '@/lib/fetch-shops'
import { supabaseServer } from '@/lib/supabase-server'
import { ShopListData } from '@/lib/types'
import { cache } from 'react'


export const getShops = cache(
    (page: number = 1, query?: string): Promise<ShopListData> => {
      return fetchShops(supabaseServer, page, query)
    },
  )
  