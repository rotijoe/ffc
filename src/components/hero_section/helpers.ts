import type { HeroSectionProps } from './types'
import { HERO_SECTION_CONSTANTS } from './constants'

export function getHeroContent(props: HeroSectionProps) {
  return {
    title: props.title || HERO_SECTION_CONSTANTS.DEFAULT_TITLE,
    description: props.description || HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION,
    showButtons: props.showButtons ?? true,
  }
}

export function validateHeroProps(props: HeroSectionProps): boolean {
  return typeof props === 'object' && props !== null
}