import { buildNavigationUrl } from '../helpers'

describe('buildNavigationUrl', () => {
  it('builds URL for page 1 without page parameter', () => {
    const searchParams = new URLSearchParams('?q=test&sort=name')
    const result = buildNavigationUrl(searchParams, 1)

    expect(result).toBe('/shops?q=test&sort=name')
  })

  it('builds URL for page 2 with page parameter', () => {
    const searchParams = new URLSearchParams('?q=test&sort=name')
    const result = buildNavigationUrl(searchParams, 2)

    expect(result).toBe('/shops?q=test&sort=name&page=2')
  })

  it('handles empty search params', () => {
    const searchParams = new URLSearchParams()
    const result = buildNavigationUrl(searchParams, 1)

    expect(result).toBe('/shops')
  })

  it('removes existing page parameter when navigating to page 1', () => {
    const searchParams = new URLSearchParams('?page=3&q=test')
    const result = buildNavigationUrl(searchParams, 1)

    expect(result).toBe('/shops?q=test')
  })

  it('preserves all other parameters when navigating', () => {
    const searchParams = new URLSearchParams('?page=2&q=test&sort=name&filter=active')
    const result = buildNavigationUrl(searchParams, 3)

    expect(result).toBe('/shops?page=3&q=test&sort=name&filter=active')
  })
})
