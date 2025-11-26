/**
 * Checkout Cancel Page
 * 
 * Displayed when user cancels Stripe checkout
 */

import { useNavigate } from 'react-router-dom'
import { XCircleIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export function CheckoutCancelPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

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

          {/* Action Buttons */}
          <div className="checkout-cancel-actions">
            <button
              onClick={() => navigate(user?.role === 'hvac_pro' ? '/business/pro/catalog' : '/products')}
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
          </div>
        </div>
      </div>
    </div>
  )
}

