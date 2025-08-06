import { Card, CardContent } from '@/components/ui/card'
import { formatAddress, formatBusinessName } from '@/lib/shops-api'

type Props = {
  shop: {
    fhrs_id: number
    business_name: string | null
    address: string | null
  }
}

export function ShopCard({ shop }: Props) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {formatBusinessName(shop.business_name)}
        </h3>
        <p className='text-gray-600'>{formatAddress(shop.address)}</p>
      </CardContent>
    </Card>
  )
}
