import { createGeolocationError } from '../helpers'
import { GEOLOCATION_ERROR_MESSAGES, GEOLOCATION_ERROR_CODES } from '../constants'

// Define GeolocationPositionError constants
;(global as any).GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

test('createGeolocationError creates error with default message', () => {
  const error = createGeolocationError(GeolocationPositionError.PERMISSION_DENIED)
  
  expect(error).toEqual({
    code: GeolocationPositionError.PERMISSION_DENIED,
    message: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED
  })
})

test('createGeolocationError creates error with custom message', () => {
  const customMessage = 'Custom error message'
  const error = createGeolocationError(GeolocationPositionError.TIMEOUT, customMessage)
  
  expect(error).toEqual({
    code: GeolocationPositionError.TIMEOUT,
    message: customMessage
  })
})

test('createGeolocationError creates error with NOT_SUPPORTED code and message', () => {
  const error = createGeolocationError(
    GEOLOCATION_ERROR_CODES.NOT_SUPPORTED, 
    GEOLOCATION_ERROR_MESSAGES.NOT_SUPPORTED
  )
  
  expect(error).toEqual({
    code: GEOLOCATION_ERROR_CODES.NOT_SUPPORTED,
    message: GEOLOCATION_ERROR_MESSAGES.NOT_SUPPORTED
  })
})