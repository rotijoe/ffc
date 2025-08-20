import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaginationControls } from '../index'
import { BUTTON_TEXT } from '../constants'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams('?page=2&q=test')

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useSearchParams: () => mockSearchParams
}))

describe('PaginationControls', () => {
  const defaultPagination = {
    currentPage: 2,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPreviousPage: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when total pages is 1 or less', () => {
    const singlePagePagination = {
      ...defaultPagination,
      totalPages: 1
    }

    const { container } = render(
      <PaginationControls pagination={singlePagePagination} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('displays correct page information', () => {
    render(<PaginationControls pagination={defaultPagination} />)

    expect(
      screen.getByText(/showing 11 to 20 of 50 results/i)
    ).toBeInTheDocument()
  })

  it('shows previous and next buttons', () => {
    render(<PaginationControls pagination={defaultPagination} />)

    expect(
      screen.getByRole('button', { name: BUTTON_TEXT.PREVIOUS })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: BUTTON_TEXT.NEXT })
    ).toBeInTheDocument()
  })

  it('disables previous button when on first page', () => {
    const firstPagePagination = {
      ...defaultPagination,
      currentPage: 1,
      hasPreviousPage: false
    }

    render(<PaginationControls pagination={firstPagePagination} />)

    const previousButton = screen.getByRole('button', {
      name: BUTTON_TEXT.PREVIOUS
    })
    expect(previousButton).toBeDisabled()
  })

  it('disables next button when on last page', () => {
    const lastPagePagination = {
      ...defaultPagination,
      currentPage: 5,
      hasNextPage: false
    }

    render(<PaginationControls pagination={lastPagePagination} />)

    const nextButton = screen.getByRole('button', { name: BUTTON_TEXT.NEXT })
    expect(nextButton).toBeDisabled()
  })

  it('navigates to previous page when previous button is clicked', async () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const previousButton = screen.getByRole('button', {
      name: BUTTON_TEXT.PREVIOUS
    })
    await userEvent.click(previousButton)

    expect(mockPush).toHaveBeenCalledWith('/shops?q=test')
  })

  it('navigates to next page when next button is clicked', async () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const nextButton = screen.getByRole('button', { name: BUTTON_TEXT.NEXT })
    await userEvent.click(nextButton)

    expect(mockPush).toHaveBeenCalledWith('/shops?page=3&q=test')
  })

  it('shows current page as active', () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const currentPageButton = screen.getByRole('button', { name: '2' })
    expect(currentPageButton).toHaveClass('bg-primary')
  })

  it('navigates to specific page when page number is clicked', async () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const pageButton = screen.getByRole('button', { name: '3' })
    await userEvent.click(pageButton)

    expect(mockPush).toHaveBeenCalledWith('/shops?page=3&q=test')
  })

  it('shows ellipsis when there are many pages', () => {
    const manyPagesPagination = {
      ...defaultPagination,
      currentPage: 5,
      totalPages: 10
    }

    render(<PaginationControls pagination={manyPagesPagination} />)

    expect(screen.getAllByText(BUTTON_TEXT.ELLIPSIS)).toHaveLength(2)
  })

  it('removes page parameter when navigating to page 1', async () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const previousButton = screen.getByRole('button', {
      name: BUTTON_TEXT.PREVIOUS
    })
    await userEvent.click(previousButton)

    expect(mockPush).toHaveBeenCalledWith('/shops?q=test')
  })

  it('preserves other search parameters when navigating', async () => {
    const searchParamsWithMoreParams = new URLSearchParams(
      '?page=2&q=test&sort=name'
    )
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush
      }),
      useSearchParams: () => searchParamsWithMoreParams
    }))

    render(<PaginationControls pagination={defaultPagination} />)

    const nextButton = screen.getByRole('button', { name: BUTTON_TEXT.NEXT })
    await userEvent.click(nextButton)

    expect(mockPush).toHaveBeenCalledWith('/shops?page=3&q=test')
  })

  it('has accessible navigation structure', () => {
    render(<PaginationControls pagination={defaultPagination} />)

    const previousButton = screen.getByRole('button', {
      name: BUTTON_TEXT.PREVIOUS
    })
    const nextButton = screen.getByRole('button', { name: BUTTON_TEXT.NEXT })

    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
    expect(previousButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })
})
