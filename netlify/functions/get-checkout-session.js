/**
 * Get Checkout Session Details
 * 
 * Retrieves checkout session information including shipping address
 * Used on the success page to display order details
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event, context) => {
  // Security headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
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

    // Retrieve checkout session from Stripe with all necessary expansions
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        'line_items',
        'line_items.data.price.product',
        'shipping_details',
        'customer',
        'total_details.breakdown',
      ],
    })
    
    console.log('Retrieved session:', {
      id: session.id,
      hasShipping: !!session.shipping_details,
      shippingDetails: session.shipping_details,
      amountTotal: session.amount_total,
      totalDetails: session.total_details,
    })

    // Extract relevant information
    const orderDetails = {
      sessionId: session.id,
      amountTotal: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      paymentStatus: session.payment_status,
      subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : null,
      tax: session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : null,
      shipping: session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : null,
      shippingDetails: session.shipping_details
        ? {
            name: session.shipping_details.name,
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
      lineItems: session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amount: item.amount_total / 100, // Convert from cents
      })),
      metadata: session.metadata,
    }
    
    console.log('Extracted order details:', {
      hasShipping: !!orderDetails.shippingDetails,
      shippingAddress: orderDetails.shippingDetails?.address,
      tax: orderDetails.tax,
      shipping: orderDetails.shipping,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(orderDetails),
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve checkout session' }),
    }
  }
}

