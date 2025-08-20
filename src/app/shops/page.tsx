import { ShopsClientWrapper } from '@/components/shops-client-wrapper'
import { getShops } from './helpers'

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function ShopsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const query = params.q || undefined

  const initialData = await getShops(page, query)

  return (
    <div className='container mx-auto px-4 py-8'>
      <ShopsClientWrapper initialData={initialData} initialPage={page} />
    </div>
  )
}
