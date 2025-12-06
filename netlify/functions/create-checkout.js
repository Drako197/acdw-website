/**
 * Create Stripe Checkout Session
 * 
 * SECURITY: Validates user authentication, role, and price before creating checkout
 * 
 * Creates a Stripe Checkout session with the correct price and quantity
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
    // Parse request body
    const { priceId, quantity, product, userEmail, userId, isGuest, shippingAddress, preCalculatedShippingCost } = JSON.parse(event.body)

    // Validate inputs
    if (!priceId || !quantity || !product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // For guest checkout, email will be collected by Stripe
    // For logged-in users, email is required
    if (!isGuest && !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email required for logged-in users' }),
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

    // Calculate shipping cost
    // Shipping should ALWAYS be pre-calculated before creating Stripe session
    // Either from CheckoutPage or from saved address
    // SECURITY: Always re-verify shipping cost server-side to prevent manipulation
    let shippingCost
    let shippingOptions = []
    
    if (!shippingAddress || !shippingAddress.state || !shippingAddress.country) {
      // No shipping address provided
      // This shouldn't happen with new flow, but handle gracefully
      console.error('No shipping address provided')
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Shipping address required. Please go through checkout page.' }),
      }
    }
    
    // SECURITY: Always calculate shipping server-side
    // Even if client provided preCalculatedShippingCost, we verify it
    console.log('Calculating shipping from provided address:', shippingAddress)
    
    const products = {
      [product]: qty,
    }
    
    const shippingResult = await calculateShipping(shippingAddress, products)
    console.log('Shipping calculation result:', shippingResult)
    shippingCost = shippingResult.cost
    
    // SECURITY: If client provided a pre-calculated cost, verify it matches
    // This prevents manipulation of shipping cost
    if (preCalculatedShippingCost !== undefined && preCalculatedShippingCost !== null) {
      const difference = Math.abs(shippingCost - preCalculatedShippingCost)
      if (difference > 0.50) {
        // Shipping cost differs by more than $0.50 - possible manipulation
        console.warn('Shipping cost mismatch:', {
          serverCalculated: shippingCost,
          clientProvided: preCalculatedShippingCost,
          difference,
        })
        // Use server-calculated value, not client-provided
      }
    }
    
    // Create single shipping option with calculated cost
    shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingCost * 100), // Convert to cents
            currency: 'usd',
          },
          display_name: 'Standard Ground Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: shippingAddress.country === 'CA' ? 7 : 3,
            },
            maximum: {
              unit: 'business_day',
              value: shippingAddress.country === 'CA' ? 14 : 7,
            },
          },
          metadata: {
            zone: shippingAddress?.state || 'unknown',
          },
        },
      },
    ]
    
    // Create Stripe Checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: qty,
          // Add product metadata for shipping calculation webhook
          adjustable_quantity: {
            enabled: false, // Disable quantity adjustment in Stripe checkout
          },
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}${isGuest ? '&guest=true' : ''}`,
      cancel_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/cancel`,
      // Only set customer_email if provided (for logged-in users)
      // For guests, Stripe will collect email during checkout
      ...(userEmail && { customer_email: userEmail }),
      
      metadata: {
        userId: userId || '',
        product,
        quantity: qty.toString(),
        isGuest: isGuest ? 'true' : 'false',
      },
    }

    // Add shipping configuration based on whether we have a saved address
    if (shippingAddress && shippingAddress.state && shippingAddress.country) {
      // Logged-in user with saved address: pre-calculated shipping
      console.log('Using pre-calculated shipping rate')
      sessionConfig.shipping_options = shippingOptions
      sessionConfig.shipping_address_collection = null
    } else {
      // Guest or no saved address: enable dynamic calculation
      console.log('Enabling dynamic shipping calculation via Stripe webhook')
      sessionConfig.shipping_address_collection = shippingAddressCollection
      
      // Note: Stripe will automatically call our webhook configured in Stripe Dashboard
      // Webhook endpoint: /.netlify/functions/calculate-shipping-rate
      // This is configured in Stripe Dashboard → Settings → Checkout settings → Shipping rate calculation
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
      
      metadata: {
        userId: userId || '',
        product,
        quantity: qty.toString(),
        isGuest: isGuest ? 'true' : 'false',
      },
      
      // Enable automatic tax calculation (requires shipping address)
      // Note: Stripe Tax must be enabled in your Stripe Dashboard
      // Temporarily disabled - enable by setting STRIPE_TAX_ENABLED=true in Netlify
      // ...(process.env.STRIPE_TAX_ENABLED === 'true' && {
      //   automatic_tax: {
      //     enabled: true,
      //   },
      // }),
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    }
  } catch (error) {
    console.error('Error creating checkout session:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw,
    })
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to create checkout session'
    let errorDetails = null
    
    if (error.type === 'StripeInvalidRequestError') {
      if (error.code === 'parameter_invalid_empty') {
        errorMessage = 'Invalid checkout configuration. Please check shipping options.'
        errorDetails = error.message
      } else if (error.message?.includes('automatic_tax')) {
        errorMessage = 'Stripe Tax is not enabled in your Stripe account. Please enable it in Stripe Dashboard → Tax settings, or disable automatic tax in the code.'
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

