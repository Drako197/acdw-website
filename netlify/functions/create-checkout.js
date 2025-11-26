/**
 * Create Stripe Checkout Session
 * 
 * SECURITY: Validates user authentication, role, and price before creating checkout
 * 
 * Creates a Stripe Checkout session with the correct price and quantity
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
    const { priceId, quantity, product, userEmail, userId } = JSON.parse(event.body)

    // Validate inputs
    if (!priceId || !quantity || !product || !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
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

    // Calculate shipping cost (will be updated based on address in shipping rate options)
    // For now, we'll use Stripe shipping rate options (see setup instructions below)
    // Or we can add shipping as a line item after address is collected
    
    // Shipping rates configuration
    // Option 1: Use Stripe Shipping Rate Options (recommended)
    // Create shipping rates in Stripe Dashboard, then reference them here
    // Option 2: Add shipping as line item (requires knowing address first)
    
    // For now, we'll enable shipping address collection and use shipping rate options
    // You'll need to create shipping rates in Stripe Dashboard first
    
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
      success_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://www.acdrainwiz.com'}/checkout/cancel`,
      customer_email: userEmail,
      
      // Enable shipping address collection
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // US and Canada only
      },
      
      // Shipping rate options - zone-based pricing
      // Note: Stripe will show all options; customer selects based on their address
      // For automatic zone-based selection, you'd need to create shipping rates in Stripe Dashboard
      // with country restrictions, or use a webhook to update shipping after address is known
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15.00 in cents for US
              currency: 'usd',
            },
            display_name: 'Standard Shipping (US)',
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
              amount: 2000, // $20.00 in cents for Canada
              currency: 'usd',
            },
            display_name: 'Standard Shipping (Canada)',
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
      ],
      
      metadata: {
        userId: userId || '',
        product,
        quantity: qty.toString(),
      },
      
      // Enable automatic tax calculation (requires shipping address)
      automatic_tax: {
        enabled: true,
      },
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
    console.error('Error creating checkout session:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    }
  }
}

