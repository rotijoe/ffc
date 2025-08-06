import { Button } from '@/components/ui/button'
import { HERO_SECTION_CONSTANTS } from './constants'
import type { HeroSectionProps } from './types'

export function HeroSection({
  title,
  description,
  showButtons = true
}: HeroSectionProps) {
  return (
    <div className='text-center mb-12'>
      <h1 className='text-4xl font-bold tracking-tight text-foreground mb-4'>
        {title || HERO_SECTION_CONSTANTS.DEFAULT_TITLE}
      </h1>
      <p className='text-xl text-muted-foreground mb-8'>
        {description || HERO_SECTION_CONSTANTS.DEFAULT_DESCRIPTION}
      </p>

      {showButtons && (
        <div className='flex gap-4 justify-center'>
          <Button size='lg'>
            {HERO_SECTION_CONSTANTS.PRIMARY_BUTTON_TEXT}
          </Button>
          <Button variant='outline' size='lg'>
            {HERO_SECTION_CONSTANTS.SECONDARY_BUTTON_TEXT}
          </Button>
        </div>
      )}
    </div>
  )
}
