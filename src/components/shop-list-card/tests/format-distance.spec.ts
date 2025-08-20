import { formatDistance } from '../helpers'
import { DISTANCE_THRESHOLDS } from '../constants'

describe('formatDistance', () => {
  it('formats distance correctly', () => {
    const result = formatDistance(2.5)

    expect(result).toBe('2.5 mi')
  })

  it('returns empty string when distance is undefined', () => {
    const result = formatDistance(undefined)

    expect(result).toBe('')
  })

  it('returns empty string when distance is null', () => {
    const result = formatDistance(null as any)

    expect(result).toBe('')
  })

  it('returns empty string when distance is 0', () => {
    const result = formatDistance(0)

    expect(result).toBe('')
  })

  it('formats very small distances as less than threshold', () => {
    const smallDistance = DISTANCE_THRESHOLDS.MIN_DISPLAY - 0.01
    const result = formatDistance(smallDistance)

    expect(result).toBe('< 0.1 mi')
  })

  it('formats distance at threshold correctly', () => {
    const result = formatDistance(DISTANCE_THRESHOLDS.MIN_DISPLAY)

    expect(result).toBe('0.1 mi')
  })

  it('formats large distances correctly', () => {
    const result = formatDistance(15.7)

    expect(result).toBe('15.7 mi')
  })

  it('formats integer distances correctly', () => {
    const result = formatDistance(5)

    expect(result).toBe('5.0 mi')
  })

  it('handles very large distances', () => {
    const result = formatDistance(999.9)

    expect(result).toBe('999.9 mi')
  })
})
