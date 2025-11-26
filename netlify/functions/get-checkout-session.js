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
    // Note: line_items must be retrieved separately using listLineItems
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['shipping_details', 'customer'],
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
      hasLineItems: !!session.line_items,
      amountTotal: session.amount_total,
      amountSubtotal: session.amount_subtotal,
      shippingCost: session.shipping_cost,
      totalDetails: session.total_details,
    })

    // Extract relevant information safely
    const orderDetails = {
      sessionId: session.id,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: session.payment_status || 'unknown',
      subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : null,
      // Tax might be in total_details.breakdown.taxes or total_details.amount_tax
      tax: session.total_details?.breakdown?.taxes?.[0]?.amount 
        ? session.total_details.breakdown.taxes[0].amount / 100
        : (session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : null),
      // Shipping cost from shipping_cost or calculated from total
      shipping: session.shipping_cost?.amount_total 
        ? session.shipping_cost.amount_total / 100
        : (session.amount_total && session.amount_subtotal
          ? (session.amount_total - session.amount_subtotal - (session.total_details?.amount_tax || 0)) / 100
          : null),
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
      lineItems: lineItems?.data?.map((item) => ({
        description: item.description || item.price?.product?.name || 'Product',
        quantity: item.quantity || 1,
        amount: item.amount_total ? item.amount_total / 100 : 0,
      })) || [],
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
      headers,
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

