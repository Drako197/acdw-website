/**
 * Checkout Success Page
 * 
 * Displayed after successful Stripe checkout completion
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircleIcon, ArrowRightIcon, DocumentTextIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface OrderDetails {
  sessionId: string
  amountTotal: number
  currency: string
  paymentStatus: string
  shipping: {
    name: string
    address: ShippingAddress
  } | null
  lineItems?: Array<{
    description: string
    quantity: number
    amount: number
  }>
}

export function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      
      // Fetch order details from Stripe
      fetch(`/.netlify/functions/get-checkout-session?session_id=${sessionIdParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error('Error fetching order details:', data.error)
          } else {
            setOrderDetails(data)
          }
        })
        .catch((error) => {
          console.error('Error fetching order details:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-container">
          <div className="checkout-success-content">
            <div className="checkout-success-icon-wrapper">
              <CheckCircleIcon className="checkout-success-icon" />
            </div>
            <h1 className="checkout-success-title">Loading order details...</h1>
          </div>
        </div>
      </div>
    )
  }

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
              {orderDetails && (
                <>
                  <p className="checkout-success-order-label" style={{ marginTop: '1rem' }}>
                    Total Amount:
                  </p>
                  <p className="checkout-success-order-amount">
                    ${orderDetails.amountTotal.toFixed(2)} {orderDetails.currency.toUpperCase()}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Shipping Address */}
          {orderDetails?.shipping && (
            <div className="checkout-success-shipping-info">
              <h3 className="checkout-success-shipping-title">
                <TruckIcon className="checkout-success-shipping-icon" />
                Shipping Address
              </h3>
              <div className="checkout-success-shipping-address">
                <p className="checkout-success-shipping-name">{orderDetails.shipping.name}</p>
                <p>{orderDetails.shipping.address.line1}</p>
                {orderDetails.shipping.address.line2 && (
                  <p>{orderDetails.shipping.address.line2}</p>
                )}
                <p>
                  {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state}{' '}
                  {orderDetails.shipping.address.postal_code}
                </p>
                <p>{orderDetails.shipping.address.country}</p>
              </div>
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

