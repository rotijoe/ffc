import { generatePageNumbers } from '../helpers'

describe('generatePageNumbers', () => {
  it('generates page numbers for small total pages', () => {
    const pagination = {
      currentPage: 2,
      totalPages: 3,
      totalCount: 30,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, 2, 3])
  })

  it('generates page numbers with ellipsis at start', () => {
    const pagination = {
      currentPage: 5,
      totalPages: 10,
      totalCount: 100,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, '...', 3, 4, 5, 6, 7, '...', 10])
  })

  it('generates page numbers with ellipsis at end', () => {
    const pagination = {
      currentPage: 3,
      totalPages: 10,
      totalCount: 100,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, 2, 3, 4, 5, '...', 10])
  })

  it('generates page numbers with ellipsis at both ends', () => {
    const pagination = {
      currentPage: 6,
      totalPages: 10,
      totalCount: 100,
      hasNextPage: true,
      hasPreviousPage: true
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, '...', 4, 5, 6, 7, 8, '...', 10])
  })

  it('handles first page correctly', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 10,
      totalCount: 100,
      hasNextPage: true,
      hasPreviousPage: false
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, 2, 3, '...', 10])
  })

  it('handles last page correctly', () => {
    const pagination = {
      currentPage: 10,
      totalPages: 10,
      totalCount: 100,
      hasNextPage: false,
      hasPreviousPage: true
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, '...', 8, 9, 10])
  })

  it('handles single page', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 1,
      totalCount: 10,
      hasNextPage: false,
      hasPreviousPage: false
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1])
  })

  it('handles two pages', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 2,
      totalCount: 20,
      hasNextPage: true,
      hasPreviousPage: false
    }

    const result = generatePageNumbers(pagination)

    expect(result).toEqual([1, 2])
  })
})
