/**
 * Shipping Configuration
 * 
 * Zone-based shipping rates for US and Canada
 */

export type ShippingZone = 'US' | 'CA'

export interface ShippingRate {
  zone: ShippingZone
  name: string
  rate: number // in dollars
}

// Shipping rates by zone
export const SHIPPING_RATES: Record<ShippingZone, ShippingRate> = {
  US: {
    zone: 'US',
    name: 'United States',
    rate: 15.00, // $15 for US shipping
  },
  CA: {
    zone: 'CA',
    name: 'Canada',
    rate: 20.00, // $20 for Canada shipping
  },
}

/**
 * Get shipping rate for a country code
 * @param countryCode - ISO country code (e.g., 'US', 'CA')
 * @returns Shipping rate in dollars, or null if not supported
 */
export function getShippingRate(countryCode: string): number | null {
  const zone = countryCode.toUpperCase() as ShippingZone
  if (zone in SHIPPING_RATES) {
    return SHIPPING_RATES[zone].rate
  }
  return null // Country not supported
}

/**
 * Get shipping zone name
 * @param countryCode - ISO country code
 * @returns Zone name or null
 */
export function getShippingZoneName(countryCode: string): string | null {
  const zone = countryCode.toUpperCase() as ShippingZone
  if (zone in SHIPPING_RATES) {
    return SHIPPING_RATES[zone].name
  }
  return null
}

/**
 * Check if country is supported for shipping
 * @param countryCode - ISO country code
 * @returns true if shipping is available
 */
export function isShippingSupported(countryCode: string): boolean {
  const zone = countryCode.toUpperCase() as ShippingZone
  return zone in SHIPPING_RATES
}

