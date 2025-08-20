import { render, screen } from '@testing-library/react'
import { ShopsClientWrapper } from '../index'
import type { ShopsClientWrapperProps } from '../types'
import type { ShopListData } from '@/lib/types'

// Mock the useGeolocation hook
jest.mock('../../../hooks/use-geolocation', () => ({
  useGeolocation: jest.fn()
}))

// Mock the ShopListClient component
jest.mock('../../shop-list-client', () => ({
  ShopListClient: jest.fn(
    ({
      userLocation,
      isLocationLoading,
      locationError,
      initialData,
      page,
      initialQuery
    }) => (
      <div data-testid='shop-list-client'>
        <div data-testid='user-location'>
          {userLocation
            ? `${userLocation.latitude},${userLocation.longitude}`
            : 'null'}
        </div>
        <div data-testid='is-location-loading'>
          {isLocationLoading.toString()}
        </div>
        <div data-testid='location-error'>
          {locationError ? locationError.message : 'null'}
        </div>
        <div data-testid='initial-data'>{JSON.stringify(initialData)}</div>
        <div data-testid='page'>{page.toString()}</div>
        <div data-testid='initial-query'>{initialQuery ?? 'undefined'}</div>
      </div>
    )
  )
}))

const mockUseGeolocation =
  require('../../../hooks/use-geolocation').useGeolocation

describe('ShopsClientWrapper', () => {
  const mockShopListData: ShopListData = {
    shops: [
      {
        fhrs_id: 123,
        business_name: 'Test Chicken Shop',
        address: '123 Test Street',
        postcode: 'TE1 1ST',
        latitude: 51.5074,
        longitude: -0.1278
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: true,
      hasPreviousPage: false
    }
  }

  const defaultProps: ShopsClientWrapperProps = {
    initialData: mockShopListData,
    initialPage: 1,
    initialQuery: 'chicken'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('shop-list-client')).toBeInTheDocument()
    })
  })

  describe('Geolocation Integration', () => {
    it('calls useGeolocation hook', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(mockUseGeolocation).toHaveBeenCalledTimes(1)
    })

    it('passes user location to ShopListClient when available', () => {
      const mockLocation = {
        latitude: 51.5074,
        longitude: -0.1278
      }

      mockUseGeolocation.mockReturnValue({
        location: mockLocation,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('user-location')).toHaveTextContent(
        '51.5074,-0.1278'
      )
    })

    it('passes null location when geolocation is not available', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('user-location')).toHaveTextContent('null')
    })

    it('passes loading state from geolocation hook', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: true,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('is-location-loading')).toHaveTextContent(
        'true'
      )
    })

    it('passes location error from geolocation hook', () => {
      const mockError = {
        code: 1,
        message: 'Permission denied'
      }

      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: mockError
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('location-error')).toHaveTextContent(
        'Permission denied'
      )
    })

    it('passes null error when no geolocation error', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('location-error')).toHaveTextContent('null')
    })
  })

  describe('Component Composition', () => {
    it('renders ShopListClient component', () => {
      mockUseGeolocation.mockReturnValue({
        location: null,
        isLoading: false,
        error: null
      })

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('shop-list-client')).toBeInTheDocument()
    })

    it('passes all geolocation hook return values to ShopListClient', () => {
      const mockGeolocationReturn = {
        location: { latitude: 51.5074, longitude: -0.1278 },
        isLoading: true,
        error: { code: 1, message: 'Test error' }
      }

      mockUseGeolocation.mockReturnValue(mockGeolocationReturn)

      render(<ShopsClientWrapper {...defaultProps} />)

      expect(screen.getByTestId('user-location')).toHaveTextContent(
        '51.5074,-0.1278'
      )
      expect(screen.getByTestId('is-location-loading')).toHaveTextContent(
        'true'
      )
      expect(screen.getByTestId('location-error')).toHaveTextContent(
        'Test error'
      )
    })
  })
})
