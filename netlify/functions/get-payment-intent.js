/**
 * Get Payment Intent Details
 * 
 * Retrieves Payment Intent information including shipping address and tax details
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
  const rateLimitResult = checkRateLimit(ip, 'api')
  
  if (!rateLimitResult.allowed) {
    console.warn('🚫 Rate limit exceeded (get-payment-intent)', {
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
    // Get Payment Intent ID from query parameters
    const paymentIntentId = event.queryStringParameters?.payment_intent

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing payment_intent parameter' }),
      }
    }

    // Retrieve Payment Intent from Stripe
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['payment_method', 'customer'],
      })
    } catch (retrieveError) {
      console.error('Error retrieving Payment Intent from Stripe:', {
        message: retrieveError.message,
        type: retrieveError.type,
        code: retrieveError.code,
        stack: retrieveError.stack,
      })
      throw new Error(`Failed to retrieve Payment Intent: ${retrieveError.message}`)
    }

    // Extract customer email
    const customerEmail = paymentIntent.receipt_email || 
                         (paymentIntent.customer && typeof paymentIntent.customer === 'object' 
                           ? paymentIntent.customer.email 
                           : null) ||
                         null

    // Extract shipping address
    const shipping = paymentIntent.shipping

    // Extract tax information
    // Since we calculate tax manually using Tax Calculation API, tax is stored in metadata
    // Try metadata first, then fall back to amount_details if available
    let taxAmount = 0
    let taxDetails = []
    
    if (paymentIntent.metadata?.taxAmount) {
      // Tax stored in metadata (from our manual calculation)
      taxAmount = parseFloat(paymentIntent.metadata.taxAmount) || 0
      // Try to parse tax details from metadata if available
      if (paymentIntent.metadata.taxDetails) {
        try {
          taxDetails = JSON.parse(paymentIntent.metadata.taxDetails)
        } catch (e) {
          // If parsing fails, create a simple tax detail
          taxDetails = taxAmount > 0 ? [{
            amount: taxAmount,
            rate: 'Sales Tax',
            percentage: 0,
          }] : []
        }
      } else {
        // Create a simple tax detail from amount
        taxDetails = taxAmount > 0 ? [{
          amount: taxAmount,
          rate: 'Sales Tax',
          percentage: 0,
        }] : []
      }
    } else {
      // Fallback: Try to extract from amount_details (if automatic tax was used)
      const taxBreakdown = paymentIntent.amount_details?.breakdown?.taxes || []
      taxAmount = taxBreakdown.length > 0
        ? taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)
        : (paymentIntent.amount_details?.amount_tax ? paymentIntent.amount_details.amount_tax / 100 : 0)
      
      taxDetails = taxBreakdown.map(tax => ({
        amount: tax.amount / 100,
        rate: tax.rate?.display_name || 'Tax',
        percentage: tax.rate?.percentage || 0,
      }))
    }

    // Calculate product amount (total - shipping - tax)
    // Note: We need to extract this from metadata or calculate from line items
    // For now, we'll use metadata if available
    const productAmount = paymentIntent.amount - 
                         (shipping ? Math.round((parseFloat(paymentIntent.metadata?.shippingCost || 0) * 100)) : 0) -
                         Math.round(taxAmount * 100)

    // Extract shipping cost from metadata or calculate
    const shippingCost = shipping 
      ? (parseFloat(paymentIntent.metadata?.shippingCost || 0))
      : 0

    // Build order details
    const orderDetails = {
      paymentIntentId: paymentIntent.id,
      customerEmail,
      amountTotal: paymentIntent.amount / 100, // Total amount in dollars
      currency: paymentIntent.currency || 'usd',
      paymentStatus: paymentIntent.status || 'unknown',
      productAmount: productAmount / 100, // Product amount in dollars
      tax: taxAmount, // Tax amount in dollars
      taxDetails: taxDetails, // Tax breakdown
      shipping: shippingCost, // Shipping cost in dollars
      shippingDetails: shipping
        ? {
            name: shipping.name || '',
            address: {
              line1: shipping.address?.line1 || '',
              line2: shipping.address?.line2 || '',
              city: shipping.address?.city || '',
              state: shipping.address?.state || '',
              postal_code: shipping.address?.postal_code || '',
              country: shipping.address?.country || '',
            },
          }
        : null,
      metadata: paymentIntent.metadata || {},
    }
    
    console.log('Extracted Payment Intent details:', {
      hasShipping: !!orderDetails.shippingDetails,
      shippingAddress: orderDetails.shippingDetails?.address,
      tax: orderDetails.tax,
      shipping: orderDetails.shipping,
      productAmount: orderDetails.productAmount,
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
    console.error('Error retrieving Payment Intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to retrieve Payment Intent',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        type: error.type,
        code: error.code,
      }),
    }
  }
}

