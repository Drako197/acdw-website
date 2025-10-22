import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  company?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('acdw_token')
        const userData = localStorage.getItem('acdw_user')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('acdw_token')
        localStorage.removeItem('acdw_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual authentication logic
      const mockUser: User = {
        id: '1',
        name: 'John HVAC Pro',
        email: email,
        role: 'HVAC_PROFESSIONAL',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // In a real app, you'd validate credentials and get a token
      const token = 'mock_jwt_token_' + Date.now()
      
      localStorage.setItem('acdw_token', token)
      localStorage.setItem('acdw_user', JSON.stringify(mockUser))
      setUser(mockUser)
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user creation - replace with actual registration logic
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // In a real app, you'd create the user and get a token
      const token = 'mock_jwt_token_' + Date.now()
      
      localStorage.setItem('acdw_token', token)
      localStorage.setItem('acdw_user', JSON.stringify(newUser))
      setUser(newUser)
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('acdw_token')
    localStorage.removeItem('acdw_user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
