import { getShops } from '../helpers'
import ShopsPage from '../page'

describe('Shops Page Module', () => {
  it('exports getShops helper function', () => {
    expect(typeof getShops).toBe('function')
  })

  it('exports ShopsPage component', () => {
    expect(typeof ShopsPage).toBe('function')
  })

  it('getShops is a function', () => {
    // Verify it's a function (React cache wrapper doesn't preserve name)
    expect(typeof getShops).toBe('function')
  })

  it('ShopsPage is an async function', () => {
    expect(ShopsPage.constructor.name).toBe('AsyncFunction')
  })
})
