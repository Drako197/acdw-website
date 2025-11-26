/**
 * Authentication Utilities
 * 
 * Helper functions for authentication and role-based routing.
 */

import type { UserRole } from '../types/auth'

/**
 * Get the default redirect path based on user role
 */
export function getRoleBasedRedirect(role: UserRole | undefined): string {
  switch (role) {
    case 'hvac_pro':
      return '/business/pro/catalog'
    case 'property_manager':
      return '/business/property-manager/catalog'
    case 'homeowner':
    default:
      return '/dashboard'
  }
}

/**
 * Get the catalog route based on user role
 * (Same logic as DashboardPage.getCatalogRoute, extracted for reuse)
 */
export function getCatalogRoute(role: UserRole | undefined): string {
  return getRoleBasedRedirect(role)
}

