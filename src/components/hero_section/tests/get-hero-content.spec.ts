import { getHeroContent } from '../helpers'
import { HERO_SECTION_CONSTANTS } from '../constants'

describe('getHeroContent', () => {
  it('returns default values when no props provided', () => {
    const result = getHeroContent({})

    expect(result).toEqual({
      title: HERO_SECTION_CONSTANTS.DEFAULT_TITLE,
      description: HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION,
      showButtons: true,
    })
  })

  it('returns custom values when provided', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom Description',
      showButtons: false
    }

    const result = getHeroContent(customProps)

    expect(result).toEqual({
      title: 'Custom Title',
      description: 'Custom Description',
      showButtons: false,
    })
  })

  it('handles partial props correctly', () => {
    const partialProps = {
      title: 'Custom Title'
    }

    const result = getHeroContent(partialProps)

    expect(result).toEqual({
      title: 'Custom Title',
      description: HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION,
      showButtons: true,
    })
  })

  it('handles null and undefined values', () => {
    const propsWithNulls = {
      title: null,
      description: undefined,
      showButtons: null
    } as any

    const result = getHeroContent(propsWithNulls)

    expect(result).toEqual({
      title: HERO_SECTION_CONSTANTS.DEFAULT_TITLE,
      description: HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION,
      showButtons: true,
    })
  })
})
