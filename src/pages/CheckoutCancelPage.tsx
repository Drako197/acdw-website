/**
 * Checkout Cancel Page
 * 
 * Displayed when user cancels Stripe checkout
 * Shows different CTAs based on authentication status
 */

import { useNavigate } from 'react-router-dom'
import { XCircleIcon, ArrowLeftIcon, ShoppingCartIcon, HomeIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { getCatalogRoute } from '../utils/auth'

export function CheckoutCancelPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // Get catalog route based on user role
  // For homeowners, use products/mini instead of dashboard
  const getCatalogRouteForCancel = () => {
    if (!isAuthenticated || !user) return '/products/mini'
    
    if (user.role === 'homeowner') {
      return '/products/mini'
    }
    
    return getCatalogRoute(user.role)
  }

  return (
    <div className="checkout-cancel-page">
      <div className="checkout-cancel-container">
        <div className="checkout-cancel-content">
          {/* Cancel Icon */}
          <div className="checkout-cancel-icon-wrapper">
            <XCircleIcon className="checkout-cancel-icon" />
          </div>

          {/* Cancel Message */}
          <h1 className="checkout-cancel-title">Checkout Cancelled</h1>
          <p className="checkout-cancel-message">
            Your checkout session was cancelled. No charges were made to your account.
          </p>
          <p className="checkout-cancel-submessage">
            If you experienced any issues during checkout, please contact our support team for assistance.
          </p>

          {/* Help Section */}
          <div className="checkout-cancel-help">
            <h2 className="checkout-cancel-help-title">Need Help?</h2>
            <p className="checkout-cancel-help-text">
              Our team is here to help. If you have questions about pricing, quantities, or need assistance with your order, please don't hesitate to reach out.
            </p>
          </div>

          {/* Action Buttons - Different for authenticated vs guest users */}
          <div className="checkout-cancel-actions">
            {isAuthenticated ? (
              // Logged in users: Catalog, Support, Dashboard
              <>
                <button
                  onClick={() => navigate(getCatalogRouteForCancel())}
                  className="checkout-cancel-button checkout-cancel-button-primary"
                >
                  <ShoppingCartIcon className="checkout-cancel-button-icon" />
                  Return to Catalog
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="checkout-cancel-button checkout-cancel-button-secondary"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="checkout-cancel-button checkout-cancel-button-tertiary"
                >
                  <ArrowLeftIcon className="checkout-cancel-button-icon" />
                  Back to Dashboard
                </button>
              </>
            ) : (
              // Guest users: Products/Mini, Support, Landing Page
              <>
                <button
                  onClick={() => navigate('/products/mini')}
                  className="checkout-cancel-button checkout-cancel-button-primary"
                >
                  <ShoppingCartIcon className="checkout-cancel-button-icon" />
                  Return to Product Page
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="checkout-cancel-button checkout-cancel-button-secondary"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="checkout-cancel-button checkout-cancel-button-tertiary"
                >
                  <HomeIcon className="checkout-cancel-button-icon" />
                  Back to Home
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

