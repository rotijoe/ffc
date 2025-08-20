import { validateHeroProps } from '../helpers'

describe('validateHeroProps', () => {
  it('returns true for valid props object', () => {
    const validProps = {
      title: 'Test Title',
      description: 'Test Description',
      showButtons: true
    }

    expect(validateHeroProps(validProps)).toBe(true)
  })

  it('returns true for empty object', () => {
    expect(validateHeroProps({})).toBe(true)
  })

  it('returns false for null', () => {
    expect(validateHeroProps(null as any)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(validateHeroProps(undefined as any)).toBe(false)
  })

  it('returns false for non-object values', () => {
    expect(validateHeroProps('string' as any)).toBe(false)
    expect(validateHeroProps(123 as any)).toBe(false)
    expect(validateHeroProps(true as any)).toBe(false)
    expect(validateHeroProps([] as any)).toBe(true) // Arrays are objects in JavaScript
  })
})
