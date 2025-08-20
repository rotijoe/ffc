import { formatAddress } from '../helpers'
import { DEFAULT_VALUES } from '../constants'

describe('formatAddress', () => {
  it('formats address with postcode correctly', () => {
    const result = formatAddress('123 Test Street', 'TE1 1ST')

    expect(result).toBe('123 Test Street, TE1 1ST')
  })

  it('returns default value when address is null', () => {
    const result = formatAddress(null, 'TE1 1ST')

    expect(result).toBe(DEFAULT_VALUES.ADDRESS)
  })

  it('returns address only when postcode is null', () => {
    const result = formatAddress('123 Test Street', null)

    expect(result).toBe('123 Test Street')
  })

  it('returns default value when both address and postcode are null', () => {
    const result = formatAddress(null, null)

    expect(result).toBe(DEFAULT_VALUES.ADDRESS)
  })

  it('trims whitespace from address and postcode', () => {
    const result = formatAddress('  123 Test Street  ', '  TE1 1ST  ')

    expect(result).toBe('123 Test Street, TE1 1ST')
  })

  it('handles empty strings', () => {
    const result = formatAddress('', '')

    expect(result).toBe(DEFAULT_VALUES.ADDRESS)
  })
})
