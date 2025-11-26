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

export function AuthProvider({ children }: { children: ReactNode }) {
  // ClerkProvider should always be present (see main.tsx)
  // These hooks will work as long as ClerkProvider wraps this component
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
    // Clerk handles login via their SignIn component
    // This is a placeholder - actual login happens in SignInPage
    throw new Error('Use Clerk SignIn component for login')
  }

  const signup = async (_data: SignupData) => {
    // Clerk handles signup via their SignUp component
    // This is a placeholder - actual signup happens in SignUpPage
    throw new Error('Use Clerk SignUp component for signup')
  }

  const logout = async () => {
    await signOut()
  }

  const refreshToken = async () => {
    // Clerk handles token refresh automatically
    // No action needed
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
