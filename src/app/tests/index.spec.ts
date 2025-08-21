import Home from '../page'
import RootLayout, { metadata } from '../layout'

describe('App Module', () => {
  it('exports Home component', () => {
    expect(typeof Home).toBe('function')
    expect(Home.name).toBe('Home')
  })

  it('exports RootLayout component', () => {
    expect(typeof RootLayout).toBe('function')
    expect(RootLayout.name).toBe('RootLayout')
  })

  it('exports metadata object', () => {
    expect(metadata).toBeDefined()
    expect(typeof metadata).toBe('object')
  })

  it('Home component is a React functional component', () => {
    expect(Home.length).toBe(0) // No props parameter
    expect(typeof Home()).toBe('object') // Returns JSX
  })

  it('RootLayout component accepts children prop', () => {
    expect(RootLayout.length).toBe(1) // One props parameter
  })

  it('metadata has required properties', () => {
    expect(metadata).toHaveProperty('title')
    expect(metadata).toHaveProperty('description')
  })

  it('components are properly structured for Next.js', () => {
    // Home should be a default export function
    expect(typeof Home).toBe('function')
    
    // RootLayout should be a default export function
    expect(typeof RootLayout).toBe('function')
    
    // metadata should be a named export
    expect(metadata).toBeDefined()
  })

  it('components follow Next.js App Router conventions', () => {
    // Home component should not require props
    const homeResult = Home()
    expect(homeResult).toBeDefined()
    expect(typeof homeResult).toBe('object')
    
    // RootLayout should accept children
    const layoutProps = { children: null }
    const layoutResult = RootLayout(layoutProps)
    expect(layoutResult).toBeDefined()
    expect(typeof layoutResult).toBe('object')
  })
})
