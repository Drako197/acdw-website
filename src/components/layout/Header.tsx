import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Sensor Monitoring', href: 'https://monitor.acdrainwiz.com/login', external: true },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="header-main-container">
      <nav className="header-navigation-wrapper" aria-label="Top">
        <div className="header-content-layout">
          {/* Logo */}
          <div className="header-logo-section">
            <Link to="/" className="header-logo-link">
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
                  className="header-nav-link"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right side actions */}
          <div className="header-actions-section">
            {/* Cart */}
            <button className="header-cart-button">
              <ShoppingCartIcon className="header-cart-icon" />
            </button>
            
            {/* User menu */}
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu-container">
            <div className="header-mobile-menu-content">
              {navigation.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="header-mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              <div className="header-mobile-auth-section">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="header-mobile-auth-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
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
                      className="header-mobile-auth-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/signup"
                      className="header-mobile-signup-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
