/**
 * Rate Limiter Utility for Netlify Functions
 * 
 * Implements in-memory rate limiting using a simple sliding window approach
 * Tracks requests per IP address with configurable limits
 */

// In-memory storage for rate limiting (resets on function cold start)
// In production, consider using Redis or similar for distributed rate limiting
const rateLimitStore = new Map()

// Default rate limit configuration
const DEFAULT_RATE_LIMITS = {
  // Form submissions: 10 requests per minute
  form: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  // API endpoints: 30 requests per minute
  api: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  // Strict rate limit for sensitive operations: 5 requests per minute
  strict: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  }
}

/**
 * Clean up old entries from rate limit store
 * Removes entries older than the window to prevent memory leaks
 */
const cleanupOldEntries = (windowMs) => {
  const now = Date.now()
  const cutoff = now - windowMs
  
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const filtered = timestamps.filter(ts => ts > cutoff)
    if (filtered.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, filtered)
    }
  }
}

/**
 * Check if request should be rate limited
 * @param {string} ip - Client IP address
 * @param {string} type - Rate limit type: 'form', 'api', or 'strict'
 * @returns {Object} - { allowed: boolean, remaining: number, resetTime: number }
 */
const checkRateLimit = (ip, type = 'form') => {
  const config = DEFAULT_RATE_LIMITS[type] || DEFAULT_RATE_LIMITS.form
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Clean up old entries periodically (every 10th request)
  if (Math.random() < 0.1) {
    cleanupOldEntries(config.windowMs * 2)
  }
  
  // Get or create timestamps array for this IP
  const key = `${ip}:${type}`
  let timestamps = rateLimitStore.get(key) || []
  
  // Filter out timestamps outside the current window
  timestamps = timestamps.filter(ts => ts > windowStart)
  
  // Check if limit exceeded
  const count = timestamps.length
  const allowed = count < config.maxRequests
  
  if (allowed) {
    // Add current request timestamp
    timestamps.push(now)
    rateLimitStore.set(key, timestamps)
  }
  
  // Calculate reset time (oldest timestamp + window)
  const resetTime = timestamps.length > 0 
    ? Math.max(...timestamps) + config.windowMs 
    : now + config.windowMs
  
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - count - (allowed ? 1 : 0)),
    limit: config.maxRequests,
    resetTime,
    retryAfter: allowed ? 0 : Math.ceil((resetTime - now) / 1000)
  }
}

/**
 * Get rate limit headers for response
 * @param {Object} rateLimitResult - Result from checkRateLimit
 * @returns {Object} - Headers object
 */
const getRateLimitHeaders = (rateLimitResult) => {
  return {
    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    ...(rateLimitResult.retryAfter > 0 && {
      'Retry-After': rateLimitResult.retryAfter.toString()
    })
  }
}

/**
 * Extract client IP from Netlify event
 * @param {Object} event - Netlify function event
 * @returns {string} - Client IP address
 */
const getClientIP = (event) => {
  return event.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         event.headers['client-ip'] || 
         event.headers['x-nf-client-connection-ip'] ||
         event.headers['x-real-ip'] ||
         'unknown'
}

module.exports = {
  checkRateLimit,
  getRateLimitHeaders,
  getClientIP,
  DEFAULT_RATE_LIMITS
}

