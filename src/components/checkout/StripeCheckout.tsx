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
}

export function StripeCheckout({ product, quantity, onError }: StripeCheckoutProps) {
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
        const error = await priceResponse.json()
        throw new Error(error.error || 'Failed to get price')
      }

      const { priceId, requiresContact } = await priceResponse.json()

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
        const error = await checkoutResponse.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { url } = await checkoutResponse.json()

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
      className="hvac-pro-checkout-button"
    >
      {isLoading ? 'Processing...' : 'Proceed to Checkout'}
    </button>
  )
}

