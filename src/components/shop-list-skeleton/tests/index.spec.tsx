import { render, screen } from '@testing-library/react'
import { ShopListSkeleton } from '../index'
import { SKELETON_CONFIG } from '../constants'

describe('ShopListSkeleton', () => {
  it('displays skeleton loading state that users can see', () => {
    render(<ShopListSkeleton />)

    // Test that skeleton cards are visible to users
    const skeletonCards = screen.getAllByRole('article')
    expect(skeletonCards).toHaveLength(SKELETON_CONFIG.CARD_COUNT)

    // Test that each card has the loading animation
    skeletonCards.forEach((card) => {
      expect(card).toHaveClass('animate-pulse')
    })

    // Test that skeleton content is visible (gray loading bars)
    const loadingBars = screen.getAllByTestId('skeleton-content')
    expect(loadingBars.length).toBeGreaterThan(0)
  })

  it('displays skeleton pagination that users can see', () => {
    render(<ShopListSkeleton />)

    // Test that pagination skeleton elements are visible
    const paginationContainer = screen.getByTestId('skeleton-pagination')
    expect(paginationContainer).toBeInTheDocument()

    // Test that pagination buttons skeleton is visible
    const paginationButtons = screen.getAllByTestId(
      'skeleton-pagination-button'
    )
    expect(paginationButtons).toHaveLength(
      SKELETON_CONFIG.PAGINATION_BUTTON_COUNT
    )
  })

  it('provides accessible loading state for screen readers', () => {
    render(<ShopListSkeleton />)

    // Test that the loading state is announced to screen readers
    const loadingAnnouncement = screen.getByText(/loading shops, please wait/i)
    expect(loadingAnnouncement).toBeInTheDocument()
  })
})
