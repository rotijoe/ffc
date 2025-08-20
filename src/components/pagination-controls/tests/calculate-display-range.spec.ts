import { calculateDisplayRange } from '../helpers'

describe('calculateDisplayRange', () => {
  it('calculates correct range for first page', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: true,
      hasPreviousPage: false
    }

    const result = calculateDisplayRange(pagination, 10)

    expect(result).toEqual({
      start: 1,
      end: 10,
      total: 50
    })
  })

  it('calculates correct range for middle page', () => {
    const pagination = {
      currentPage: 3,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = calculateDisplayRange(pagination, 10)

    expect(result).toEqual({
      start: 21,
      end: 30,
      total: 50
    })
  })

  it('calculates correct range for last page', () => {
    const pagination = {
      currentPage: 5,
      totalPages: 5,
      totalCount: 50,
      hasNextPage: false,
      hasPreviousPage: true
    }

    const result = calculateDisplayRange(pagination, 10)

    expect(result).toEqual({
      start: 41,
      end: 50,
      total: 50
    })
  })

  it('handles custom items per page', () => {
    const pagination = {
      currentPage: 2,
      totalPages: 5,
      totalCount: 25,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = calculateDisplayRange(pagination, 5)

    expect(result).toEqual({
      start: 6,
      end: 10,
      total: 25
    })
  })

  it('handles edge case where end exceeds total count', () => {
    const pagination = {
      currentPage: 5,
      totalPages: 5,
      totalCount: 42,
      hasNextPage: false,
      hasPreviousPage: true
    }

    const result = calculateDisplayRange(pagination, 10)

    expect(result).toEqual({
      start: 41,
      end: 42,
      total: 42
    })
  })

  it('uses default items per page when not provided', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 2,
      totalCount: 20,
      hasNextPage: true,
      hasPreviousPage: false
    }

    const result = calculateDisplayRange(pagination)

    expect(result).toEqual({
      start: 1,
      end: 10,
      total: 20
    })
  })
})
