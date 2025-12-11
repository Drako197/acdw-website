

const { getSecurityHeaders } = require('./utils/cors-config')

const { getStore } = require('@netlify/blobs')

/**
 * Netlify Function Handler
 */
exports.handler = async (event, context) => {

    const siteID = 
    context?.site?.id || 
    process.env.SITE_ID ||  // Reserved variable - Netlify sets this automatically
    process.env.NETLIFY_SITE_ID ||
    event.headers['x-netlify-site-id'] ||
    event.headers['x-nf-site-id'] ||
    event.headers['x-site-id']
  
  // Get token - this is the one we need to set manually
  const token = process.env.NETLIFY_TOKEN || process.env.NETLIFY_API_TOKEN
  
  console.log('Blobs configuration check:', {
    hasSiteID: !!siteID,
    hasToken: !!token,
    siteIDSource: siteID ? (
      context?.site?.id ? 'context' :
      process.env.SITE_ID ? 'env (reserved)' :
      process.env.NETLIFY_SITE_ID ? 'env (custom)' :
      'headers'
    ) : 'none',
    siteIDPrefix: siteID ? siteID.substring(0, 10) + '...' : 'none'
  })
  
  // Helper to get store with proper configuration
  const getStoreWithConfig = (storeName) => {
    // Try with explicit config if we have siteID and token
    if (siteID && token) {
      console.log(`Using explicit Blobs config for ${storeName}`)
      return getStore({
        name: storeName,
        siteID: siteID,
        token: token
      })
    }
    
    // If we have token but no siteID, try automatic detection (siteID should be auto-detected)
    if (token) {
      console.log(`Using token with auto-detected siteID for ${storeName}`)
      try {
        // Try with just token - siteID should be auto-detected
        return getStore({
          name: storeName,
          token: token
        })
      } catch (error) {
        // If that fails, try with explicit siteID from reserved env var
        if (process.env.SITE_ID) {
          return getStore({
            name: storeName,
            siteID: process.env.SITE_ID,
            token: token
          })
        }
        throw error
      }
    }
    
    // Otherwise, try automatic detection (should work in Netlify Functions)
    // Note: This might fail if Blobs isn't fully configured
    try {
      return getStore(storeName)
    } catch (error) {
      // If automatic fails, provide helpful error
      throw new Error(
        `Cannot configure Blobs store '${storeName}'. ` +
        `Netlify Blobs requires siteID and token. ` +
        `Site ID found: ${siteID ? 'Yes (auto)' : 'No'}, Token found: ${token ? 'Yes' : 'No'}. ` +
        `Please set NETLIFY_TOKEN environment variable in Netlify Dashboard → Site Settings → Environment Variables. ` +
        `Note: SITE_ID is reserved and set automatically by Netlify. ` +
        `Original error: ${error.message}`
      )
    }
  }
    const headers = getSecurityHeaders(event)

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' }),
    }
  }

  // Only allow GET and POST requests
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const results = {}
    const errors = []

    // Store 1: csrf-tokens (Required for Phase 5)
    try {
      const csrfStore = getStoreWithConfig('csrf-tokens')
      await csrfStore.set('__init__', {
        createdAt: Date.now(),
        message: 'Store initialized for CSRF token storage',
        purpose: 'One-time use CSRF tokens for form submissions',
        ttl: '15 minutes per token'
      }, { expirationTtl: 60 }) // Expires in 1 minute (just to create the store)
      
      // Delete the init entry immediately (we just needed to create the store)
      await csrfStore.delete('__init__')
      
      results['csrf-tokens'] = {
        status: 'created',
        purpose: 'CSRF token storage',
        ttl: '15 minutes per token'
      }
    } catch (error) {
      errors.push({ store: 'csrf-tokens', error: error.message })
      results['csrf-tokens'] = {
        status: 'error',
        error: error.message
      }
    }

    // Store 2: bot-blacklist (Optional for Phase 2)
    try {
      const blacklistStore = getStoreWithConfig('bot-blacklist')
      await blacklistStore.set('__init__', {
        createdAt: Date.now(),
        message: 'Store initialized for IP blacklist',
        purpose: 'Persistent IP blacklist for bot defense',
        ttl: '24 hours per IP'
      }, { expirationTtl: 60 }) // Expires in 1 minute
      
      // Delete the init entry immediately
      await blacklistStore.delete('__init__')
      
      results['bot-blacklist'] = {
        status: 'created',
        purpose: 'IP blacklist storage',
        ttl: '24 hours per IP'
      }
    } catch (error) {
      errors.push({ store: 'bot-blacklist', error: error.message })
      results['bot-blacklist'] = {
        status: 'error',
        error: error.message
      }
    }

    // Store 3: behavioral-patterns (Optional for Phase 3)
    try {
      const patternsStore = getStoreWithConfig('behavioral-patterns')
      await patternsStore.set('__init__', {
        createdAt: Date.now(),
        message: 'Store initialized for behavioral pattern tracking',
        purpose: 'Track submission patterns for bot detection',
        ttl: '1 hour per pattern'
      }, { expirationTtl: 60 }) // Expires in 1 minute
      
      // Delete the init entry immediately
      await patternsStore.delete('__init__')
      
      results['behavioral-patterns'] = {
        status: 'created',
        purpose: 'Behavioral pattern tracking',
        ttl: '1 hour per pattern'
      }
    } catch (error) {
      errors.push({ store: 'behavioral-patterns', error: error.message })
      results['behavioral-patterns'] = {
        status: 'error',
        error: error.message
      }
    }

    // Summary
    const successCount = Object.values(results).filter(r => r.status === 'created').length
    const totalCount = Object.keys(results).length

    return {
      statusCode: errors.length === 0 ? 200 : 207, // 207 = Multi-Status (some succeeded, some failed)
      headers,
      body: JSON.stringify({
        success: errors.length === 0,
        message: errors.length === 0
          ? `All ${totalCount} stores initialized successfully`
          : `${successCount}/${totalCount} stores initialized successfully`,
        stores: results,
        errors: errors.length > 0 ? errors : undefined,
        nextSteps: [
          '1. Verify stores in Netlify Dashboard → Data & Storage → Blobs',
          '2. Stores will now appear in the UI and can be browsed/managed',
          '3. Your bot defense functions will now use persistent storage'
        ]
      }),
    }
  } catch (error) {
    console.error('❌ Error initializing Blobs stores:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    }
  }
}

