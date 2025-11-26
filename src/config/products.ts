/**
 * Product Configuration
 * 
 * Product details including weights for shipping calculations
 */

import type { ProductType } from './pricing'

export interface ProductDetails {
  id: ProductType
  name: string
  weight: number // in pounds (for shipping calculations)
  description?: string
}

// Product details with weights
export const PRODUCT_DETAILS: Record<ProductType, ProductDetails> = {
  mini: {
    id: 'mini',
    name: 'AC Drain Wiz Mini',
    weight: 0.5, // 0.5 lbs
    description: 'Flagship compact maintenance manifold',
  },
  sensor: {
    id: 'sensor',
    name: 'AC Drain Wiz Sensor',
    weight: 0.3, // 0.3 lbs
    description: 'No-contact capacitive water-level sensor',
  },
  bundle: {
    id: 'bundle',
    name: 'AC Drain Wiz Mini + Sensor Bundle',
    weight: 0.8, // 0.8 lbs (mini + sensor combined)
    description: 'Complete protection system',
  },
}

/**
 * Get product weight
 * @param product - Product type
 * @returns Weight in pounds
 */
export function getProductWeight(product: ProductType): number {
  return PRODUCT_DETAILS[product].weight
}

/**
 * Calculate total weight for an order
 * @param product - Product type
 * @param quantity - Number of units
 * @returns Total weight in pounds
 */
export function calculateTotalWeight(product: ProductType, quantity: number): number {
  return getProductWeight(product) * quantity
}

