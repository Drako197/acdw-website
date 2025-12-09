/**
 * Request Fingerprinting Utility
 * 
 * Detects bots by checking for browser headers that real browsers always send
 * but automated tools often miss
 */

const { logBotDetected } = require('./security-logger')

/**
 * Check if request has required browser headers
 * Real browsers always send these, bots often miss them
 */
function checkBrowserHeaders(headers, ip, userAgent) {
  const missingHeaders = []
  const suspiciousPatterns = []
  
  // Required headers that real browsers always send
  const REQUIRED_HEADERS = [
    'accept',
    'accept-language',
    'accept-encoding'
  ]
  
  // Check for missing required headers
  for (const header of REQUIRED_HEADERS) {
    const headerValue = headers[header] || headers[header.toLowerCase()] || headers[header.toUpperCase()]
    if (!headerValue || headerValue.trim() === '') {
      missingHeaders.push(header)
    }
  }
  
  // Check for modern browser headers (Sec-Fetch-*)
  // Modern browsers (Chrome 76+, Firefox 69+, Safari 12.1+) send these
  const hasSecFetchSite = headers['sec-fetch-site'] || headers['Sec-Fetch-Site']
  const hasSecFetchMode = headers['sec-fetch-mode'] || headers['Sec-Fetch-Mode']
  const hasSecFetchDest = headers['sec-fetch-dest'] || headers['Sec-Fetch-Dest']
  const hasSecFetchUser = headers['sec-fetch-user'] || headers['Sec-Fetch-User']
  
  // If User-Agent claims to be modern browser but missing Sec-Fetch headers, suspicious
  const userAgentStr = userAgent || ''
  const claimsModernBrowser = (
    userAgentStr.includes('Chrome/') && userAgentStr.includes('Safari/') ||
    userAgentStr.includes('Firefox/') ||
    userAgentStr.includes('Safari/') && !userAgentStr.includes('Chrome')
  )
  
  if (claimsModernBrowser && !hasSecFetchSite && !hasSecFetchMode && !hasSecFetchDest) {
    suspiciousPatterns.push('missing-sec-fetch-headers')
  }
  
  // Check Accept header quality (real browsers send specific values)
  // For form submissions via fetch/XMLHttpRequest, Accept header can be:
  // - 'application/json' (AJAX requests)
  // - '*/*' (some fetch requests)
  // - 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' (browser navigation)
  // - 'application/x-www-form-urlencoded' (form submissions)
  const acceptHeader = headers['accept'] || headers['Accept'] || ''
  if (acceptHeader) {
    const acceptLower = acceptHeader.toLowerCase()
    // Allow common Accept header values for form submissions
    const validAcceptPatterns = [
      'text/html',
      'application/json',
      'application/x-www-form-urlencoded',
      '*/*',
      'application/xml',
      'text/xml'
    ]
    
    // Check if Accept header contains any valid pattern
    const hasValidAccept = validAcceptPatterns.some(pattern => acceptLower.includes(pattern))
    
    // Only flag as suspicious if it's completely invalid (not empty, but doesn't match any pattern)
    // Also allow wildcards and common MIME types
    if (!hasValidAccept && acceptHeader.trim() !== '' && !acceptLower.includes('*')) {
      suspiciousPatterns.push('suspicious-accept-header')
    }
  }
  
  // Check Accept-Language (real browsers send specific locales)
  const acceptLanguage = headers['accept-language'] || headers['Accept-Language'] || ''
  if (acceptLanguage && acceptLanguage.length < 5) {
    // Too short to be a real locale (e.g., "en" instead of "en-US,en;q=0.9")
    suspiciousPatterns.push('suspicious-accept-language')
  }
  
  return {
    isValid: missingHeaders.length === 0 && suspiciousPatterns.length === 0,
    missingHeaders,
    suspiciousPatterns,
    hasSecFetchHeaders: !!(hasSecFetchSite || hasSecFetchMode || hasSecFetchDest)
  }
}

/**
 * Validate request fingerprint
 * Returns true if request appears to be from a bot
 */
function validateRequestFingerprint(event, ip, userAgent) {
  const path = event.path || ''
  
  // Exempt Stripe endpoints (they don't need browser headers)
  const STRIPE_ENDPOINTS = [
    'stripe-webhook',
    'create-checkout',
    'get-checkout-session',
    'get-price-id',
    'calculate-shipping',
    'save-shipping-address'
  ]
  
  if (STRIPE_ENDPOINTS.some(endpoint => path.includes(endpoint))) {
    // Stripe endpoint - skip fingerprinting
    return { isBot: false, reason: 'Stripe endpoint - exempted' }
  }
  
  // Only apply to form submissions
  const FORM_ENDPOINTS = [
    'validate-form-submission',
    'validate-unsubscribe'
  ]
  
  if (!FORM_ENDPOINTS.some(endpoint => path.includes(endpoint))) {
    // Not a form endpoint - skip fingerprinting
    return { isBot: false, reason: 'Not a form endpoint' }
  }
  
  // Check browser headers
  const fingerprintResult = checkBrowserHeaders(event.headers, ip, userAgent)
  
  if (!fingerprintResult.isValid) {
    // Bot detected - missing headers or suspicious patterns
    const reason = fingerprintResult.missingHeaders.length > 0
      ? `missing-headers: ${fingerprintResult.missingHeaders.join(', ')}`
      : `suspicious-patterns: ${fingerprintResult.suspiciousPatterns.join(', ')}`
    
    logBotDetected(
      path.includes('unsubscribe') ? 'unsubscribe' : 'form',
      'request-fingerprint',
      ip,
      userAgent,
      {
        missingHeaders: fingerprintResult.missingHeaders,
        suspiciousPatterns: fingerprintResult.suspiciousPatterns,
        reason
      }
    )
    
    console.warn('🚫 Bot detected: Request fingerprinting failed', {
      path,
      ip,
      userAgent: userAgent.substring(0, 50),
      missingHeaders: fingerprintResult.missingHeaders,
      suspiciousPatterns: fingerprintResult.suspiciousPatterns
    })
    
    return { isBot: true, reason, details: fingerprintResult }
  }
  
  return { isBot: false, reason: 'Valid browser fingerprint' }
}

module.exports = {
  checkBrowserHeaders,
  validateRequestFingerprint
}
