import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ShopList } from './index'
import * as helpers from './helpers'

// Mock the helpers module
jest.mock('./helpers', () => ({
  fetchShops: jest.fn(),
  formatAddress: jest.fn((address) => address || 'Address not available'),
  formatBusinessName: jest.fn((name) => name || 'Name not available')
}))

const mockFetchShops = helpers.fetchShops as jest.MockedFunction<
  typeof helpers.fetchShops
>

const mockShopsData = {
  shops: [
    {
      fhrs_id: 1,
      business_name: 'KFC Downtown',
      address: '123 Main Street, City Center'
    },
    {
      fhrs_id: 2,
      business_name: 'Popeyes Express',
      address: '456 Oak Avenue, Shopping Mall'
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalCount: 25,
    hasNextPage: true,
    hasPreviousPage: false
  }
}

describe('ShopList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders loading state initially', () => {
    mockFetchShops.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ShopList />)

    // Check for loading skeleton cards by looking for the animate-pulse class
    const loadingCards = document.querySelectorAll('.animate-pulse')
    expect(loadingCards).toHaveLength(5)
  })

  test('renders shop list after successful data fetch', async () => {
    mockFetchShops.mockResolvedValue(mockShopsData)

    render(<ShopList />)

    await waitFor(() => {
      expect(screen.getByText('KFC Downtown')).toBeInTheDocument()
      expect(screen.getByText('Popeyes Express')).toBeInTheDocument()
      expect(
        screen.getByText('123 Main Street, City Center')
      ).toBeInTheDocument()
      expect(
        screen.getByText('456 Oak Avenue, Shopping Mall')
      ).toBeInTheDocument()
    })
  })

  test('renders error state when fetch fails', async () => {
    const errorMessage = 'Failed to fetch shops: Network error'
    mockFetchShops.mockRejectedValue(new Error(errorMessage))

    render(<ShopList />)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Try Again' })
      ).toBeInTheDocument()
    })
  })

  test('renders empty state when no shops found', async () => {
    mockFetchShops.mockResolvedValue({
      shops: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    })

    render(<ShopList />)

    await waitFor(() => {
      expect(
        screen.getByText('No fried chicken shops found.')
      ).toBeInTheDocument()
    })
  })

  test('renders pagination controls correctly', async () => {
    mockFetchShops.mockResolvedValue(mockShopsData)

    render(<ShopList />)

    await waitFor(() => {
      expect(
        screen.getByText(/Showing 1 to 10 of 25 results/)
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled()
      expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
      expect(screen.getByRole('button', { name: '1' })).toHaveClass(
        'bg-primary'
      )
    })
  })

  test('handles page navigation correctly', async () => {
    mockFetchShops.mockResolvedValue(mockShopsData)

    render(<ShopList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Next/ })).toBeInTheDocument()
    })

    // Mock page 2 data
    const page2Data = {
      ...mockShopsData,
      pagination: {
        ...mockShopsData.pagination,
        currentPage: 2,
        hasPreviousPage: true
      }
    }
    mockFetchShops.mockResolvedValue(page2Data)

    fireEvent.click(screen.getByRole('button', { name: /Next/ }))

    await waitFor(() => {
      expect(mockFetchShops).toHaveBeenCalledWith(2)
    })
  })

  test('retry button works in error state', async () => {
    // First call fails
    mockFetchShops.mockRejectedValueOnce(new Error('Network error'))

    render(<ShopList />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    // Second call succeeds
    mockFetchShops.mockResolvedValue(mockShopsData)

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    await waitFor(() => {
      expect(screen.getByText('KFC Downtown')).toBeInTheDocument()
    })

    expect(mockFetchShops).toHaveBeenCalledTimes(2)
  })

  test('does not render pagination when totalPages is 1 or less', async () => {
    mockFetchShops.mockResolvedValue({
      ...mockShopsData,
      pagination: {
        ...mockShopsData.pagination,
        totalPages: 1,
        hasNextPage: false
      }
    })

    render(<ShopList />)

    await waitFor(() => {
      expect(screen.getByText('KFC Downtown')).toBeInTheDocument()
    })

    expect(
      screen.queryByRole('button', { name: /Previous/ })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Next/ })
    ).not.toBeInTheDocument()
  })
})
