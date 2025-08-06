import { Card, CardContent } from '@/components/ui/card'
import {
  formatAddress,
  formatBusinessName,
  formatDistance
} from '@/lib/shops-api'
import { MapPin } from 'lucide-react'

type Props = {
  shop: {
    fhrs_id: number
    business_name: string | null
    address: string | null
    latitude?: number | null
    longitude?: number | null
    distance_miles?: number
  }
}

export function ShopCard({ shop }: Props) {
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
        <p className='text-gray-600'>{formatAddress(shop.address)}</p>
      </CardContent>
    </Card>
  )
}
