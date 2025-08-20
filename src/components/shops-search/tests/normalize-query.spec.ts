import { normalizeQuery } from '../helpers'

describe('normalizeQuery', () => {
  it('trims whitespace from the beginning and end', () => {
    expect(normalizeQuery('  hello world  ')).toBe('hello world')
  })

  it('returns empty string for empty input', () => {
    expect(normalizeQuery('')).toBe('')
  })

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeQuery('   ')).toBe('')
  })

  it('returns empty string for tab and newline characters', () => {
    expect(normalizeQuery('\t\n\r')).toBe('')
  })

  it('preserves internal whitespace', () => {
    expect(normalizeQuery('  hello   world  ')).toBe('hello   world')
  })

  it('handles single character input', () => {
    expect(normalizeQuery('a')).toBe('a')
  })

  it('handles input with no leading or trailing whitespace', () => {
    expect(normalizeQuery('hello world')).toBe('hello world')
  })

  it('handles special characters', () => {
    expect(normalizeQuery('  KFC & Co.  ')).toBe('KFC & Co.')
  })

  it('handles numbers', () => {
    expect(normalizeQuery('  12345  ')).toBe('12345')
  })

  it('handles mixed content', () => {
    expect(normalizeQuery('  Chicken Shop 123 & More!  ')).toBe('Chicken Shop 123 & More!')
  })
})
