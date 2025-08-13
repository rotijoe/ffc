'use client'

import type { ShopsSearchProps } from './types'

export function ShopsSearch({
  value,
  onChange,
  placeholder
}: ShopsSearchProps) {
  return (
    <div className='w-full'>
      <input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          placeholder || 'Search by business name, address, or postcode'
        }
        className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        aria-label='Search shops'
        autoComplete='off'
      />
    </div>
  )
}
