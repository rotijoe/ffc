import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShopsSearch } from '../index'
import { DEFAULT_PLACEHOLDER } from '../constants'

describe('ShopsSearch', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: undefined
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses default placeholder when none provided', () => {
    render(<ShopsSearch {...defaultProps} />)

    const searchInput = screen.getByRole('searchbox', { name: /search shops/i })
    expect(searchInput).toHaveAttribute('placeholder', DEFAULT_PLACEHOLDER)
  })

  it('uses custom placeholder when provided', () => {
    const customPlaceholder = 'Custom search placeholder'
    render(<ShopsSearch {...defaultProps} placeholder={customPlaceholder} />)

    const searchInput = screen.getByRole('searchbox', { name: /search shops/i })
    expect(searchInput).toHaveAttribute('placeholder', customPlaceholder)
  })

  it('calls onChange when user types', async () => {
    const mockOnChange = jest.fn()

    render(<ShopsSearch {...defaultProps} onChange={mockOnChange} />)

    const searchInput = screen.getByRole('searchbox', { name: /search shops/i })
    await userEvent.type(searchInput, 'c')

    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('c')
  })

  it('has correct accessibility attributes', () => {
    render(<ShopsSearch {...defaultProps} />)

    const searchInput = screen.getByRole('searchbox', { name: /search shops/i })
    expect(searchInput).toHaveAttribute('type', 'search')
    expect(searchInput).toHaveAttribute('aria-label', 'Search shops')
    expect(searchInput).toHaveAttribute('autoComplete', 'off')
  })
})
