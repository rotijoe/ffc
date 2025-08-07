import { Card, CardContent } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { formatAddress, formatBusinessName, formatDistance } from './helpers'
import type { ShopCardProps } from './types'

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {formatBusinessName(shop.business_name)}
          </h3>
          {shop.distance_miles && (
            <div className='flex items-center text-sm text-blue-600 font-medium'>
              <MapPin className='w-4 h-4 mr-1' />
              {formatDistance(shop.distance_miles)}
            </div>
          )}
        </div>
        <p className='text-gray-600'>
          {formatAddress(shop.address, shop.postcode)}
        </p>
      </CardContent>
    </Card>
  )
}
