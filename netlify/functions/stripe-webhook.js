/**
 * Stripe Webhook Handler
 * 
 * SECURITY: Verifies webhook signature before processing
 * 
 * Handles Stripe webhook events (payment success, failure, etc.)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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
      
      // TODO: Create order record, send confirmation email, etc.
      // This is where you'd integrate with your order management system
      
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

