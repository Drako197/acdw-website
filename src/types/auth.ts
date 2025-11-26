/**
 * Authentication Types
 * 
 * Defines user roles, authentication state, and JWT token structure
 */

export type UserRole = 'homeowner' | 'hvac_pro' | 'property_manager'

export interface User {
  id: string
  email: string
  role: UserRole
  company?: string
  name?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface JWTPayload {
  sub: string // User ID
  email: string
  app_metadata: {
    role: UserRole
    company?: string
  }
  exp: number // Expiration timestamp
  iat: number // Issued at timestamp
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  role: UserRole
  company?: string
  name?: string
}

