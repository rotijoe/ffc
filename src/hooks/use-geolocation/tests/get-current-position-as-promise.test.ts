import { getCurrentPositionAsPromise } from '../helpers'

// Define GeolocationPositionError constants
;(global as any).GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

// Helper to create mock GeolocationCoordinates
const createMockCoordinates = (latitude: number, longitude: number): GeolocationCoordinates => ({
  latitude,
  longitude,
  accuracy: 10,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  toJSON: () => ({ latitude, longitude, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null })
})

// Helper to create mock GeolocationPosition
const createMockPosition = (latitude: number, longitude: number): GeolocationPosition => ({
  coords: createMockCoordinates(latitude, longitude),
  timestamp: Date.now(),
  toJSON: () => ({
    coords: createMockCoordinates(latitude, longitude),
    timestamp: Date.now()
  })
})

test('getCurrentPositionAsPromise resolves with position on success', async () => {
  const mockPosition = createMockPosition(51.5074, -0.1278)

  const mockGeolocation = {
    getCurrentPosition: jest.fn((success: PositionCallback) => {
      success(mockPosition)
    })
  }

  Object.defineProperty(global, 'navigator', {
    value: { geolocation: mockGeolocation },
    writable: true
  })

  const position = await getCurrentPositionAsPromise()
  expect(position).toEqual(mockPosition)
  expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    undefined
  )
})

test('getCurrentPositionAsPromise passes options to getCurrentPosition', async () => {
  const mockPosition = createMockPosition(51.5074, -0.1278)

  const mockGeolocation = {
    getCurrentPosition: jest.fn((success: PositionCallback) => {
      success(mockPosition)
    })
  }

  Object.defineProperty(global, 'navigator', {
    value: { geolocation: mockGeolocation },
    writable: true
  })

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10000
  }

  await getCurrentPositionAsPromise(options)
  expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    options
  )
})

test('getCurrentPositionAsPromise rejects on geolocation error', async () => {
  const mockError = {
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: 'Permission denied',
    PERMISSION_DENIED: 1 as const,
    POSITION_UNAVAILABLE: 2 as const,
    TIMEOUT: 3 as const
  } as GeolocationPositionError

  const mockGeolocation = {
    getCurrentPosition: jest.fn((success: PositionCallback, error: PositionErrorCallback) => {
      error(mockError)
    })
  }

  Object.defineProperty(global, 'navigator', {
    value: { geolocation: mockGeolocation },
    writable: true
  })

  await expect(getCurrentPositionAsPromise()).rejects.toEqual(mockError)
})