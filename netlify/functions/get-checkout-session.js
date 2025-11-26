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

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'shipping_details', 'customer'],
    })

    // Extract relevant information
    const orderDetails = {
      sessionId: session.id,
      amountTotal: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      paymentStatus: session.payment_status,
      shipping: session.shipping_details
        ? {
            name: session.shipping_details.name,
            address: {
              line1: session.shipping_details.address?.line1,
              line2: session.shipping_details.address?.line2,
              city: session.shipping_details.address?.city,
              state: session.shipping_details.address?.state,
              postal_code: session.shipping_details.address?.postal_code,
              country: session.shipping_details.address?.country,
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

