import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroSection } from '../index'
import { HERO_SECTION_CONSTANTS } from '../constants'

describe('HeroSection', () => {
  const defaultProps = {
    title: undefined,
    description: undefined,
    showButtons: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays default title and description when none provided', () => {
    render(<HeroSection {...defaultProps} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      HERO_SECTION_CONSTANTS.DEFAULT_TITLE
    )
    expect(
      screen.getByText(HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION)
    ).toBeInTheDocument()
  })

  it('displays custom title and description when provided', () => {
    const customTitle = 'Custom Hero Title'
    const customDescription = 'Custom hero description'

    render(
      <HeroSection
        {...defaultProps}
        title={customTitle}
        description={customDescription}
      />
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      customTitle
    )
    expect(screen.getByText(customDescription)).toBeInTheDocument()
  })

  it('shows buttons when showButtons is true', () => {
    render(<HeroSection {...defaultProps} showButtons={true} />)

    expect(
      screen.getByRole('button', {
        name: HERO_SECTION_CONSTANTS.PRIMARY_BUTTON_TEXT
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: HERO_SECTION_CONSTANTS.SECONDARY_BUTTON_TEXT
      })
    ).toBeInTheDocument()
  })

  it('hides buttons when showButtons is false', () => {
    render(<HeroSection {...defaultProps} showButtons={false} />)

    expect(
      screen.queryByRole('button', {
        name: HERO_SECTION_CONSTANTS.PRIMARY_BUTTON_TEXT
      })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: HERO_SECTION_CONSTANTS.SECONDARY_BUTTON_TEXT
      })
    ).not.toBeInTheDocument()
  })

  it('shows buttons by default when showButtons prop is not provided', () => {
    render(<HeroSection title='Test' description='Test' />)

    expect(
      screen.getByRole('button', {
        name: HERO_SECTION_CONSTANTS.PRIMARY_BUTTON_TEXT
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: HERO_SECTION_CONSTANTS.SECONDARY_BUTTON_TEXT
      })
    ).toBeInTheDocument()
  })

  it('has correct semantic structure', () => {
    render(<HeroSection {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 1 })
    const description = screen.getByText(
      HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION
    )

    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(heading.tagName).toBe('H1')
  })

  it('has accessible button structure', () => {
    render(<HeroSection {...defaultProps} />)

    const primaryButton = screen.getByRole('button', {
      name: HERO_SECTION_CONSTANTS.PRIMARY_BUTTON_TEXT
    })
    const secondaryButton = screen.getByRole('button', {
      name: HERO_SECTION_CONSTANTS.SECONDARY_BUTTON_TEXT
    })

    expect(primaryButton).toBeInTheDocument()
    expect(secondaryButton).toBeInTheDocument()
    expect(primaryButton).toBeEnabled()
    expect(secondaryButton).toBeEnabled()
  })
})
