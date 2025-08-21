import { calculatePagination } from '../pagination'
import { ITEMS_PER_PAGE } from '@/constants/pagination'

describe('calculatePagination', () => {
  it('calculates pagination for first page with full results', () => {
    const totalCount = 25
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(3)
    expect(result.totalCount).toBe(25)
    expect(result.hasNextPage).toBe(true)
    expect(result.hasPreviousPage).toBe(false)
  })

  it('calculates pagination for middle page', () => {
    const totalCount = 25
    const currentPage = 2

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(2)
    expect(result.totalPages).toBe(3)
    expect(result.totalCount).toBe(25)
    expect(result.hasNextPage).toBe(true)
    expect(result.hasPreviousPage).toBe(true)
  })

  it('calculates pagination for last page', () => {
    const totalCount = 25
    const currentPage = 3

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(3)
    expect(result.totalPages).toBe(3)
    expect(result.totalCount).toBe(25)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPreviousPage).toBe(true)
  })

  it('handles single page results', () => {
    const totalCount = 5
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(1)
    expect(result.totalCount).toBe(5)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPreviousPage).toBe(false)
  })

  it('handles empty results', () => {
    const totalCount = 0
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(0)
    expect(result.totalCount).toBe(0)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPreviousPage).toBe(false)
  })

  it('handles exact page boundary results', () => {
    const totalCount = ITEMS_PER_PAGE // 10
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(1)
    expect(result.totalCount).toBe(10)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPreviousPage).toBe(false)
  })

  it('handles results just over page boundary', () => {
    const totalCount = ITEMS_PER_PAGE + 1 // 11
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(2)
    expect(result.totalCount).toBe(11)
    expect(result.hasNextPage).toBe(true)
    expect(result.hasPreviousPage).toBe(false)
  })

  it('handles large total counts', () => {
    const totalCount = 1000
    const currentPage = 50

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(50)
    expect(result.totalPages).toBe(100)
    expect(result.totalCount).toBe(1000)
    expect(result.hasNextPage).toBe(true)
    expect(result.hasPreviousPage).toBe(true)
  })

  it('handles current page greater than total pages', () => {
    const totalCount = 15
    const currentPage = 5

    const result = calculatePagination(totalCount, currentPage)

    expect(result.currentPage).toBe(5)
    expect(result.totalPages).toBe(2)
    expect(result.totalCount).toBe(15)
    expect(result.hasNextPage).toBe(false)
    expect(result.hasPreviousPage).toBe(true)
  })

  it('returns correct pagination object structure', () => {
    const totalCount = 30
    const currentPage = 2

    const result = calculatePagination(totalCount, currentPage)

    expect(result).toHaveProperty('currentPage')
    expect(result).toHaveProperty('totalPages')
    expect(result).toHaveProperty('totalCount')
    expect(result).toHaveProperty('hasNextPage')
    expect(result).toHaveProperty('hasPreviousPage')
    expect(Object.keys(result)).toHaveLength(5)
  })

  it('calculates total pages correctly using Math.ceil', () => {
    const totalCount = 23
    const currentPage = 1

    const result = calculatePagination(totalCount, currentPage)

    // 23 items / 10 per page = 2.3, should round up to 3 pages
    expect(result.totalPages).toBe(3)
  })
})
