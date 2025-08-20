import { render, screen } from '@testing-library/react'
import { ShopCard } from '../index'

describe('ShopCard', () => {
  const defaultShop = {
    fhrs_id: 12345,
    business_name: 'Test Chicken Shop',
    address: '123 Test Street',
    postcode: 'TE1 1ST',
    latitude: 51.5074,
    longitude: -0.1278,
    distance_miles: undefined
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays business name correctly', () => {
    render(<ShopCard shop={defaultShop} />)

    expect(screen.getByText('Test Chicken Shop')).toBeInTheDocument()
  })

  it('displays formatted address with postcode', () => {
    render(<ShopCard shop={defaultShop} />)

    expect(screen.getByText('123 Test Street, TE1 1ST')).toBeInTheDocument()
  })

  it('displays distance when available', () => {
    const shopWithDistance = {
      ...defaultShop,
      distance_miles: 2.5
    }

    render(<ShopCard shop={shopWithDistance} />)

    expect(screen.getByText('2.5 mi')).toBeInTheDocument()
    expect(screen.getByText(/2\.5 mi/)).toBeInTheDocument()
  })

  it('does not display distance section when distance is not available', () => {
    render(<ShopCard shop={defaultShop} />)

    expect(screen.queryByText(/mi/)).not.toBeInTheDocument()
  })

  it('displays distance icon when distance is available', () => {
    const shopWithDistance = {
      ...defaultShop,
      distance_miles: 1.2
    }

    render(<ShopCard shop={shopWithDistance} />)

    const distanceSection = screen.getByText('1.2 mi')
    expect(distanceSection).toBeInTheDocument()
    expect(distanceSection.closest('div')).toHaveClass('flex items-center')
  })

  it('handles null business name gracefully', () => {
    const shopWithNullName = {
      ...defaultShop,
      business_name: null
    }

    render(<ShopCard shop={shopWithNullName} />)

    expect(screen.getByText('Name not available')).toBeInTheDocument()
  })

  it('handles null address gracefully', () => {
    const shopWithNullAddress = {
      ...defaultShop,
      address: null
    }

    render(<ShopCard shop={shopWithNullAddress} />)

    expect(screen.getByText('Address not available')).toBeInTheDocument()
  })

  it('handles null postcode gracefully', () => {
    const shopWithNullPostcode = {
      ...defaultShop,
      postcode: null
    }

    render(<ShopCard shop={shopWithNullPostcode} />)

    expect(screen.getByText('123 Test Street')).toBeInTheDocument()
  })

  it('handles empty strings gracefully', () => {
    const shopWithEmptyStrings = {
      ...defaultShop,
      business_name: '',
      address: '',
      postcode: ''
    }

    render(<ShopCard shop={shopWithEmptyStrings} />)

    expect(screen.getByText('Name not available')).toBeInTheDocument()
    expect(screen.getByText('Address not available')).toBeInTheDocument()
  })

  it('formats very small distances correctly', () => {
    const shopWithSmallDistance = {
      ...defaultShop,
      distance_miles: 0.05
    }

    render(<ShopCard shop={shopWithSmallDistance} />)

    expect(screen.getByText('< 0.1 mi')).toBeInTheDocument()
  })

  it('formats larger distances correctly', () => {
    const shopWithLargeDistance = {
      ...defaultShop,
      distance_miles: 15.7
    }

    render(<ShopCard shop={shopWithLargeDistance} />)

    expect(screen.getByText('15.7 mi')).toBeInTheDocument()
  })

  it('has correct semantic structure', () => {
    render(<ShopCard shop={defaultShop} />)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Test Chicken Shop')
  })

  it('trims whitespace from business name', () => {
    const shopWithWhitespace = {
      ...defaultShop,
      business_name: '  Test Chicken Shop  '
    }

    render(<ShopCard shop={shopWithWhitespace} />)

    expect(screen.getByText('Test Chicken Shop')).toBeInTheDocument()
  })

  it('trims whitespace from address', () => {
    const shopWithWhitespace = {
      ...defaultShop,
      address: '  123 Test Street  ',
      postcode: '  TE1 1ST  '
    }

    render(<ShopCard shop={shopWithWhitespace} />)

    expect(screen.getByText('123 Test Street, TE1 1ST')).toBeInTheDocument()
  })
})
