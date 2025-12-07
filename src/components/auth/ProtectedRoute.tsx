/**
 * Protected Route Component
 * 
 * Secures routes based on authentication and role requirements.
 * 
 * SECURITY: Always validates role server-side. This is just UI protection.
 */

import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  requireAuth?: boolean
  fallback?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  fallback = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, sessionError, isSessionValid } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check for session expiration
  if (sessionError || (requireAuth && !isSessionValid())) {
    console.warn('🔒 Session invalid, redirecting to login:', sessionError)
    // Save the attempted location for redirect after login
    return (
      <Navigate 
        to={fallback} 
        state={{ 
          from: location,
          message: sessionError || 'Your session has expired. Please sign in again.'
        }} 
        replace 
      />
    )
  }

  // Require authentication
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  // Require specific role(s)
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.role)) {
      // User doesn't have required role - redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />
    }
  }

  // User is authenticated and has required role
  return <>{children}</>
}

/**
 * Public Route Component
 * Redirects authenticated users away from public pages (like login)
 */
export function PublicRoute({
  children,
  redirectTo = '/dashboard',
}: {
  children: ReactNode
  redirectTo?: string
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
