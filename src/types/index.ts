// Define our own types for the application
export type UserRole = 'HOMEOWNER' | 'HVAC_PROFESSIONAL' | 'CITY_OFFICIAL' | 'ADMIN'
export type ProductCategory = 'DRAIN_WIZ_1_0' | 'DRAIN_WIZ_MINI' | 'DRAIN_WIZ_SENSOR'
export type CustomerType = 'homeowner' | 'hvac-professional' | 'city-official'

export interface CustomerTypeConfig {
  type: CustomerType
  title: string
  description: string
  features: string[]
  cta: string
  pricing: 'retail' | 'pro' | 'contact'
}

