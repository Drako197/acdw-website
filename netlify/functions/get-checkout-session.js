/**
 * Get Checkout Session Details
 * 
 * Retrieves checkout session information including shipping address
 * Used on the success page to display order details
 */

// Import utilities
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { logAPIAccess, logRateLimit, EVENT_TYPES } = require('./utils/security-logger')

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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }
  
  // Rate limiting check
  const ip = getClientIP(event)
  const rateLimitResult = await checkRateLimit(ip, 'api')
  
  if (!rateLimitResult.allowed) {
    console.warn('🚫 Rate limit exceeded (get-checkout-session)', {
      ip,
      limit: rateLimitResult.limit,
      retryAfter: rateLimitResult.retryAfter
    })
    
    return {
      statusCode: 429,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      })
    }
  }

  try {
    // Get session ID from query parameters
    const sessionId = event.queryStringParameters?.session_id

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing session_id parameter' }),
      }
    }

    // Retrieve checkout session from Stripe
    // Note: shipping_details is included by default, cannot be expanded
    // Note: line_items must be retrieved separately using listLineItems
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer'], // shipping_details is already included, cannot be expanded
      })
    } catch (retrieveError) {
      console.error('Error retrieving session from Stripe:', {
        message: retrieveError.message,
        type: retrieveError.type,
        code: retrieveError.code,
        stack: retrieveError.stack,
      })
      throw new Error(`Failed to retrieve session: ${retrieveError.message}`)
    }
    
    // Retrieve line items separately (more reliable than expanding in retrieve)
    let lineItems = null
    try {
      lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
        expand: ['data.price.product'],
      })
    } catch (lineItemsError) {
      console.warn('Error retrieving line items (non-fatal):', lineItemsError.message)
      // Continue without line items - not critical for display
    }
    
    console.log('Retrieved session:', {
      id: session.id,
      hasShipping: !!session.shipping_details,
      hasLineItems: !!lineItems?.data?.length,
      amountTotal: session.amount_total,
      amountSubtotal: session.amount_subtotal,
      shippingCost: session.shipping_cost,
      totalDetails: session.total_details,
      shippingCostAmount: session.shipping_cost?.amount_total,
    })

    // Extract customer email (from customer_email or customer_details)
    const customerEmail = session.customer_email || 
                         session.customer_details?.email || 
                         (session.customer && typeof session.customer === 'object' ? session.customer.email : null) ||
                         null

    // Parse line items to separate product from shipping
    let productSubtotal = 0
    let shippingCost = 0
    const parsedLineItems = []
    
    if (lineItems?.data) {
      for (const item of lineItems.data) {
        const itemAmount = item.amount_total ? item.amount_total / 100 : 0
        const itemDescription = item.description || item.price?.product?.name || 'Product'
        
        // Check if this is a shipping line item
        const isShipping = itemDescription.toLowerCase().includes('shipping') || 
                          itemDescription.toLowerCase().includes('handling')
        
        if (isShipping) {
          shippingCost = itemAmount
        } else {
          productSubtotal += itemAmount
        }
        
        parsedLineItems.push({
          description: itemDescription,
          quantity: item.quantity || 1,
          amount: itemAmount,
          isShipping: isShipping,
        })
      }
    }
    
    // If we couldn't parse line items, fall back to Stripe's calculations
    if (parsedLineItems.length === 0) {
      productSubtotal = session.amount_subtotal ? session.amount_subtotal / 100 : 0
      shippingCost = session.shipping_cost?.amount_total 
        ? session.shipping_cost.amount_total / 100
        : 0
    }

    // Extract relevant information safely
    const orderDetails = {
      sessionId: session.id,
      customerEmail, // Include customer email for account creation
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: session.payment_status || 'unknown',
      subtotal: productSubtotal, // Product cost only (excluding shipping)
      // Extract tax from Stripe Tax (handles multiple tax types: sales tax, VAT, GST, etc.)
      // Stripe Tax stores taxes in total_details.breakdown.taxes array
      tax: (() => {
        const taxBreakdown = session.total_details?.breakdown?.taxes || []
        if (taxBreakdown.length > 0) {
          // Sum all taxes (handles multiple tax types)
          return taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)
        }
        // Fallback to legacy amount_tax field
        return session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0
      })(),
      // Tax breakdown for display (shows individual tax types)
      taxDetails: (() => {
        const taxBreakdown = session.total_details?.breakdown?.taxes || []
        return taxBreakdown.map(tax => ({
          amount: tax.amount / 100,
          rate: tax.rate?.display_name || 'Tax',
          percentage: tax.rate?.percentage || 0,
        }))
      })(),
      shipping: shippingCost, // Shipping cost from line items
      shippingDetails: session.shipping_details
        ? {
            name: session.shipping_details.name || '',
            address: {
              line1: session.shipping_details.address?.line1 || '',
              line2: session.shipping_details.address?.line2 || '',
              city: session.shipping_details.address?.city || '',
              state: session.shipping_details.address?.state || '',
              postal_code: session.shipping_details.address?.postal_code || '',
              country: session.shipping_details.address?.country || '',
            },
          }
        : null,
      lineItems: parsedLineItems,
      metadata: session.metadata || {},
    }
    
    console.log('Extracted order details:', {
      hasShipping: !!orderDetails.shippingDetails,
      shippingAddress: orderDetails.shippingDetails?.address,
      tax: orderDetails.tax,
      shipping: orderDetails.shipping,
      subtotal: orderDetails.subtotal,
      total: orderDetails.amountTotal,
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        ...getRateLimitHeaders(rateLimitResult)
      },
      body: JSON.stringify(orderDetails),
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to retrieve checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        type: error.type,
        code: error.code,
      }),
    }
  }
}

