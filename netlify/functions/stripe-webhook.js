/**
 * Stripe Webhook Handler
 * 
 * SECURITY: Verifies webhook signature before processing
 * 
 * Handles Stripe webhook events (payment success, failure, etc.)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// SKU Mapping for ShipStation (matches create-shipstation-order.js)
const SKU_MAPPING = {
  'price_1SZe5X60dq6nGBAfwo2hsNxK': { sku: 'ACDW-MINI-HOMEOWNER', name: 'AC Drain Wiz Mini' },
  'price_1SZebe60dq6nGBAfutAtD9re': { sku: 'ACDW-MINI-PRO-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZeiH60dq6nGBAf2o2ypICU': { sku: 'ACDW-MINI-PRO-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZekg60dq6nGBAfTQ8c630l': { sku: 'ACDW-MINI-PRO-T3', name: 'AC Drain Wiz Mini' },
  'price_1SZenc60dq6nGBAfvTu9zjFI': { sku: 'ACDW-SENSOR-PRO-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZf1t60dq6nGBAfe36Q57Bp': { sku: 'ACDW-SENSOR-PRO-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZf5i60dq6nGBAfa1p0ruWp': { sku: 'ACDW-SENSOR-PRO-T3', name: 'AC Drain Wiz Sensor' },
  'price_1SZf9f60dq6nGBAfmqSXnqbY': { sku: 'ACDW-BUNDLE-PRO-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfAh60dq6nGBAfAsho4TuM': { sku: 'ACDW-BUNDLE-PRO-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfD360dq6nGBAfwElA3YTM': { sku: 'ACDW-BUNDLE-PRO-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfHZ60dq6nGBAfVcHud4Fa': { sku: 'ACDW-MINI-PM-T1', name: 'AC Drain Wiz Mini' },
  'price_1SZfJH60dq6nGBAfgPDGJLVs': { sku: 'ACDW-MINI-PM-T2', name: 'AC Drain Wiz Mini' },
  'price_1SZfLW60dq6nGBAf7vNkpTVd': { sku: 'ACDW-MINI-PM-T3', name: 'AC Drain Wiz Mini' },
  'price_1SZfMZ60dq6nGBAfglTItYiC': { sku: 'ACDW-SENSOR-PM-T1', name: 'AC Drain Wiz Sensor' },
  'price_1SZfNQ60dq6nGBAf3ULHuQf5': { sku: 'ACDW-SENSOR-PM-T2', name: 'AC Drain Wiz Sensor' },
  'price_1SZfUL60dq6nGBAfVIhk1Q4F': { sku: 'ACDW-SENSOR-PM-T3', name: 'AC Drain Wiz Sensor' },
  'price_1SZfVA60dq6nGBAfPahshH8Z': { sku: 'ACDW-BUNDLE-PM-T1', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWA60dq6nGBAf2qwsKsgi': { sku: 'ACDW-BUNDLE-PM-T2', name: 'AC Drain Wiz Mini + Sensor Bundle' },
  'price_1SZfWm60dq6nGBAfDDdadlnM': { sku: 'ACDW-BUNDLE-PM-T3', name: 'AC Drain Wiz Mini + Sensor Bundle' },
}

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    }
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object
      
      // Payment was successful
      console.log('Payment successful:', session.id)
      
      // Create order in ShipStation
      try {
        // Fetch full session details including line items
        // Note: shipping_details is already included and cannot be expanded
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'customer']
        })
        
        // Get line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        })
        
        // Extract shipping address
        const shipping = fullSession.shipping_details || fullSession.shipping
        if (!shipping || !shipping.address) {
          console.warn('No shipping address found for session:', session.id)
          break
        }
        
        // Build order items for ShipStation
        const orderItems = lineItems.data.map(item => {
          const priceId = item.price?.id
          const mapping = SKU_MAPPING[priceId]
          
          return {
            sku: mapping?.sku || `UNKNOWN-${priceId}`,
            name: mapping?.name || item.description || item.price?.product?.name || 'Product',
            quantity: item.quantity || 1,
            unitPrice: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          }
        })
        
        // Build order data for ShipStation
        const orderData = {
          orderNumber: session.id, // Use Stripe session ID as order number
          orderDate: new Date().toISOString(),
          customerName: shipping.name || fullSession.customer_details?.name || 'Customer',
          customerEmail: fullSession.customer_email || fullSession.customer_details?.email || '',
          customerPhone: fullSession.customer_details?.phone || '',
          shippingAddress: {
            name: shipping.name || 'Customer',
            street1: shipping.address.line1 || '',
            street2: shipping.address.line2 || '',
            city: shipping.address.city || '',
            state: shipping.address.state || '',
            postalCode: shipping.address.postal_code || '',
            country: shipping.address.country || 'US',
          },
          items: orderItems,
          orderTotal: session.amount_total ? session.amount_total / 100 : 0,
          taxAmount: session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0,
          shippingAmount: session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0,
        }
        
        // Call ShipStation function to create order
        // Use internal function call (same Netlify environment)
        const shipstationFunction = require('./create-shipstation-order')
        const shipstationEvent = {
          httpMethod: 'POST',
          body: JSON.stringify(orderData),
          headers: event.headers,
        }
        
        const shipstationResult = await shipstationFunction.handler(shipstationEvent, context)
        
        // Check if ShipStation order was created successfully
        if (shipstationResult.statusCode === 200) {
          const result = JSON.parse(shipstationResult.body)
          console.log('Order created in ShipStation:', result)
        } else {
          const error = JSON.parse(shipstationResult.body)
          console.error('Failed to create ShipStation order:', error)
          // Don't throw - we still want to acknowledge the webhook
          // The error notification email will be sent by create-shipstation-order
        }
      } catch (error) {
        console.error('Error processing ShipStation order creation:', {
          message: error.message,
          stack: error.stack,
          sessionId: session.id
        })
        // Don't throw - we still want to acknowledge the webhook
        // Log the error for manual review
      }
      
      break

    case 'payment_intent.succeeded':
      const paymentIntent = stripeEvent.data.object
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = stripeEvent.data.object
      console.log('Payment failed:', failedPayment.id)
      
      // TODO: Notify user, log failure, etc.
      
      break

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  // Return a response to acknowledge receipt of the event
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  }
}

