/**
 * IP Reputation & Blacklist Utility
 * 
 * Checks IP reputation and maintains persistent blacklist
 */

const { logBotDetected } = require('./security-logger')
const { getClientIP } = require('./rate-limiter')
const { getBotBlacklistStore, isBlobsAvailable } = require('./blobs-store')

// In-memory blacklist fallback (lost on cold start)
const inMemoryBlacklist = new Map()

/**
 * Check IP reputation using AbuseIPDB
 */
async function checkIPReputation(ip) {
  const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_API_KEY
  
  if (!ABUSEIPDB_API_KEY) {
    // API key not configured - allow request (fail open)
    return { allowed: true, reason: 'Not configured', confidence: 0 }
  }
  
  // Skip private/local IPs
  if (ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return { allowed: true, reason: 'Private IP', confidence: 0 }
  }
  
  try {
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose`, {
      method: 'GET',
      headers: {
        'Key': ABUSEIPDB_API_KEY,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      // API error - allow request (fail open)
      console.warn('⚠️ AbuseIPDB API error:', response.status, response.statusText)
      return { allowed: true, reason: 'API error', confidence: 0 }
    }
    
    const data = await response.json()
    
    if (!data.data) {
      return { allowed: true, reason: 'No data returned', confidence: 0 }
    }
    
    const abuseConfidence = data.data.abuseConfidencePercentage || 0
    const isPublic = data.data.isPublic !== false // Default to true if not specified
    
    // Block if abuse confidence > 25% or is not a public IP
    if (abuseConfidence > 25 || !isPublic) {
      return {
        allowed: false,
        reason: 'IP reputation check failed',
        confidence: abuseConfidence,
        isPublic,
        usageType: data.data.usageType,
        countryCode: data.data.countryCode
      }
    }
    
    return {
      allowed: true,
      confidence: abuseConfidence,
      isPublic,
      usageType: data.data.usageType,
      countryCode: data.data.countryCode
    }
  } catch (error) {
    // Network error - allow request (fail open)
    console.warn('⚠️ AbuseIPDB API request failed:', error.message)
    return { allowed: true, reason: 'Network error', confidence: 0 }
  }
}

/**
 * Check if IP is in blacklist
 */
async function checkIPBlacklist(ip) {
  try {
    // Use in-memory storage (Blobs not working yet)
    // TODO: Enable persistent storage with Netlify Blobs later if needed
    if (false) { // Disabled until Blobs is fixed
      // Placeholder for future Blobs implementation
    } else {
      // Use in-memory fallback
      const blacklistEntry = inMemoryBlacklist.get(ip)
      
      if (blacklistEntry) {
        const { blockedAt, reason, attempts } = blacklistEntry
        const blockDuration = 24 * 60 * 60 * 1000 // 24 hours
        
        if (Date.now() - blockedAt < blockDuration) {
          return {
            blocked: true,
            reason,
            attempts,
            unblockAt: new Date(blockedAt + blockDuration).toISOString()
          }
        } else {
          // Block expired
          inMemoryBlacklist.delete(ip)
          return { blocked: false }
        }
      }
    }
    
    return { blocked: false }
  } catch (error) {
    // Error checking blacklist - allow request (fail open)
    console.warn('⚠️ Blacklist check failed:', error.message)
    return { blocked: false, reason: 'Check error' }
  }
}

/**
 * Add IP to blacklist
 */
async function addToBlacklist(ip, reason, userAgent) {
  try {
    let attempts = 1
    
    // Use in-memory storage (Blobs not working yet)
    // TODO: Enable persistent storage with Netlify Blobs later if needed
    if (false) { // Disabled until Blobs is fixed
      // Placeholder for future Blobs implementation
    } else {
      // Use in-memory fallback
      const existing = inMemoryBlacklist.get(ip)
      attempts = existing ? existing.attempts + 1 : 1
      
      inMemoryBlacklist.set(ip, {
        blockedAt: Date.now(),
        reason,
        attempts,
        ip,
        userAgent: userAgent ? userAgent.substring(0, 100) : 'unknown'
      })
    }
    
    logBotDetected('form', 'ip-blacklisted', ip, userAgent || 'unknown', {
      reason,
      attempts
    })
    
    console.log('🚫 IP added to blacklist:', {
      ip,
      reason,
      attempts,
      unblockAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
    
    return { success: true, attempts }
  } catch (error) {
    console.error('❌ Failed to add IP to blacklist:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Validate IP (reputation + blacklist)
 */
async function validateIP(ip, userAgent, formType) {
  const path = formType || 'form'
  
  // Exempt Stripe endpoints
  const STRIPE_ENDPOINTS = [
    'stripe-webhook',
    'create-checkout',
    'get-checkout-session',
    'get-price-id',
    'calculate-shipping',
    'save-shipping-address'
  ]
  
  // Skip IP checks for Stripe endpoints (they come from Stripe's IPs)
  // Note: This function is called from form validation, so we check formType instead
  if (STRIPE_ENDPOINTS.some(endpoint => path.includes(endpoint))) {
    return { allowed: true, reason: 'Stripe endpoint - exempted' }
  }
  
  // Check blacklist first (faster)
  const blacklistCheck = await checkIPBlacklist(ip)
  if (blacklistCheck.blocked) {
    logBotDetected(formType, 'ip-blacklist-hit', ip, userAgent, {
      reason: blacklistCheck.reason,
      attempts: blacklistCheck.attempts,
      unblockAt: blacklistCheck.unblockAt
    })
    
    return {
      allowed: false,
      reason: 'IP is blacklisted',
      details: blacklistCheck
    }
  }
  
  // Check IP reputation (async, doesn't block if API fails)
  const reputationCheck = await checkIPReputation(ip)
  if (!reputationCheck.allowed) {
    // Bad IP reputation - add to blacklist
    await addToBlacklist(ip, `IP reputation: ${reputationCheck.confidence}% abuse confidence`, userAgent)
    
    logBotDetected(formType, 'ip-reputation-failed', ip, userAgent, {
      confidence: reputationCheck.confidence,
      isPublic: reputationCheck.isPublic,
      countryCode: reputationCheck.countryCode
    })
    
    return {
      allowed: false,
      reason: 'IP reputation check failed',
      details: reputationCheck
    }
  }
  
  return {
    allowed: true,
    reputation: reputationCheck.confidence,
    blacklist: blacklistCheck
  }
}

module.exports = {
  checkIPReputation,
  checkIPBlacklist,
  addToBlacklist,
  validateIP
}
