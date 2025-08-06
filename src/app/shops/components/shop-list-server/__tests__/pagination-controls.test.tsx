import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import { PaginationControls } from '../pagination-controls'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}))

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>

describe('PaginationControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    })
    mockUseSearchParams.mockReturnValue({
      toString: () => '',
      get: () => null,
      has: () => false,
      getAll: () => [],
      keys: () => [][Symbol.iterator](),
      values: () => [][Symbol.iterator](),
      entries: () => [][Symbol.iterator](),
      forEach: () => {},
      append: () => {},
      delete: () => {},
      set: () => {},
      sort: () => {}
    } as URLSearchParams)
  })

  const mockPagination = {
    currentPage: 2,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPreviousPage: true
  }

  it('renders pagination controls correctly', () => {
    render(<PaginationControls pagination={mockPagination} />)

    expect(
      screen.getByText('Showing 11 to 20 of 50 results')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Previous/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('bg-primary')
  })

  it('does not render when totalPages is 1', () => {
    const singlePagePagination = {
      ...mockPagination,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }

    const { container } = render(
      <PaginationControls pagination={singlePagePagination} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('navigates to previous page', () => {
    render(<PaginationControls pagination={mockPagination} />)

    fireEvent.click(screen.getByRole('button', { name: /Previous/ }))

    expect(mockPush).toHaveBeenCalledWith('/shops')
  })

  it('navigates to next page', () => {
    render(<PaginationControls pagination={mockPagination} />)

    fireEvent.click(screen.getByRole('button', { name: /Next/ }))

    expect(mockPush).toHaveBeenCalledWith('/shops?page=3')
  })

  it('navigates to specific page', () => {
    render(<PaginationControls pagination={mockPagination} />)

    fireEvent.click(screen.getByRole('button', { name: '4' }))

    expect(mockPush).toHaveBeenCalledWith('/shops?page=4')
  })

  it('disables previous button on first page', () => {
    const firstPagePagination = {
      ...mockPagination,
      currentPage: 1,
      hasPreviousPage: false
    }

    render(<PaginationControls pagination={firstPagePagination} />)

    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const lastPagePagination = {
      ...mockPagination,
      currentPage: 5,
      hasNextPage: false
    }

    render(<PaginationControls pagination={lastPagePagination} />)

    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()
  })

  it('preserves existing search params', () => {
    mockUseSearchParams.mockReturnValue({
      toString: () => 'search=chicken&filter=rating',
      get: (key: string) => {
        if (key === 'search') return 'chicken'
        if (key === 'filter') return 'rating'
        return null
      },
      has: () => true,
      getAll: () => [],
      keys: () => [][Symbol.iterator](),
      values: () => [][Symbol.iterator](),
      entries: () => [][Symbol.iterator](),
      forEach: () => {},
      append: () => {},
      delete: () => {},
      set: () => {},
      sort: () => {}
    } as URLSearchParams)

    render(<PaginationControls pagination={mockPagination} />)

    fireEvent.click(screen.getByRole('button', { name: /Next/ }))

    expect(mockPush).toHaveBeenCalledWith(
      '/shops?search=chicken&filter=rating&page=3'
    )
  })
})
