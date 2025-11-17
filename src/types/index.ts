// Define our own types for the application
export type UserRole = 'HOMEOWNER' | 'HVAC_PROFESSIONAL' | 'PROPERTY_MANAGER' | 'CITY_OFFICIAL' | 'ADMIN'
export type ProductCategory = 'DRAIN_WIZ_1_0' | 'DRAIN_WIZ_MINI' | 'DRAIN_WIZ_SENSOR'
export type CustomerType = 'homeowner' | 'hvac-professional' | 'property-manager' | 'city-official'

export interface User {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  password?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface CustomerTypeConfig {
  type: CustomerType
  title: string
  description: string
  features: string[]
  cta: string
  pricing: 'retail' | 'pro' | 'contact'
}

