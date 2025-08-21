import { isGeolocationSupported } from '../helpers'

test('isGeolocationSupported returns true when geolocation is supported', () => {
  const mockNavigator = {
    geolocation: {}
  }
  Object.defineProperty(global, 'navigator', {
    value: mockNavigator,
    writable: true
  })

  expect(isGeolocationSupported()).toBe(true)
})

test('isGeolocationSupported returns false when navigator is undefined', () => {
  Object.defineProperty(global, 'navigator', {
    value: undefined,
    writable: true
  })

  expect(isGeolocationSupported()).toBe(false)
})

test('isGeolocationSupported returns false when geolocation is not available', () => {
  const mockNavigator = {}
  Object.defineProperty(global, 'navigator', {
    value: mockNavigator,
    writable: true
  })

  expect(isGeolocationSupported()).toBe(false)
})