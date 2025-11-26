/**
 * Checkout Success Page
 * 
 * Displayed after successful Stripe checkout completion
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircleIcon, ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      // TODO: Verify session with Stripe and fetch order details
    }
  }, [searchParams])

  return (
    <div className="checkout-success-page">
      <div className="checkout-success-container">
        <div className="checkout-success-content">
          {/* Success Icon */}
          <div className="checkout-success-icon-wrapper">
            <CheckCircleIcon className="checkout-success-icon" />
          </div>

          {/* Success Message */}
          <h1 className="checkout-success-title">Payment Successful!</h1>
          <p className="checkout-success-message">
            Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation shortly.
          </p>

          {/* Order Details */}
          {sessionId && (
            <div className="checkout-success-order-info">
              <p className="checkout-success-order-label">Order ID:</p>
              <p className="checkout-success-order-id">{sessionId}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="checkout-success-next-steps">
            <h2 className="checkout-success-next-steps-title">What's Next?</h2>
            <ul className="checkout-success-next-steps-list">
              <li>
                <DocumentTextIcon className="checkout-success-step-icon" />
                <span>Check your email for order confirmation and shipping details</span>
              </li>
              <li>
                <DocumentTextIcon className="checkout-success-step-icon" />
                <span>View your order history in your dashboard</span>
              </li>
              <li>
                <DocumentTextIcon className="checkout-success-step-icon" />
                <span>Access product documentation and support resources</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="checkout-success-actions">
            <button
              onClick={() => navigate('/dashboard')}
              className="checkout-success-button checkout-success-button-primary"
            >
              Go to Dashboard
              <ArrowRightIcon className="checkout-success-button-icon" />
            </button>
            <button
              onClick={() => navigate(user?.role === 'hvac_pro' ? '/business/pro/catalog' : '/products')}
              className="checkout-success-button checkout-success-button-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

