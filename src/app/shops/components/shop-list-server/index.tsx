import { getShops, formatAddress, formatBusinessName } from '@/lib/shops-api'
import { ShopCard } from './shop-card'
import { PaginationControls } from './pagination-controls'

type Props = {
  page: number
}

export async function ShopListServer({ page }: Props) {
  try {
    const { shops, pagination } = await getShops(page)

    if (shops.length === 0) {
      return (
        <div className='text-center py-12'>
          <div className='bg-gray-50 rounded-lg p-8'>
            <p className='text-gray-500 text-lg'>
              No fried chicken shops found.
            </p>
            <p className='text-gray-400 text-sm mt-2'>
              Try adjusting your search or check back later.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className='space-y-6'>
        <div className='space-y-4'>
          {shops.map((shop) => (
            <ShopCard key={shop.fhrs_id} shop={shop} />
          ))}
        </div>

        <PaginationControls pagination={pagination} />
      </div>
    )
  } catch (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8'>
          <p className='text-red-600 text-lg mb-2'>Failed to load shops</p>
          <p className='text-red-500 text-sm'>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    )
  }
}
