import { getGeolocationErrorMessage } from '../helpers'
import { GEOLOCATION_ERROR_MESSAGES } from '../constants'

// Define GeolocationPositionError constants
;(global as any).GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

test('getGeolocationErrorMessage returns correct message for PERMISSION_DENIED', () => {
  expect(getGeolocationErrorMessage(GeolocationPositionError.PERMISSION_DENIED))
    .toBe(GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED)
})

test('getGeolocationErrorMessage returns correct message for POSITION_UNAVAILABLE', () => {
  expect(getGeolocationErrorMessage(GeolocationPositionError.POSITION_UNAVAILABLE))
    .toBe(GEOLOCATION_ERROR_MESSAGES.POSITION_UNAVAILABLE)
})

test('getGeolocationErrorMessage returns correct message for TIMEOUT', () => {
  expect(getGeolocationErrorMessage(GeolocationPositionError.TIMEOUT))
    .toBe(GEOLOCATION_ERROR_MESSAGES.TIMEOUT)
})

test('getGeolocationErrorMessage returns unknown message for invalid code', () => {
  expect(getGeolocationErrorMessage(999)).toBe(GEOLOCATION_ERROR_MESSAGES.UNKNOWN)
})