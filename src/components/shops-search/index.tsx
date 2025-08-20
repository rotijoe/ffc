'use client'

import { Input } from '@/components/ui/input'
import type { ShopsSearchProps } from './types'

export function ShopsSearch({
  value,
  onChange,
  placeholder
}: ShopsSearchProps) {
  return (
    <div className='w-full'>
      <Input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          placeholder || 'Search by business name, address, or postcode'
        }
        aria-label='Search shops'
        autoComplete='off'
      />
    </div>
  )
}
