import { render, screen } from '@testing-library/react'
import { ShopsSearch } from './index'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/shops',
  useSearchParams: () => new URLSearchParams('')
}))

describe('ShopsSearch', () => {
  it('renders input with placeholder', () => {
    render(<ShopsSearch />)
    expect(
      screen.getByRole('searchbox', {
        name: /search shops/i
      })
    ).toBeInTheDocument()
  })
})
