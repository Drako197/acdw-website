import { useState, useEffect } from 'react'

/**
 * Hook to fetch and manage CSRF token for form submissions
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
        
        if (isDevelopment) {
          // In development, use a mock token
          setCsrfToken('dev-token-' + Date.now())
          setIsLoading(false)
          return
        }
        
        const response = await fetch('/.netlify/functions/generate-csrf-token', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          const data = await response.json()
          setCsrfToken(data.token)
        } else {
          console.warn('Failed to fetch CSRF token, continuing without it')
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
        // Continue without token (fail open)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCsrfToken()
  }, [])
  
  return { csrfToken, isLoading }
}

