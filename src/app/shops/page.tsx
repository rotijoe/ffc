import { getShops } from '@/lib/shops-api'
import { ShopsClientWrapper } from '@/components/shops-client-wrapper'

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
      <ShopsClientWrapper initialData={initialData} initialPage={page} />
    </div>
  )
}
