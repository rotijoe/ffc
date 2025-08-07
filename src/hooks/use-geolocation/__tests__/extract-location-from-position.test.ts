import { extractLocationFromPosition } from '../helpers'

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

test('extractLocationFromPosition extracts correct coordinates', () => {
  const mockPosition = createMockPosition(51.5074, -0.1278)

  const location = extractLocationFromPosition(mockPosition)

  expect(location).toEqual({
    latitude: 51.5074,
    longitude: -0.1278
  })
})

test('extractLocationFromPosition handles negative coordinates', () => {
  const mockPosition = createMockPosition(-33.8688, 151.2093)

  const location = extractLocationFromPosition(mockPosition)

  expect(location).toEqual({
    latitude: -33.8688,
    longitude: 151.2093
  })
})