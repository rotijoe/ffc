import { generatePaginationButtons } from '../helpers'

describe('generatePaginationButtons', () => {
  it('generates array with correct length for positive number', () => {
    const result = generatePaginationButtons(3)
    expect(result).toHaveLength(3)
  })

  it('generates array with indices from 0 to count-1', () => {
    const result = generatePaginationButtons(5)
    expect(result).toEqual([0, 1, 2, 3, 4])
  })

  it('handles count of 1', () => {
    const result = generatePaginationButtons(1)
    expect(result).toEqual([0])
  })

  it('handles count of 0', () => {
    const result = generatePaginationButtons(0)
    expect(result).toEqual([])
  })

  it('handles large numbers', () => {
    const result = generatePaginationButtons(50)
    expect(result).toHaveLength(50)
    expect(result[0]).toBe(0)
    expect(result[49]).toBe(49)
  })

  it('returns array with sequential indices', () => {
    const result = generatePaginationButtons(7)
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(i)
    }
  })

  it('handles negative numbers gracefully', () => {
    const result = generatePaginationButtons(-1)
    expect(result).toEqual([])
  })

  it('handles decimal numbers by truncating', () => {
    const result = generatePaginationButtons(3.7)
    expect(result).toEqual([0, 1, 2])
  })
})

