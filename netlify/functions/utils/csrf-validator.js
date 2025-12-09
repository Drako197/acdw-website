/**
 * CSRF Token Validation Utility
 * 
 * Validates CSRF tokens for form submissions
 */

const { logBotDetected } = require('./security-logger')
const { getCsrfTokenStore, isBlobsAvailable } = require('./blobs-store')

// In-memory token storage fallback
const inMemoryTokens = new Map()

/**
 * Validate CSRF token
 * 
 * @param {string} token - CSRF token to validate
 * @param {string} ip - Client IP address
 * @param {string} userAgent - Client user agent
 * @param {string} formType - Type of form being submitted
 * @returns {Promise<Object>} Validation result
 */
async function validateCSRFToken(token, ip, userAgent, formType) {
  // Get Blobs store (must be initialized in handler context)
  const kvStore = getCsrfTokenStore()
  
  // Exempt Stripe endpoints (they use signature verification, not CSRF)
  const STRIPE_ENDPOINTS = [
    'stripe-webhook',
    'create-checkout',
    'get-checkout-session',
    'get-price-id',
    'calculate-shipping',
    'save-shipping-address'
  ]
  
  if (STRIPE_ENDPOINTS.some(endpoint => formType.includes(endpoint))) {
    return { valid: true, reason: 'Stripe endpoint - exempted' }
  }
  
  if (!token || token.trim() === '') {
    logBotDetected(formType, 'missing-csrf-token', ip, userAgent)
    return {
      valid: false,
      reason: 'CSRF token required',
      details: {
        message: 'Security token is required for form submission'
      }
    }
  }
  
  try {
    let tokenData
    
    if (kvStore) {
      // Use Netlify KV (persistent)
      tokenData = await kvStore.get(`csrf:${token}`)
    } else {
      // Use in-memory fallback
      tokenData = inMemoryTokens.get(token)
    }
    
    if (!tokenData) {
      // If Blobs isn't available, fail-open (allow request) but log warning
      if (!isBlobsAvailable() || !kvStore) {
        console.warn('⚠️ CSRF token not found, but Blobs unavailable - allowing request (fail-open)', {
          formType,
          tokenPrefix: token.substring(0, 10) + '***',
          ip,
          blobsAvailable: isBlobsAvailable()
        })
        return {
          valid: true, // Fail open when Blobs unavailable
          reason: 'Blobs unavailable - token validation skipped',
          details: {
            message: 'Token validation skipped (storage unavailable)'
          }
        }
      }
      
      // Blobs is available but token not found - this is suspicious
      logBotDetected(formType, 'invalid-csrf-token', ip, userAgent, {
        token: token.substring(0, 10) + '***'
      })
      return {
        valid: false,
        reason: 'Invalid CSRF token',
        details: {
          message: 'Security token is invalid or expired'
        }
      }
    }
    
    // Check if token was already used (one-time use)
    if (tokenData.used) {
      logBotDetected(formType, 'csrf-token-reused', ip, userAgent, {
        token: token.substring(0, 10) + '***',
        firstUsed: new Date(tokenData.firstUsedAt).toISOString()
      })
      return {
        valid: false,
        reason: 'CSRF token already used',
        details: {
          message: 'Security token has already been used'
        }
      }
    }
    
    // Check expiration
    if (Date.now() > tokenData.expires) {
      logBotDetected(formType, 'expired-csrf-token', ip, userAgent, {
        token: token.substring(0, 10) + '***',
        expiredAt: new Date(tokenData.expires).toISOString()
      })
      
      // Clean up expired token
      if (kvStore) {
        await kvStore.delete(`csrf:${token}`)
      } else {
        inMemoryTokens.delete(token)
      }
      
      return {
        valid: false,
        reason: 'CSRF token expired',
        details: {
          message: 'Security token has expired. Please refresh the page and try again.'
        }
      }
    }
    
    // Optional: Check IP matches (may block legitimate users behind proxies)
    // Uncomment if you want strict IP matching
    // if (tokenData.ip !== ip) {
    //   logBotDetected(formType, 'csrf-ip-mismatch', ip, userAgent, {
    //     tokenIP: tokenData.ip,
    //     requestIP: ip
    //   })
    //   return {
    //     valid: false,
    //     reason: 'CSRF token IP mismatch',
    //     details: {
    //       message: 'Security token does not match your IP address'
    //     }
    //   }
    // }
    
    // Mark token as used (one-time use)
    tokenData.used = true
    tokenData.firstUsedAt = Date.now()
    
    if (kvStore) {
      await kvStore.set(`csrf:${token}`, tokenData, { expirationTtl: 900 }) // Keep for 15 min
    } else {
      inMemoryTokens.set(token, tokenData)
    }
    
    return {
      valid: true,
      createdAt: new Date(tokenData.createdAt).toISOString(),
      expiresAt: new Date(tokenData.expires).toISOString()
    }
  } catch (error) {
    // Error validating token - allow request (fail open)
    console.warn('⚠️ CSRF token validation failed:', error.message)
    return {
      valid: true, // Fail open
      reason: 'Validation error (allowed)',
      details: {
        error: error.message
      }
    }
  }
}

module.exports = {
  validateCSRFToken
}

