import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the HeroSection component
jest.mock('@/components/hero_section', () => ({
  HeroSection: () => <div data-testid='hero-section'>Hero Section</div>
}))

// Mock the UI card components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='card'>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='card-content'>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='card-description'>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='card-header'>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid='card-title'>{children}</h3>
  )
}))

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main container with correct styling', () => {
    const { container } = render(<Home />)

    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen', 'bg-background', 'p-8')
  })

  it('renders the content wrapper with correct styling', () => {
    const { container } = render(<Home />)

    const contentWrapper = container.querySelector('.max-w-4xl')
    expect(contentWrapper).toBeInTheDocument()
    expect(contentWrapper).toHaveClass('mx-auto')
  })

  it('renders the HeroSection component', () => {
    render(<Home />)

    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  it('renders the grid container with correct styling', () => {
    const { container } = render(<Home />)

    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass(
      'gap-6',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    )
  })

  it('renders three feature cards', () => {
    render(<Home />)

    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(3)
  })

  it('renders Next.js 15 feature card with correct content', () => {
    render(<Home />)

    expect(screen.getByText('Next.js 15')).toBeInTheDocument()
    expect(
      screen.getByText('The React framework for production with App Router')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Built with the latest Next.js features including Server Components and the App Router.'
      )
    ).toBeInTheDocument()
  })

  it('renders ShadCN UI feature card with correct content', () => {
    render(<Home />)

    expect(screen.getByText('ShadCN UI')).toBeInTheDocument()
    expect(
      screen.getByText('Beautiful and accessible components')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Copy and paste components built with Radix UI and Tailwind CSS.'
      )
    ).toBeInTheDocument()
  })

  it('renders Tailwind CSS feature card with correct content', () => {
    render(<Home />)

    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText('Utility-first CSS framework')).toBeInTheDocument()
    expect(
      screen.getByText('Rapidly build modern websites with utility classes.')
    ).toBeInTheDocument()
  })

  it('uses semantic HTML structure', () => {
    const { container } = render(<Home />)

    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()

    const cardTitles = screen.getAllByTestId('card-title')
    cardTitles.forEach((title) => {
      expect(title.tagName).toBe('H3')
    })
  })

  it('displays content in accessible text elements', () => {
    render(<Home />)

    // Check that descriptions are properly structured
    const cardDescriptions = screen.getAllByTestId('card-description')
    expect(cardDescriptions).toHaveLength(3)

    const cardContents = screen.getAllByTestId('card-content')
    expect(cardContents).toHaveLength(3)
  })

  it('applies correct text styling classes', () => {
    const { container } = render(<Home />)

    const mutedText = container.querySelectorAll('.text-muted-foreground')
    expect(mutedText).toHaveLength(3)

    const smallText = container.querySelectorAll('.text-sm')
    expect(smallText).toHaveLength(3)
  })
})
