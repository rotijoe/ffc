
import { DEFAULT_VALUES, DISTANCE_THRESHOLDS } from './constants'

export function formatAddress(address: string | null, postcode: string | null): string {
  if (!address) return DEFAULT_VALUES.ADDRESS
  if (!postcode) return address.trim()
  return `${address.trim()}, ${postcode.trim()}`
}

export function formatBusinessName(name: string | null): string {
  if (!name) return DEFAULT_VALUES.BUSINESS_NAME
  return name.trim()
}

export function formatDistance(distance: number | undefined): string {
  if (!distance) return ''
  if (distance < DISTANCE_THRESHOLDS.MIN_DISPLAY) return '< 0.1 mi'
  return `${distance.toFixed(1)} mi`
}