/**
 * Save Shipping Address to Clerk User Profile
 * 
 * Stores shipping address in Clerk user metadata for faster checkout in future orders
 * 
 * LEGAL NOTE: Storing shipping addresses is legal and a common practice.
 * It improves user experience by pre-filling addresses on future orders.
 * The address is stored securely in Clerk's user metadata.
 */

// Use Clerk Backend API
// Note: For Netlify Functions, we'll use fetch to call Clerk's REST API
// Alternatively, we can use @clerk/backend package
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
const CLERK_API_URL = 'https://api.clerk.com/v1'

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
    const { userId, shippingAddress } = JSON.parse(event.body)

    // Validate inputs
    if (!userId || !shippingAddress) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    // Validate shipping address fields
    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid shipping address' }),
      }
    }

    // Check if Clerk secret key is set
    if (!CLERK_SECRET_KEY) {
      console.warn('CLERK_SECRET_KEY not set, skipping address save')
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false,
          message: 'Clerk not configured',
        }),
      }
    }

    // Get current user metadata using Clerk REST API
    const getUserResponse = await fetch(`${CLERK_API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!getUserResponse.ok) {
      const errorData = await getUserResponse.json().catch(() => ({}))
      throw new Error(`Failed to get user: ${errorData.message || getUserResponse.statusText}`)
    }

    const user = await getUserResponse.json()
    const currentMetadata = user.unsafe_metadata || {}

    // Update user metadata with shipping address
    // Store in unsafeMetadata (private, not exposed to frontend by default)
    const updatedMetadata = {
      ...currentMetadata,
      shippingAddress: {
        name: shippingAddress.name || user.first_name || '',
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        lastUpdated: new Date().toISOString(),
      },
    }

    // Update user in Clerk using REST API
    const updateResponse = await fetch(`${CLERK_API_URL}/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unsafe_metadata: updatedMetadata,
      }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}))
      throw new Error(`Failed to update user: ${errorData.message || updateResponse.statusText}`)
    }

    console.log('Shipping address saved to user profile:', userId)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Shipping address saved to profile',
      }),
    }
  } catch (error) {
    console.error('Error saving shipping address:', error)
    
    // If it's a Clerk error, provide more context
    if (error.statusCode) {
      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to save shipping address',
          details: error.message,
        }),
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save shipping address',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    }
  }
}

