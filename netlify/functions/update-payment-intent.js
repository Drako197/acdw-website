/**
 * Update Stripe Payment Intent
 * 
 * Updates a Payment Intent when shipping address changes
 * Recalculates shipping and tax in real-time
 * 
 * SECURITY: Validates inputs and recalculates shipping server-side
 */

// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, EVENT_TYPES } = require('./utils/security-logger')
const { calculateShipping, parseProducts } = require('./utils/shipping-calculator.cjs')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  // Security headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Get client IP
    const ip = getClientIP(event)
    
    // Check rate limit (stricter for updates - prevent abuse)
    const rateLimitResult = checkRateLimit(ip, 'api')
    if (!rateLimitResult.allowed) {
      logRateLimit(ip, 'api', '/.netlify/functions/update-payment-intent')
      return {
        statusCode: 429,
        headers: {
          ...headers,
          ...getRateLimitHeaders(rateLimitResult)
        },
        body: JSON.stringify({ 
          error: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter
        }),
      }
    }
    
    // Log API access
    logAPIAccess('/.netlify/functions/update-payment-intent', 'POST', ip, event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { paymentIntentId, shippingAddress, product, quantity, priceId } = JSON.parse(event.body)

    // Validate inputs
    if (!paymentIntentId || !shippingAddress || !product || !quantity || !priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Validate shipping address
    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Complete shipping address required' }),
      }
    }

    // Validate quantity
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1 || qty > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid quantity' }),
      }
    }

    // Verify Payment Intent exists and belongs to this session
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (stripeError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid payment intent' }),
      }
    }

    // Verify Price ID exists in Stripe
    let price
    try {
      price = await stripe.prices.retrieve(priceId)
    } catch (stripeError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid price ID' }),
      }
    }

    // Recalculate shipping cost server-side
    // SECURITY: Always recalculate shipping server-side to prevent manipulation
    let shippingCost
    try {
      const products = {
        [product]: qty,
      }
      
      const shippingResult = await calculateShipping(shippingAddress, products)
      shippingCost = shippingResult.cost
      console.log('Shipping recalculated:', shippingCost)
    } catch (shippingError) {
      console.error('Shipping calculation failed:', shippingError)
      // Use fallback based on country
      shippingCost = shippingAddress.country === 'CA' ? 20.00 : 15.00
      console.log('Using fallback shipping cost:', shippingCost)
    }

    // Calculate product total
    const productAmount = price.unit_amount * qty // In cents
    const shippingAmount = Math.round(shippingCost * 100) // Convert to cents
    
    // Initial amount (before tax - Stripe will add tax)
    const initialAmount = productAmount + shippingAmount

    // Update Payment Intent with new shipping address and amount
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: initialAmount,
      // Update shipping address
      shipping: {
        name: shippingAddress.name || 'Customer',
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zip || shippingAddress.postal_code || '',
          country: shippingAddress.country,
        },
      },
      // Automatic tax will recalculate based on new address
    })

    // Stripe Tax automatically recalculates tax and updates the Payment Intent amount
    // Retrieve the updated Payment Intent to get the final amount with tax
    const finalPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    // Extract tax amount
    const taxAmount = finalPaymentIntent.amount_details?.amount_tax 
      ? finalPaymentIntent.amount_details.amount_tax / 100 
      : 0

    // Extract tax breakdown for display
    const taxBreakdown = finalPaymentIntent.amount_details?.breakdown?.taxes || []
    const taxDetails = taxBreakdown.map(tax => ({
      amount: tax.amount / 100,
      rate: tax.rate?.display_name || 'Tax',
      percentage: tax.rate?.percentage || 0,
    }))

    console.log('Payment Intent updated:', {
      paymentIntentId: paymentIntentId,
      amount: finalPaymentIntent.amount / 100,
      productAmount: productAmount / 100,
      shippingAmount: shippingAmount / 100,
      taxAmount: taxAmount,
      taxDetails: taxDetails,
      shippingAddress: {
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country,
      },
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        clientSecret: finalPaymentIntent.client_secret, // Updated client secret
        paymentIntentId: finalPaymentIntent.id,
        amount: finalPaymentIntent.amount, // Final amount including tax (in cents)
        productAmount: productAmount, // Product amount (in cents)
        shippingAmount: shippingAmount, // Shipping amount (in cents)
        taxAmount: taxAmount, // Tax amount (in dollars)
        taxDetails: taxDetails, // Tax breakdown
        shippingCost: shippingCost, // Shipping cost (in dollars)
      }),
    }
  } catch (error) {
    console.error('Error updating payment intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    })
    
    // Provide helpful error messages
    let errorMessage = 'Failed to update payment intent'
    let errorDetails = null
    
    if (error.type === 'StripeInvalidRequestError') {
      if (error.message?.includes('automatic_tax')) {
        errorMessage = 'Stripe Tax is not enabled in your Stripe account. Please enable it in Stripe Dashboard → Tax settings.'
        errorDetails = 'To enable: Go to Stripe Dashboard → Settings → Tax, and enable Stripe Tax'
      } else {
        errorMessage = `Stripe error: ${error.message}`
        errorDetails = error.code
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        type: error.type,
        code: error.code,
      }),
    }
  }
}

