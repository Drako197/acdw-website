/**
 * Stripe Shipping Rate Calculation Webhook
 * 
 * Called by Stripe during checkout to calculate shipping cost based on customer address
 * This enables real-time shipping calculation as the customer enters their address
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
    logAPIAccess('/.netlify/functions/calculate-shipping-rate', 'POST', 'stripe', 'Stripe Checkout', true)
    
    // Parse Stripe's shipping rate calculation request
    const payload = JSON.parse(event.body)
    
    console.log('Stripe shipping calculation request:', {
      shippingAddress: payload.shipping_address,
      lineItems: payload.line_items?.length,
    })

    // Validate required fields
    if (!payload.shipping_address || !payload.line_items) {
      console.error('Missing required fields in Stripe request')
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing shipping address or line items' 
        }),
      }
    }

    const { shipping_address, line_items } = payload

    // Extract address information
    const address = {
      line1: shipping_address.line1 || '',
      line2: shipping_address.line2 || '',
      city: shipping_address.city || '',
      state: shipping_address.state || '',
      postal_code: shipping_address.postal_code || '',
      zip: shipping_address.postal_code || '',
      country: shipping_address.country || 'US',
      name: shipping_address.name || '',
    }

    // Calculate total quantity and product types from line items
    const products = {}
    let totalQuantity = 0

    for (const item of line_items) {
      const quantity = item.quantity || 1
      totalQuantity += quantity
      
      // Extract product type from description or metadata
      // Stripe line items should have product metadata
      // For now, we'll default to 'mini' but this should be passed in metadata
      const productType = item.description?.toLowerCase().includes('sensor') ? 'sensor' 
                        : item.description?.toLowerCase().includes('bundle') ? 'bundle'
                        : 'mini'
      
      products[productType] = (products[productType] || 0) + quantity
    }

    console.log('Calculating shipping for:', {
      address: `${address.city}, ${address.state} ${address.postal_code}`,
      country: address.country,
      products,
      totalQuantity,
    })

    // Calculate shipping cost
    const shippingResult = await calculateShipping(address, products)
    
    console.log('Shipping calculation result:', {
      cost: shippingResult.cost,
      method: shippingResult.method,
      carrier: shippingResult.carrier,
    })

    // Determine delivery estimate based on zone/country
    let deliveryMin = 5
    let deliveryMax = 7
    
    if (address.country === 'CA' || address.country === 'CANADA') {
      deliveryMin = 7
      deliveryMax = 14
    } else if (address.state === 'FL' || address.state === 'GA' || address.state === 'SC' || address.state === 'AL') {
      deliveryMin = 3
      deliveryMax = 5
    } else if (address.state === 'AK' || address.state === 'HI') {
      deliveryMin = 7
      deliveryMax = 10
    }

    // Return shipping options in Stripe's expected format
    const response = {
      shipping_rates: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingResult.cost * 100), // Convert to cents
              currency: 'usd',
            },
            display_name: shippingResult.method === 'api' 
              ? 'Standard Ground Shipping' 
              : 'Standard Ground Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: deliveryMin,
              },
              maximum: {
                unit: 'business_day',
                value: deliveryMax,
              },
            },
            metadata: {
              zone: address.state,
              method: shippingResult.method,
              carrier: shippingResult.carrier,
            },
          },
        },
      ],
    }

    console.log('Returning shipping rate to Stripe:', {
      amount: response.shipping_rates[0].shipping_rate_data.fixed_amount.amount,
      displayName: response.shipping_rates[0].shipping_rate_data.display_name,
      delivery: `${deliveryMin}-${deliveryMax} days`,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error('Error calculating shipping rate:', {
      message: error.message,
      stack: error.stack,
    })
    
    // Return a fallback rate if calculation fails
    // This ensures checkout doesn't break
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        shipping_rates: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1500, // $15.00 fallback
                currency: 'usd',
              },
              display_name: 'Standard Ground Shipping (Estimated)',
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
        ],
      }),
    }
  }
}

