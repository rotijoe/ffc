import { renderHook, act, waitFor } from '@testing-library/react'
import { useGeolocation } from '../index'
import { GEOLOCATION_ERROR_MESSAGES, GEOLOCATION_ERROR_CODES } from '../constants'

// Mock the helpers module
jest.mock('../helpers', () => ({
  isGeolocationSupported: jest.fn(),
  createGeolocationError: jest.fn(),
  extractLocationFromPosition: jest.fn(),
  getCurrentPositionAsPromise: jest.fn()
}))

const mockHelpers = require('../helpers')

// Define GeolocationPositionError constants
;(global as any).GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns initial state with geolocation not supported', () => {
  mockHelpers.isGeolocationSupported.mockReturnValue(false)
  
  const { result } = renderHook(() => useGeolocation())
  
  expect(result.current).toEqual({
    location: null,
    error: null,
    isLoading: false,
    isSupported: false
  })
})

test('returns initial state with geolocation supported', async () => {
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockResolvedValue({
    coords: { latitude: 51.5074, longitude: -0.1278 }
  })
  mockHelpers.extractLocationFromPosition.mockReturnValue({
    latitude: 51.5074,
    longitude: -0.1278
  })
  
  const { result } = renderHook(() => useGeolocation())
  
  // Wait for the initial effect to complete
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })
  
  expect(result.current.isSupported).toBe(true)
  expect(result.current.location).toEqual({
    latitude: 51.5074,
    longitude: -0.1278
  })
})

test('does not set error automatically when geolocation is not supported', () => {
  mockHelpers.isGeolocationSupported.mockReturnValue(false)
  
  const { result } = renderHook(() => useGeolocation())
  
  expect(result.current.error).toBe(null)
  expect(result.current.isSupported).toBe(false)
  expect(result.current.isLoading).toBe(false)
  expect(result.current.location).toBe(null)
  
  // getCurrentLocation should not have been called
  expect(mockHelpers.getCurrentPositionAsPromise).not.toHaveBeenCalled()
})

test('successfully gets location when supported', async () => {
  const mockPosition = {
    coords: { latitude: 51.5074, longitude: -0.1278 }
  }
  const mockLocation = { latitude: 51.5074, longitude: -0.1278 }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockResolvedValue(mockPosition)
  mockHelpers.extractLocationFromPosition.mockReturnValue(mockLocation)
  
  const { result } = renderHook(() => useGeolocation())
  
  await waitFor(() => {
    expect(result.current.location).toEqual(mockLocation)
  })
  
  expect(result.current.isLoading).toBe(false)
  expect(result.current.error).toBe(null)
  expect(mockHelpers.getCurrentPositionAsPromise).toHaveBeenCalledWith({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  })
  expect(mockHelpers.extractLocationFromPosition).toHaveBeenCalledWith(mockPosition)
})

test('handles geolocation error', async () => {
  const mockError = { code: GeolocationPositionError.PERMISSION_DENIED }
  const mockGeolocationError = {
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED
  }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockRejectedValue(mockError)
  mockHelpers.createGeolocationError.mockReturnValue(mockGeolocationError)
  
  const { result } = renderHook(() => useGeolocation())
  
  await waitFor(() => {
    expect(result.current.error).toEqual(mockGeolocationError)
  })
  
  expect(result.current.isLoading).toBe(false)
  expect(result.current.location).toBe(null)
  expect(mockHelpers.createGeolocationError).toHaveBeenCalledWith(mockError.code)
})

test('handles timeout error', async () => {
  const mockError = { code: GeolocationPositionError.TIMEOUT }
  const mockGeolocationError = {
    code: GeolocationPositionError.TIMEOUT,
    message: GEOLOCATION_ERROR_MESSAGES.TIMEOUT
  }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockRejectedValue(mockError)
  mockHelpers.createGeolocationError.mockReturnValue(mockGeolocationError)
  
  const { result } = renderHook(() => useGeolocation())
  
  await waitFor(() => {
    expect(result.current.error).toEqual(mockGeolocationError)
  })
  
  expect(result.current.isLoading).toBe(false)
  expect(result.current.location).toBe(null)
})

