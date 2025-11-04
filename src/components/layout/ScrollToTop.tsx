import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top when navigating to sign-in or sign-up pages
    if (pathname === '/auth/signin' || pathname === '/auth/signup') {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

