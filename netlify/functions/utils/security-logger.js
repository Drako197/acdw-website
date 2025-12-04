/**
 * Security Event Logger
 * 
 * Structured logging for security events
 * All logs are sent to Netlify Functions logs (accessible via Netlify dashboard)
 * 
 * Log levels:
 * - INFO: Normal security events (successful validations, etc.)
 * - WARN: Suspicious activity (rate limits, bot detection, etc.)
 * - ERROR: Security failures (validation failures, attacks, etc.)
 */

/**
 * Security event types
 */
const EVENT_TYPES = {
  // Authentication
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILURE: 'auth_failure',
  AUTH_ATTEMPT: 'auth_attempt',
  
  // Form submissions
  FORM_SUBMISSION: 'form_submission',
  FORM_VALIDATION_FAILED: 'form_validation_failed',
  FORM_BOT_DETECTED: 'form_bot_detected',
  
  // reCAPTCHA
  RECAPTCHA_SUCCESS: 'recaptcha_success',
  RECAPTCHA_FAILURE: 'recaptcha_failure',
  RECAPTCHA_LOW_SCORE: 'recaptcha_low_score',
  
  // Rate limiting
  RATE_LIMIT_HIT: 'rate_limit_hit',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  
  // Input sanitization
  XSS_ATTEMPT: 'xss_attempt',
  INJECTION_ATTEMPT: 'injection_attempt',
  
  // API access
  API_ACCESS: 'api_access',
  API_UNAUTHORIZED: 'api_unauthorized',
  API_ERROR: 'api_error',
  
  // Payment events (logged by Stripe, but we log our interactions)
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILURE: 'payment_failure',
}

/**
 * Create structured log entry
 * @param {string} level - Log level: 'info', 'warn', 'error'
 * @param {string} eventType - Event type from EVENT_TYPES
 * @param {Object} data - Event data
 * @param {Object} metadata - Additional metadata (IP, user agent, etc.)
 */
const createLogEntry = (level, eventType, data = {}, metadata = {}) => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    eventType,
    data,
    metadata: {
      ...metadata,
      environment: process.env.NODE_ENV || 'production',
      function: process.env.AWS_LAMBDA_FUNCTION_NAME || 'unknown',
    }
  }
  
  return logEntry
}

/**
 * Log security event
 * @param {string} level - 'info', 'warn', or 'error'
 * @param {string} eventType - Event type from EVENT_TYPES
 * @param {Object} data - Event-specific data
 * @param {Object} metadata - Additional metadata (IP, user agent, etc.)
 */
const logSecurityEvent = (level, eventType, data = {}, metadata = {}) => {
  const logEntry = createLogEntry(level, eventType, data, metadata)
  const logMessage = JSON.stringify(logEntry)
  
  // Use appropriate console method based on level
  switch (level.toLowerCase()) {
    case 'error':
      console.error(`🔴 [SECURITY] ${logMessage}`)
      break
    case 'warn':
      console.warn(`🟡 [SECURITY] ${logMessage}`)
      break
    case 'info':
    default:
      console.log(`🟢 [SECURITY] ${logMessage}`)
      break
  }
  
  return logEntry
}

/**
 * Log form submission event
 */
const logFormSubmission = (formType, email, ip, userAgent, success = true, errors = []) => {
  return logSecurityEvent(
    success ? 'info' : 'error',
    success ? EVENT_TYPES.FORM_SUBMISSION : EVENT_TYPES.FORM_VALIDATION_FAILED,
    {
      formType,
      email: email ? email.substring(0, 20) + '...' : 'unknown', // Partial email for privacy
      success,
      errors: errors.length > 0 ? errors : undefined,
    },
    {
      ip,
      userAgent,
    }
  )
}

/**
 * Log bot detection event
 */
const logBotDetected = (formType, reason, ip, userAgent, details = {}) => {
  return logSecurityEvent(
    'warn',
    EVENT_TYPES.FORM_BOT_DETECTED,
    {
      formType,
      reason, // 'honeypot', 'recaptcha_failed', etc.
      ...details,
    },
    {
      ip,
      userAgent,
    }
  )
}

/**
 * Log reCAPTCHA event
 */
const logRecaptcha = (success, score, action, ip, userAgent, errors = []) => {
  const level = success ? (score < 0.5 ? 'warn' : 'info') : 'error'
  const eventType = success 
    ? (score < 0.5 ? EVENT_TYPES.RECAPTCHA_LOW_SCORE : EVENT_TYPES.RECAPTCHA_SUCCESS)
    : EVENT_TYPES.RECAPTCHA_FAILURE
    
  return logSecurityEvent(
    level,
    eventType,
    {
      success,
      score,
      action,
      errors: errors.length > 0 ? errors : undefined,
    },
    {
      ip,
      userAgent,
    }
  )
}

/**
 * Log rate limit event
 */
const logRateLimit = (ip, limitType, limit, remaining, exceeded = false) => {
  return logSecurityEvent(
    exceeded ? 'warn' : 'info',
    exceeded ? EVENT_TYPES.RATE_LIMIT_EXCEEDED : EVENT_TYPES.RATE_LIMIT_HIT,
    {
      limitType, // 'form', 'api', 'strict'
      limit,
      remaining,
      exceeded,
    },
    {
      ip,
    }
  )
}

/**
 * Log XSS/injection attempt
 */
const logInjectionAttempt = (formType, field, originalValue, sanitizedValue, ip, userAgent) => {
  // Only log if sanitization actually changed the value (indicating an attack)
  if (originalValue !== sanitizedValue) {
    return logSecurityEvent(
      'warn',
      EVENT_TYPES.XSS_ATTEMPT,
      {
        formType,
        field,
        originalLength: originalValue.length,
        sanitizedLength: sanitizedValue.length,
        // Don't log the actual content (could be malicious)
        hadScriptTags: originalValue.includes('<script'),
        hadEventHandlers: /on\w+\s*=/i.test(originalValue),
      },
      {
        ip,
        userAgent,
      }
    )
  }
  return null
}

/**
 * Log API access
 */
const logAPIAccess = (endpoint, method, ip, userAgent, success = true, error = null) => {
  return logSecurityEvent(
    success ? 'info' : 'error',
    success ? EVENT_TYPES.API_ACCESS : EVENT_TYPES.API_ERROR,
    {
      endpoint,
      method,
      success,
      error: error ? error.message : undefined,
    },
    {
      ip,
      userAgent,
    }
  )
}

/**
 * Log authentication event
 */
const logAuth = (eventType, userId, email, ip, userAgent, success = true, reason = null) => {
  return logSecurityEvent(
    success ? 'info' : 'warn',
    eventType,
    {
      userId: userId ? userId.substring(0, 10) + '...' : 'unknown', // Partial ID for privacy
      email: email ? email.substring(0, 20) + '...' : 'unknown',
      success,
      reason,
    },
    {
      ip,
      userAgent,
    }
  )
}

module.exports = {
  EVENT_TYPES,
  logSecurityEvent,
  logFormSubmission,
  logBotDetected,
  logRecaptcha,
  logRateLimit,
  logInjectionAttempt,
  logAPIAccess,
  logAuth,
}

