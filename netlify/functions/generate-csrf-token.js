

const crypto = require('crypto')
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const { getSecurityHeaders } = require('./utils/cors-config')
const { initBlobsStores, getCsrfTokenStore, isBlobsAvailable } = require('./utils/blobs-store')

// In-memory token storage fallback
const inMemoryTokens = new Map()

/**
 * Generate CSRF token
 * 
 * @param {string} ip - Client IP address
 * @param {Object} context - Netlify function context (for Blobs initialization)
 */
async function generateCSRFToken(ip, context = null) {
  // Initialize Blobs stores if context provided (must be called from handler)
  if (context) {
    initBlobsStores(context)
  }
  
  // Get Blobs store (will be null if Blobs unavailable)
  const kvStore = getCsrfTokenStore()
  
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + (15 * 60 * 1000) // 15 minutes
  
  const tokenData = {
    createdAt: Date.now(),
    expires,
    ip,
    used: false
  }
  
  try {
    if (kvStore) {
      // Use Netlify KV (persistent)
      await kvStore.set(`csrf:${token}`, tokenData, { expirationTtl: 900 }) // 15 minutes
    } else {
      // Use in-memory fallback
      inMemoryTokens.set(token, tokenData)
      
      // Clean up expired tokens periodically
      setTimeout(() => {
        inMemoryTokens.delete(token)
      }, 15 * 60 * 1000)
    }
    
    return {
      token,
      expires: new Date(expires).toISOString(),
      expiresIn: 900 // seconds
    }
  } catch (error) {
    console.error('❌ Failed to store CSRF token:', error.message)
    // Still return token even if storage fails (fail open)
    return {
      token,
      expires: new Date(expires).toISOString(),
      expiresIn: 900,
      warning: 'Token storage failed, using in-memory fallback'
    }
  }
}

/**
 * Netlify Function Handler
 */
exports.handler = async (event, context) => {

    const headers = getSecurityHeaders(event)

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' }),
    }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

    // Rate limiting
    const ip = getClientIP(event)
    const rateLimitResult = await checkRateLimit(ip, 'form', context)
    if (!rateLimitResult.allowed) {
        return {
            statusCode: 429,
            headers: {
                ...headers,
                ...getRateLimitHeaders(rateLimitResult)
            },
            body: JSON.stringify({
                error: 'Too many form submissions. Please wait and try again.',
                retryAfter: rateLimitResult.retryAfter
            }),
        }
    }

  try {
    // Get client IP
    const ip = getClientIP(event)
    
    // Generate token (pass context for Blobs initialization)
    const tokenData = await generateCSRFToken(ip, context)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        ...tokenData
      }),
    }
  } catch (error) {
    console.error('❌ Error generating CSRF token:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
    }
  }
}

// Export for use in other modules
exports.generateCSRFToken = generateCSRFToken