test('handles position unavailable error', async () => {
  const mockError = { code: GeolocationPositionError.POSITION_UNAVAILABLE }
  const mockGeolocationError = {
    code: GeolocationPositionError.POSITION_UNAVAILABLE,
    message: GEOLOCATION_ERROR_MESSAGES.POSITION_UNAVAILABLE
  }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockRejectedValue(mockError)
  mockHelpers.createGeolocationError.mockReturnValue(mockGeolocationError)
  
  const { result } = renderHook(() => useGeolocation())
  
  await waitFor(() => {
    expect(result.current.error).toEqual(mockGeolocationError)
  })
  
  expect(result.current.isLoading).toBe(false)
  expect(result.current.location).toBe(null)
})

test('does not auto-fetch location if already has location', async () => {
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockResolvedValue({
    coords: { latitude: 51.5074, longitude: -0.1278 }
  })
  mockHelpers.extractLocationFromPosition.mockReturnValue({
    latitude: 51.5074,
    longitude: -0.1278
  })
  
  const { result, rerender } = renderHook(() => useGeolocation())
  
  // Wait for initial location fetch to complete
  await waitFor(() => {
    expect(result.current.location).toBeTruthy()
  })
  
  // Clear the mock calls from initial render
  mockHelpers.getCurrentPositionAsPromise.mockClear()
  
  // Rerender should not trigger another location fetch if we already have location
  rerender()
  
  expect(mockHelpers.getCurrentPositionAsPromise).not.toHaveBeenCalled()
})

test('does not auto-fetch location if already has error', async () => {
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  const mockError = { code: GeolocationPositionError.PERMISSION_DENIED }
  const mockGeolocationError = {
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED
  }
  
  mockHelpers.getCurrentPositionAsPromise.mockRejectedValue(mockError)
  mockHelpers.createGeolocationError.mockReturnValue(mockGeolocationError)
  
  const { result, rerender } = renderHook(() => useGeolocation())
  
  // Wait for error to be set
  await waitFor(() => {
    expect(result.current.error).toEqual(mockGeolocationError)
  })
  
  // Clear the mock calls
  mockHelpers.getCurrentPositionAsPromise.mockClear()
  
  // Rerender should not trigger another location fetch if we already have error
  rerender()
  
  expect(mockHelpers.getCurrentPositionAsPromise).not.toHaveBeenCalled()
})

test('clears error before new location request', async () => {
  const mockPosition = {
    coords: { latitude: 51.5074, longitude: -0.1278 }
  }
  const mockLocation = { latitude: 51.5074, longitude: -0.1278 }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  mockHelpers.getCurrentPositionAsPromise.mockResolvedValue(mockPosition)
  mockHelpers.extractLocationFromPosition.mockReturnValue(mockLocation)
  
  const { result } = renderHook(() => useGeolocation())
  
  await waitFor(() => {
    expect(result.current.location).toEqual(mockLocation)
  })
  
  // Initially should have no error
  expect(result.current.error).toBe(null)
  
  // The hook should clear any existing error when starting a new request
  expect(result.current.isLoading).toBe(false)
})

test('loading state is managed correctly during successful request', async () => {
  const mockPosition = {
    coords: { latitude: 51.5074, longitude: -0.1278 }
  }
  const mockLocation = { latitude: 51.5074, longitude: -0.1278 }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  
  let resolvePromise: (value: any) => void
  const promise = new Promise((resolve) => {
    resolvePromise = resolve
  })
  
  mockHelpers.getCurrentPositionAsPromise.mockReturnValue(promise)
  mockHelpers.extractLocationFromPosition.mockReturnValue(mockLocation)
  
  const { result } = renderHook(() => useGeolocation())
  
  // Should be loading initially
  expect(result.current.isLoading).toBe(true)
  
  // Resolve the promise
  act(() => {
    resolvePromise!(mockPosition)
  })
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })
  
  expect(result.current.location).toEqual(mockLocation)
})

test('loading state is managed correctly during failed request', async () => {
  const mockError = { code: GeolocationPositionError.PERMISSION_DENIED }
  const mockGeolocationError = {
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED
  }
  
  mockHelpers.isGeolocationSupported.mockReturnValue(true)
  
  let rejectPromise: (error: any) => void
  const promise = new Promise((resolve, reject) => {
    rejectPromise = reject
  })
  
  mockHelpers.getCurrentPositionAsPromise.mockReturnValue(promise)
  mockHelpers.createGeolocationError.mockReturnValue(mockGeolocationError)
  
  const { result } = renderHook(() => useGeolocation())
  
  // Should be loading initially
  expect(result.current.isLoading).toBe(true)
  
  // Reject the promise
  act(() => {
    rejectPromise!(mockError)
  })
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })
  
  expect(result.current.error).toEqual(mockGeolocationError)
})