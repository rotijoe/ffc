import { getShops } from '../helpers'
import { fetchShops } from '@/lib/fetch-shops'

// Mock the fetchShops function
jest.mock('@/lib/fetch-shops', () => ({
  fetchShops: jest.fn()
}))

const mockFetchShops = fetchShops as jest.MockedFunction<typeof fetchShops>

describe('getShops', () => {
  const mockShopListData = {
    shops: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchShops.mockResolvedValue(mockShopListData)
  })

  it('calls fetchShops with default page when no page provided', async () => {
    await getShops()

    expect(mockFetchShops).toHaveBeenCalledTimes(1)
    expect(mockFetchShops).toHaveBeenCalledWith(expect.anything(), 1, undefined)
  })

  it('calls fetchShops with provided page number', async () => {
    await getShops(3)

    expect(mockFetchShops).toHaveBeenCalledTimes(1)
    expect(mockFetchShops).toHaveBeenCalledWith(expect.anything(), 3, undefined)
  })

  it('calls fetchShops with provided query string', async () => {
    await getShops(1, 'chicken')

    expect(mockFetchShops).toHaveBeenCalledTimes(1)
    expect(mockFetchShops).toHaveBeenCalledWith(expect.anything(), 1, 'chicken')
  })

  it('calls fetchShops with both page and query parameters', async () => {
    await getShops(2, 'kfc')

    expect(mockFetchShops).toHaveBeenCalledTimes(1)
    expect(mockFetchShops).toHaveBeenCalledWith(expect.anything(), 2, 'kfc')
  })

  it('returns the result from fetchShops', async () => {
    const result = await getShops(1, 'test')

    expect(result).toEqual(mockShopListData)
  })

  it('handles fetchShops errors', async () => {
    const error = new Error('Failed to fetch shops')
    mockFetchShops.mockRejectedValue(error)

    await expect(getShops(1, 'test')).rejects.toThrow('Failed to fetch shops')
  })

  it('calls fetchShops for each invocation', async () => {
    // First call
    await getShops(1, 'chicken')
    // Second call with same parameters
    await getShops(1, 'chicken')

    // Each call should invoke fetchShops (cache behavior is tested in integration)
    expect(mockFetchShops).toHaveBeenCalledTimes(2)
    expect(mockFetchShops).toHaveBeenNthCalledWith(1, expect.anything(), 1, 'chicken')
    expect(mockFetchShops).toHaveBeenNthCalledWith(2, expect.anything(), 1, 'chicken')
  })
})
