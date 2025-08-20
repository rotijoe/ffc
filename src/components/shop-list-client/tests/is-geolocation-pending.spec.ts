import { isGeolocationPending } from '../helpers'

describe('isGeolocationPending', () => {
  it('returns true when location is loading', () => {
    const result = isGeolocationPending(true, null, null, false)
    expect(result).toBe(true)
  })

  it('returns true when no location, no error, and not initially loaded', () => {
    const result = isGeolocationPending(false, null, null, false)
    expect(result).toBe(true)
  })

  it('returns false when location is available', () => {
    const userLocation = { latitude: 51.5074, longitude: -0.1278 }
    const result = isGeolocationPending(false, userLocation, null, true)
    expect(result).toBe(false)
  })

  it('returns false when there is a location error', () => {
    const locationError = { code: 1, message: 'Permission denied' }
    const result = isGeolocationPending(false, null, locationError, true)
    expect(result).toBe(false)
  })

  it('returns false when initially loaded but no location or error', () => {
    const result = isGeolocationPending(false, null, null, true)
    expect(result).toBe(false)
  })

  it('returns true when loading even if location exists', () => {
    const userLocation = { latitude: 51.5074, longitude: -0.1278 }
    const result = isGeolocationPending(true, userLocation, null, true)
    expect(result).toBe(true)
  })

  it('returns true when loading even if error exists', () => {
    const locationError = { code: 1, message: 'Permission denied' }
    const result = isGeolocationPending(true, null, locationError, true)
    expect(result).toBe(true)
  })

  it('handles edge case with empty object location', () => {
    const result = isGeolocationPending(false, {}, null, true)
    expect(result).toBe(false)
  })

  it('handles edge case with undefined parameters', () => {
    const result = isGeolocationPending(false, undefined, undefined, false)
    expect(result).toBe(true)
  })
})
