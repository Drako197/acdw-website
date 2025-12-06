/**
 * Calculate Shipping Cost
 * 
 * Simple endpoint to calculate shipping based on address and products
 * Called from CheckoutPage before creating Stripe session
 */

const { calculateShipping } = require('./utils/shipping-calculator.cjs')
const { logAPIAccess } = require('./utils/security-logger')

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
    // Log API access
    logAPIAccess('/.netlify/functions/calculate-shipping', 'POST', 'client', event.headers['user-agent'] || 'unknown', true)
    
    // Parse request body
    const { address, products } = JSON.parse(event.body)
    
    console.log('Calculating shipping for:', {
      address: `${address.city}, ${address.state} ${address.postal_code}`,
      products,
    })

    // Validate required fields
    if (!address || !products) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing address or products' }),
      }
    }

    // Calculate shipping cost
    const shippingResult = await calculateShipping(address, products)
    
    console.log('Shipping calculation result:', {
      cost: shippingResult.cost,
      method: shippingResult.method,
      carrier: shippingResult.carrier,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        cost: shippingResult.cost,
        method: shippingResult.method,
        carrier: shippingResult.carrier,
        zone: address.state,
      }),
    }
  } catch (error) {
    console.error('Error calculating shipping:', {
      message: error.message,
      stack: error.stack,
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to calculate shipping' }),
    }
  }
}

