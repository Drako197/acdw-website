/**
 * Authentication Context (Clerk-based)
 * 
 * Uses Clerk for authentication and role management.
 * 
 * SECURITY: Clerk handles JWT tokens, session management, and role validation.
 */

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import type { User, AuthState, LoginCredentials, SignupData } from '../types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  hasRole: (role: User['role']) => boolean
  hasAnyRole: (roles: User['role'][]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider that uses Clerk (only when ClerkProvider is present)
function AuthProviderWithClerk({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerkAuth()

  // Convert Clerk user to our User type
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        // Read role from unsafeMetadata (set during signup) or publicMetadata
        role: (clerkUser.unsafeMetadata?.role || clerkUser.publicMetadata?.role || 'homeowner') as User['role'],
        company: (clerkUser.unsafeMetadata?.company || clerkUser.publicMetadata?.company) as string | undefined,
        name: clerkUser.fullName || undefined,
      }
    : null

  const isAuthenticated = !!user
  const isLoading = !userLoaded

  const login = async (_credentials: LoginCredentials) => {
    throw new Error('Use Clerk SignIn component for login')
  }

  const signup = async (_data: SignupData) => {
    throw new Error('Use Clerk SignUp component for signup')
  }

  const logout = async () => {
    await signOut()
  }

  const refreshToken = async () => {
    // Clerk handles token refresh automatically
  }

  const hasRole = (role: User['role']): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: User['role'][]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error: null,
        login,
        signup,
        logout,
        refreshToken,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// AuthProvider without Clerk (fallback when ClerkProvider is not present)
function AuthProviderWithoutClerk({ children }: { children: ReactNode }) {
  const user: User | null = null
  const isAuthenticated = false
  const isLoading = false

  const login = async (_credentials: LoginCredentials) => {
    throw new Error('Authentication is not configured. Please set VITE_CLERK_PUBLISHABLE_KEY')
  }

  const signup = async (_data: SignupData) => {
    throw new Error('Authentication is not configured. Please set VITE_CLERK_PUBLISHABLE_KEY')
  }

  const logout = async () => {
    // No-op when Clerk is not available
  }

  const refreshToken = async () => {
    // No-op when Clerk is not available
  }

  const hasRole = (_role: User['role']): boolean => {
    return false
  }

  const hasAnyRole = (_roles: User['role'][]): boolean => {
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error: null,
        login,
        signup,
        logout,
        refreshToken,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Main AuthProvider that conditionally uses Clerk based on environment
export function AuthProvider({ children }: { children: ReactNode }) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  // Only use Clerk hooks if ClerkProvider is present (checked in main.tsx)
  // If clerkPubKey exists, ClerkProvider wraps App, so we can use Clerk hooks
  if (clerkPubKey) {
    return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>
  }
  
  // Fallback when Clerk is not configured
  return <AuthProviderWithoutClerk>{children}</AuthProviderWithoutClerk>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
