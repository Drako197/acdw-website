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
    const { priceId, quantity, product, userEmail, userId, isGuest, shippingAddress } = JSON.parse(event.body)

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

    // Calculate shipping cost dynamically
    // If shipping address is provided, calculate exact cost
    // Otherwise, show zone-based options
    let shippingOptions = []
    
    if (shippingAddress && shippingAddress.state && shippingAddress.country) {
      // Calculate exact shipping cost
      console.log('Calculating shipping for address:', shippingAddress)
      
      const products = {
        [product]: qty,
      }
      
      const shippingResult = await calculateShipping(shippingAddress, products)
      console.log('Shipping calculation result:', shippingResult)
      
      // Create single shipping option with calculated cost
      shippingOptions = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingResult.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: shippingResult.method === 'api' 
              ? 'Standard Ground Shipping' 
              : 'Standard Ground Shipping (Estimated)',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: shippingAddress.country === 'CA' ? 7 : 5,
              },
              maximum: {
                unit: 'business_day',
                value: shippingAddress.country === 'CA' ? 14 : 7,
              },
            },
          },
        },
      ]
    } else {
      // No address provided, calculate zone-based options for this quantity
      console.log('No shipping address provided, calculating zone-based options for quantity:', qty)
      
      // Calculate shipping cost for each zone based on quantity
      const products = { [product]: qty }
      
      // Zone 1-2 (FL, GA, SC, AL)
      const zone1Cost = await calculateShipping(
        { state: 'FL', country: 'US' }, 
        products
      )
      
      // Zone 3-4 (NC, TN, MS, LA, TX)
      const zone2Cost = await calculateShipping(
        { state: 'TX', country: 'US' }, 
        products
      )
      
      // Zone 5-6 (Mid-Atlantic, Midwest)
      const zone3Cost = await calculateShipping(
        { state: 'IL', country: 'US' }, 
        products
      )
      
      // Zone 7-8 (West Coast, Northeast)
      const zone4Cost = await calculateShipping(
        { state: 'CA', country: 'US' }, 
        products
      )
      
      // Canada
      const canadaCost = await calculateShipping(
        { state: 'ON', country: 'CA' }, 
        products
      )
      
      console.log('Zone-based shipping costs calculated:', {
        zone1: zone1Cost.cost,
        zone2: zone2Cost.cost,
        zone3: zone3Cost.cost,
        zone4: zone4Cost.cost,
        canada: canadaCost.cost,
      })
      
      shippingOptions = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(zone1Cost.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: 'Zone 1-2: FL, GA, SC, AL',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(zone2Cost.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: 'Zone 3-4: NC, TN, MS, LA, TX',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 4,
              },
              maximum: {
                unit: 'business_day',
                value: 6,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(zone3Cost.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: 'Zone 5-6: Mid-Atlantic, Midwest',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(zone4Cost.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: 'Zone 7-8: West Coast, Northeast',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(canadaCost.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: 'Canada - All Provinces',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 7,
              },
              maximum: {
                unit: 'business_day',
                value: 14,
              },
            },
          },
        },
      ]
    }
    
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: qty,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}${isGuest ? '&guest=true' : ''}`,
      cancel_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/cancel`,
      // Only set customer_email if provided (for logged-in users)
      // For guests, Stripe will collect email during checkout
      ...(userEmail && { customer_email: userEmail }),
      
      // Enable shipping address collection (unless address already provided)
      ...(!shippingAddress && {
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'], // US and Canada only
        },
      }),
      
      // Pre-fill shipping address if provided
      ...(shippingAddress && {
        shipping_address_collection: null,
        shipping_details: {
          address: {
            line1: shippingAddress.line1 || '',
            line2: shippingAddress.line2 || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || '',
            postal_code: shippingAddress.postal_code || shippingAddress.zip || '',
            country: shippingAddress.country || 'US',
          },
          name: shippingAddress.name || '',
        },
      }),
      
      // Dynamic shipping options based on calculation or zone-based fallback
      shipping_options: shippingOptions,
      
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

