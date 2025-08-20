import { generateSkeletonCards } from '../helpers'

describe('generateSkeletonCards', () => {
  it('generates array with correct length for positive number', () => {
    const result = generateSkeletonCards(5)
    expect(result).toHaveLength(5)
  })

  it('generates array with indices from 0 to count-1', () => {
    const result = generateSkeletonCards(3)
    expect(result).toEqual([0, 1, 2])
  })

  it('handles count of 1', () => {
    const result = generateSkeletonCards(1)
    expect(result).toEqual([0])
  })

  it('handles count of 0', () => {
    const result = generateSkeletonCards(0)
    expect(result).toEqual([])
  })

  it('handles large numbers', () => {
    const result = generateSkeletonCards(100)
    expect(result).toHaveLength(100)
    expect(result[0]).toBe(0)
    expect(result[99]).toBe(99)
  })

  it('returns array with sequential indices', () => {
    const result = generateSkeletonCards(10)
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(i)
    }
  })
})
