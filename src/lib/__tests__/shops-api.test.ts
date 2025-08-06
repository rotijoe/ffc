import { getShops, formatAddress, formatBusinessName } from '../shops-api'
import { supabaseServer } from '../supabase-server'

// Mock the supabase server
jest.mock('../supabase-server', () => ({
  supabaseServer: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn()
  }
}))

const mockSupabaseServer = supabaseServer as jest.Mocked<typeof supabaseServer>

describe('shops-api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getShops', () => {
    it('should fetch shops successfully', async () => {
      const mockData = [
        {
          fhrs_id: 1,
          business_name: 'KFC Downtown',
          address: '123 Main Street'
        },
        {
          fhrs_id: 2,
          business_name: 'Popeyes Express',
          address: '456 Oak Avenue'
        }
      ]

      mockSupabaseServer.range.mockResolvedValue({
        data: mockData,
        error: null,
        count: 25
      })

      const result = await getShops(1)

      expect(result).toEqual({
        shops: mockData,
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalCount: 25,
          hasNextPage: true,
          hasPreviousPage: false
        }
      })

      expect(mockSupabaseServer.from).toHaveBeenCalledWith('fried_chicken_shops')
      expect(mockSupabaseServer.select).toHaveBeenCalledWith(
        'fhrs_id, business_name, address',
        { count: 'exact' }
      )
      expect(mockSupabaseServer.order).toHaveBeenCalledWith('business_name', {
        ascending: true
      })
      expect(mockSupabaseServer.range).toHaveBeenCalledWith(0, 9)
    })

    it('should handle pagination correctly for page 2', async () => {
      mockSupabaseServer.range.mockResolvedValue({
        data: [],
        error: null,
        count: 25
      })

      await getShops(2)

      expect(mockSupabaseServer.range).toHaveBeenCalledWith(10, 19)
    })

    it('should throw error when supabase fails', async () => {
      mockSupabaseServer.range.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
        count: null
      })

      await expect(getShops(1)).rejects.toThrow(
        'Failed to fetch shops: Database connection failed'
      )
    })

    it('should handle empty results', async () => {
      mockSupabaseServer.range.mockResolvedValue({
        data: [],
        error: null,
        count: 0
      })

      const result = await getShops(1)

      expect(result).toEqual({
        shops: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      })
    })
  })

  describe('formatAddress', () => {
    it('should format valid address', () => {
      expect(formatAddress('  123 Main Street  ')).toBe('123 Main Street')
    })

    it('should handle null address', () => {
      expect(formatAddress(null)).toBe('Address not available')
    })

    it('should handle empty string', () => {
      expect(formatAddress('')).toBe('Address not available')
    })
  })

  describe('formatBusinessName', () => {
    it('should format valid business name', () => {
      expect(formatBusinessName('  KFC Downtown  ')).toBe('KFC Downtown')
    })

    it('should handle null business name', () => {
      expect(formatBusinessName(null)).toBe('Name not available')
    })

    it('should handle empty string', () => {
      expect(formatBusinessName('')).toBe('Name not available')
    })
  })
})