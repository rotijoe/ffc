import { render } from '@testing-library/react'
import RootLayout, { metadata } from '../layout'

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({
    className: 'mocked-inter-font'
  }))
}))

describe('RootLayout', () => {
  const mockChildren = <div data-testid='children'>Test Children</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns JSX with html element and correct lang attribute', () => {
    const result = RootLayout({ children: mockChildren })

    expect(result).toBeDefined()
    expect(result.type).toBe('html')
    expect(result.props.lang).toBe('en')
  })

  it('includes body element with Inter font className', () => {
    const result = RootLayout({ children: mockChildren })

    expect(result.props.children.type).toBe('body')
    expect(result.props.children.props.className).toBe('mocked-inter-font')
  })

  it('renders children inside body element', () => {
    const result = RootLayout({ children: mockChildren })

    expect(result.props.children.props.children).toBe(mockChildren)
  })

  it('handles different children content', () => {
    const customChildren = (
      <div>
        <h1>Custom Title</h1>
        <p>Custom content</p>
      </div>
    )

    const result = RootLayout({ children: customChildren })

    expect(result.props.children.props.children).toBe(customChildren)
  })

  it('has correct JSX structure', () => {
    const result = RootLayout({ children: mockChildren })

    // Check that it returns html element
    expect(result.type).toBe('html')
    expect(result.props.lang).toBe('en')

    // Check that body is nested inside html
    const bodyElement = result.props.children
    expect(bodyElement.type).toBe('body')
    expect(bodyElement.props.className).toBe('mocked-inter-font')
  })

  it('handles null children gracefully', () => {
    const result = RootLayout({ children: null })

    expect(result.props.children.props.children).toBeNull()
  })

  it('handles undefined children gracefully', () => {
    const result = RootLayout({ children: undefined })

    expect(result.props.children.props.children).toBeUndefined()
  })

  it('preserves children structure for multiple elements', () => {
    const multipleChildren = (
      <>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </>
    )

    const result = RootLayout({ children: multipleChildren })

    expect(result.props.children.props.children).toBe(multipleChildren)
  })
})

describe('metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined()
    expect(typeof metadata).toBe('object')
  })

  it('has correct title', () => {
    expect(metadata.title).toBe('FFC - Next.js App')
  })

  it('has correct description', () => {
    expect(metadata.description).toBe(
      'A Next.js application with ShadCN UI and Tailwind CSS'
    )
  })

  it('contains all required metadata fields', () => {
    expect(metadata).toHaveProperty('title')
    expect(metadata).toHaveProperty('description')
  })

  it('has string values for metadata fields', () => {
    expect(typeof metadata.title).toBe('string')
    expect(typeof metadata.description).toBe('string')
  })

  it('has non-empty metadata values', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
    expect(metadata.title!.length).toBeGreaterThan(0)
    expect(metadata.description!.length).toBeGreaterThan(0)
  })
})
