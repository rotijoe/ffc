import { render } from '@testing-library/react'
import ShopsPage from '../page'
import { getShops } from '../helpers'

// Mock the getShops function
jest.mock('../helpers', () => ({
  getShops: jest.fn()
}))

// Mock the ShopsClientWrapper component
jest.mock('@/components/shops-client-wrapper', () => ({
  ShopsClientWrapper: ({ initialData, initialPage }: any) => (
    <div data-testid='shops-client-wrapper'>
      <span data-testid='initial-data'>{JSON.stringify(initialData)}</span>
      <span data-testid='initial-page'>{initialPage}</span>
    </div>
  )
}))

const mockGetShops = getShops as jest.MockedFunction<typeof getShops>

describe('ShopsPage', () => {
  const mockShopListData = {
    shops: [
      {
        id: 1,
        name: 'Test Shop',
        address: '123 Test St',
        postcode: 'TE1 1ST',
        distance: null
      }
    ],
    totalCount: 1,
    totalPages: 1,
    currentPage: 1
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetShops.mockResolvedValue(mockShopListData)
  })

  it('renders the page container with correct styling', async () => {
    const searchParams = Promise.resolve({ page: '1', q: 'test' })

    const { container } = render(await ShopsPage({ searchParams }))

    const pageContainer = container.querySelector('.container')
    expect(pageContainer).toBeInTheDocument()
    expect(pageContainer).toHaveClass('mx-auto', 'px-4', 'py-8')
  })

  it('renders ShopsClientWrapper with correct props when page and query provided', async () => {
    const searchParams = Promise.resolve({ page: '2', q: 'chicken' })

    const { getByTestId } = render(await ShopsPage({ searchParams }))

    expect(getByTestId('shops-client-wrapper')).toBeInTheDocument()
    expect(getByTestId('initial-page')).toHaveTextContent('2')
    expect(getByTestId('initial-data')).toHaveTextContent(
      JSON.stringify(mockShopListData)
    )
  })

  it('uses default page 1 when no page parameter provided', async () => {
    const searchParams = Promise.resolve({ q: 'test' })

    const { getByTestId } = render(await ShopsPage({ searchParams }))

    expect(getByTestId('initial-page')).toHaveTextContent('1')
  })

  it('uses undefined query when no query parameter provided', async () => {
    const searchParams = Promise.resolve({ page: '1' })

    const { getByTestId } = render(await ShopsPage({ searchParams }))

    expect(getByTestId('initial-data')).toHaveTextContent(
      JSON.stringify(mockShopListData)
    )
  })

  it('handles empty search params', async () => {
    const searchParams = Promise.resolve({})

    const { getByTestId } = render(await ShopsPage({ searchParams }))

    expect(getByTestId('initial-page')).toHaveTextContent('1')
    expect(getByTestId('initial-data')).toHaveTextContent(
      JSON.stringify(mockShopListData)
    )
  })

  it('calls getShops with correct parameters', async () => {
    const searchParams = Promise.resolve({ page: '3', q: 'kfc' })

    await ShopsPage({ searchParams })

    expect(mockGetShops).toHaveBeenCalledTimes(1)
    expect(mockGetShops).toHaveBeenCalledWith(3, 'kfc')
  })

  it('handles invalid page parameter by defaulting to page 1', async () => {
    const searchParams = Promise.resolve({ page: 'invalid', q: 'test' })

    const { getByTestId } = render(await ShopsPage({ searchParams }))

    expect(getByTestId('initial-page')).toHaveTextContent('1')
    expect(mockGetShops).toHaveBeenCalledWith(1, 'test')
  })

  it('handles getShops errors gracefully', async () => {
    const error = new Error('Failed to fetch shops')
    mockGetShops.mockRejectedValue(error)

    const searchParams = Promise.resolve({ page: '1' })

    await expect(ShopsPage({ searchParams })).rejects.toThrow(
      'Failed to fetch shops'
    )
  })
})
