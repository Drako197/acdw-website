/**
 * Stripe Payment Element Component
 * 
 * Wraps Stripe's Payment Element for embedded checkout
 * Handles payment method collection and submission
 */

import { useEffect, useState } from 'react'
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Get Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set. Payment Element will not work.')
}

// Initialize Stripe
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

interface PaymentElementWrapperProps {
  clientSecret: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

/**
 * Inner component that uses Stripe hooks
 * Must be inside Elements provider
 */
function PaymentElementInner({ 
  clientSecret, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing,
  setIsProcessing 
}: PaymentElementWrapperProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return
    }

    // Verify client secret is valid
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent, error }) => {
      if (error) {
        setError(error.message || 'Failed to load payment form')
        onPaymentError(error.message || 'Failed to load payment form')
      } else if (paymentIntent) {
        // Payment Intent loaded successfully
        setError(null)
      }
    })
  }, [stripe, clientSecret, onPaymentError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsSubmitting(true)
    setIsProcessing(true)
    setError(null)

    try {
      // Extract payment intent ID from client secret for return URL
      // Client secret format: pi_xxx_secret_yyy
      const paymentIntentIdMatch = clientSecret.match(/^pi_([^_]+)/)
      const paymentIntentId = paymentIntentIdMatch ? paymentIntentIdMatch[0] : ''

      // Confirm payment with Stripe
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?payment_intent=${paymentIntentId}`,
        },
        redirect: 'if_required', // Only redirect if required (e.g., 3D Secure)
      })

      if (submitError) {
        // Payment failed
        setError(submitError.message || 'Payment failed')
        onPaymentError(submitError.message || 'Payment failed')
        setIsSubmitting(false)
        setIsProcessing(false)
      } else if (paymentIntent) {
        // Payment succeeded
        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent.id)
        } else if (paymentIntent.status === 'requires_action') {
          // 3D Secure or other action required
          // Stripe will handle the redirect automatically
          console.log('Payment requires additional action')
        } else {
          setError('Payment is still processing')
          setIsSubmitting(false)
          setIsProcessing(false)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onPaymentError(errorMessage)
      setIsSubmitting(false)
      setIsProcessing(false)
    }
  }

  if (!stripe || !elements) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment form...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      
      {error && (
        <div className="stripe-form-error" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting || isProcessing}
        className="stripe-pay-button w-full"
      >
        {isSubmitting || isProcessing ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </span>
        ) : (
          'Pay'
        )}
      </button>
    </form>
  )
}

/**
 * Main Payment Element wrapper component
 * Provides Stripe Elements context
 */
export function PaymentElementWrapper(props: PaymentElementWrapperProps) {
  const [options, setOptions] = useState<StripeElementsOptions | null>(null)

  useEffect(() => {
    if (!stripePromise || !props.clientSecret) {
      return
    }

    // Set up Elements options
    setOptions({
      clientSecret: props.clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#ea580c', // Orange-600 to match your brand
          colorBackground: '#ffffff',
          colorText: '#111827',
          colorDanger: '#dc2626',
          fontFamily: 'system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '6px',
        },
      },
    })
  }, [props.clientSecret])

  if (!stripePromise) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Payment system is not configured. Please contact support.</p>
      </div>
    )
  }

  if (!options) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment form...</p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentElementInner {...props} />
    </Elements>
  )
}

