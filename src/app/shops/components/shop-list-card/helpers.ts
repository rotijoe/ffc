
export function formatAddress(address: string | null, postcode: string): string {
    if (!address) return 'Address not available'
    return `${address.trim()}, ${postcode?.trim()}`
  }
  
  export function formatBusinessName(name: string | null): string {
    if (!name) return 'Name not available'
    return name.trim()
  }
  
  export function formatDistance(distance: number | undefined): string {
    if (!distance) return ''
    if (distance < 0.1) return '< 0.1 mi'
    return `${distance.toFixed(1)} mi`
  }