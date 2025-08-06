import { Suspense } from 'react'
import { ShopListServer } from './components/shop-list-server'
import { ShopListSkeleton } from './components/shop-list-skeleton'

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function ShopsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Fried Chicken Shops
        </h1>
        <p className='text-gray-600'>
          Browse through our collection of fried chicken establishments
        </p>
      </div>

      <Suspense fallback={<ShopListSkeleton />}>
        <ShopListServer page={page} />
      </Suspense>
    </div>
  )
}
