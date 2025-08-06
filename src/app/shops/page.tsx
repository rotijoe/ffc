import { getShops } from '@/lib/shops-api'
import { ShopsClientWrapper } from './components/shops-client-wrapper'

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function ShopsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  // Get initial data on server side for better SEO and initial render
  const initialData = await getShops(page)

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

      <ShopsClientWrapper initialData={initialData} initialPage={page} />
    </div>
  )
}
