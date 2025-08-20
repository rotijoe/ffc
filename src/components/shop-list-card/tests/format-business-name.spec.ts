import { formatBusinessName } from '../helpers'
import { DEFAULT_VALUES } from '../constants'

describe('formatBusinessName', () => {
  it('returns business name when provided', () => {
    const result = formatBusinessName('Test Chicken Shop')

    expect(result).toBe('Test Chicken Shop')
  })

  it('returns default value when name is null', () => {
    const result = formatBusinessName(null)

    expect(result).toBe(DEFAULT_VALUES.BUSINESS_NAME)
  })

  it('returns default value when name is empty string', () => {
    const result = formatBusinessName('')

    expect(result).toBe(DEFAULT_VALUES.BUSINESS_NAME)
  })

  it('trims whitespace from business name', () => {
    const result = formatBusinessName('  Test Chicken Shop  ')

    expect(result).toBe('Test Chicken Shop')
  })

  it('handles whitespace-only strings', () => {
    const result = formatBusinessName('   ')

    expect(result).toBe('') // trim() removes all whitespace
  })
})
