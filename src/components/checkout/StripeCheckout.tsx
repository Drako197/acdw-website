/**
 * Stripe Checkout Component
 * 
 * SECURITY: Never calculates prices client-side
 * Always gets Price ID from server
 */

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { ProductType } from '../../config/pricing'

interface StripeCheckoutProps {
  product: ProductType
  quantity: number
  onError?: (error: string) => void
  buttonText?: string
  className?: string
}

export function StripeCheckout({ product, quantity, onError, buttonText, className }: StripeCheckoutProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      onError?.('Please log in to continue')
      return
    }

    if (quantity < 1 || quantity > 500) {
      onError?.('Invalid quantity')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Get Price ID from server (validates role and calculates tier)
      const priceResponse = await fetch('/.netlify/functions/get-price-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          quantity,
          role: user.role,
        }),
      })

      if (!priceResponse.ok) {
        const errorData = await priceResponse.json()
        console.error('Price ID lookup failed:', {
          status: priceResponse.status,
          error: errorData,
          request: { product, quantity, role: user.role }
        })
        throw new Error(errorData.error || `Failed to get price (${priceResponse.status})`)
      }

      const priceData = await priceResponse.json()
      const { priceId, requiresContact } = priceData

      if (!priceId) {
        console.error('No Price ID returned:', priceData)
        throw new Error('No price ID received from server')
      }

      if (requiresContact) {
        onError?.('For quantities over 500, please contact sales')
        setIsLoading(false)
        return
      }

      // Step 2: Create Checkout Session
      const checkoutResponse = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          quantity,
          product,
          userEmail: user.email,
          userId: user.id,
        }),
      })

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json()
        console.error('Checkout session creation failed:', {
          status: checkoutResponse.status,
          error: errorData,
          request: { priceId, quantity, product }
        })
        
        // Show detailed error to user
        const errorMessage = errorData.details 
          ? `${errorData.error}\n\nDetails: ${errorData.details}`
          : errorData.error || `Failed to create checkout session (${checkoutResponse.status})`
        
        throw new Error(errorMessage)
      }

      const checkoutData = await checkoutResponse.json()
      const { url } = checkoutData

      if (!url) {
        console.error('No checkout URL returned:', checkoutData)
        throw new Error('No checkout URL received from server')
      }

      // Step 3: Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      onError?.(error.message || 'Checkout failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !user}
      className={className || "hvac-pro-checkout-button"}
    >
      {isLoading ? 'Processing...' : (buttonText || 'Proceed to Checkout')}
    </button>
  )
}

