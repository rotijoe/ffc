import { formatErrorMessage } from '../helpers'

describe('formatErrorMessage', () => {
  it('returns error message for Error instances', () => {
    const error = new Error('Test error message')
    const result = formatErrorMessage(error)

    expect(result).toBe('Test error message')
  })

  it('returns default message for non-Error values', () => {
    const result = formatErrorMessage('string error')
    expect(result).toBe('An unexpected error occurred')
  })

  it('returns default message for null', () => {
    const result = formatErrorMessage(null)
    expect(result).toBe('An unexpected error occurred')
  })

  it('returns default message for undefined', () => {
    const result = formatErrorMessage(undefined)
    expect(result).toBe('An unexpected error occurred')
  })

  it('returns default message for numbers', () => {
    const result = formatErrorMessage(404)
    expect(result).toBe('An unexpected error occurred')
  })

  it('returns default message for objects', () => {
    const result = formatErrorMessage({ code: 500, message: 'Server error' })
    expect(result).toBe('An unexpected error occurred')
  })

  it('returns default message for arrays', () => {
    const result = formatErrorMessage(['error1', 'error2'])
    expect(result).toBe('An unexpected error occurred')
  })
})
