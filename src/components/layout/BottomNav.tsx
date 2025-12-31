import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  ShoppingBagIcon as ShoppingBagIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid'
import { useAuth } from '../../contexts/AuthContext'

export function BottomNav() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    if (href === '/dashboard') {
      return location.pathname.startsWith('/dashboard')
    }
    return location.pathname.startsWith(href)
  }

  // Don't show bottom nav on certain pages
  const hideBottomNav = location.pathname === '/checkout' || location.pathname === '/sensor-setup'

  if (hideBottomNav) {
    return null
  }

  const navItems = [
    {
      name: 'Home',
      href: isAuthenticated ? '/dashboard' : '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingBagIcon,
      iconSolid: ShoppingBagIconSolid,
    },
    {
      name: 'Support',
      href: '/support',
      icon: QuestionMarkCircleIcon,
      iconSolid: QuestionMarkCircleIconSolid,
    },
    {
      name: 'Cart',
      href: '/checkout',
      icon: ShoppingCartIcon,
      iconSolid: ShoppingCartIconSolid,
    },
    {
      name: isAuthenticated ? 'Account' : 'Sign In',
      href: isAuthenticated ? '/dashboard/profile' : '/auth/signin',
      icon: UserCircleIcon,
      iconSolid: UserCircleIconSolid,
    },
  ]

  return (
    <nav className="bottom-nav-container" aria-label="Bottom navigation">
      <div className="bottom-nav-content">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = active ? item.iconSolid : item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
              aria-label={item.name}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="bottom-nav-icon" aria-hidden="true" />
              <span className="bottom-nav-label">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

