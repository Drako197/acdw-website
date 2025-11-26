import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

const baseNavigation = [
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Sensor Monitoring', href: 'https://monitor.acdrainwiz.com/login', external: true },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  // Build navigation array with Dashboard first when authenticated
  const navigation = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        ...baseNavigation,
      ]
    : baseNavigation

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    if (href === '/dashboard') {
      return location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/business/pro')
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="header-main-container">
      <nav className="header-navigation-wrapper" aria-label="Top">
        <div className="header-content-layout">
          {/* Logo */}
          <div className="header-logo-section">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/"} 
              className="header-logo-link"
            >
              <img 
                src="/images/ac-drain-wiz-logo.png" 
                alt="AC Drain Wiz Logo" 
                className="header-logo-image"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="header-desktop-navigation">
            {navigation.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-nav-link"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`header-nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right side actions */}
          <div className="header-actions-section">
            {/* Cart - visible on all screen sizes */}
            <button className="header-cart-button">
              <ShoppingCartIcon className="header-cart-icon" />
            </button>
            
            {/* User menu - Desktop only */}
            {isAuthenticated ? (
              <div className="header-user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="header-user-menu-button"
                >
                  <UserCircleIcon className="header-user-icon" />
                  <span className="header-user-name">{user?.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="header-user-dropdown">
                    <Link
                      to="/dashboard"
                      className="header-user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="header-user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="header-user-dropdown-item"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Link
                  to="/auth/signin"
                  className="header-signin-link"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="header-signup-button"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="header-mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="header-mobile-menu-icon" />
              ) : (
                <Bars3Icon className="header-mobile-menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Slide-over panel */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="header-mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Slide-over panel */}
            <div className="header-mobile-menu-panel">
              {/* Header with logo and close button */}
              <div className="header-mobile-menu-header">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/"} 
                  className="header-mobile-menu-logo" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img 
                    src="/images/ac-drain-wiz-logo.png" 
                    alt="AC Drain Wiz Logo" 
                    className="header-mobile-menu-logo-image"
                  />
                </Link>
                <button
                  type="button"
                  className="header-mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="header-mobile-menu-close-icon" />
                </button>
              </div>
              
              {/* Navigation content */}
              <div className="header-mobile-menu-content">
                <nav className="header-mobile-nav">
                  {navigation.map((item) => (
                    item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="header-mobile-nav-item"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`header-mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </nav>
                
                {/* Auth section at bottom */}
                <div className="header-mobile-auth-section">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="header-mobile-auth-button"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="header-mobile-auth-button-secondary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                        className="header-mobile-signout-button"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/signin"
                        className="header-mobile-auth-button-secondary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/signup"
                        className="header-mobile-auth-button-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
