/**
 * Validate Unsubscribe Form Submission
 * 
 * Server-side validation to prevent bot submissions
 * Validates before forwarding to Netlify Forms
 */

// reCAPTCHA verification
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

/**
 * Verify reCAPTCHA token with Google
 */
const verifyRecaptcha = async (token) => {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured - skipping verification')
    return { success: false, score: 0, error: 'Not configured' }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token
      }).toString()
    })

    const data = await response.json()
    return {
      success: data.success || false,
      score: data.score || 0,
      action: data.action || '',
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      'error-codes': data['error-codes'] || []
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false, score: 0, error: error.message }
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
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
    // Parse form data (Netlify Forms sends as URL-encoded)
    const formData = new URLSearchParams(event.body)
    const email = formData.get('email') || ''
    const reason = formData.get('reason') || ''
    const feedback = formData.get('feedback') || ''
    const botField = formData.get('bot-field') || ''
    const website = formData.get('website') || ''
    const url = formData.get('url') || ''
    const recaptchaToken = formData.get('recaptcha-token') || ''

    // Get request metadata for logging
    const ip = event.headers['x-forwarded-for']?.split(',')[0] || 
               event.headers['client-ip'] || 
               event.headers['x-nf-client-connection-ip'] ||
               'unknown'
    const userAgent = event.headers['user-agent'] || 'unknown'

    // Validation errors array
    const errors = []
    
    // 0. Verify reCAPTCHA token (if provided and configured)
    let recaptchaResult = null
    if (recaptchaToken) {
      recaptchaResult = await verifyRecaptcha(recaptchaToken)
      
      if (!recaptchaResult.success) {
        console.warn('🚫 reCAPTCHA verification failed', {
          ip,
          userAgent,
          errors: recaptchaResult['error-codes'],
          email: email.substring(0, 20) + '...'
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Security verification failed',
            message: 'Please refresh and try again'
          }),
        }
      }
      
      // Check score (0.0 = bot, 1.0 = human)
      // Threshold: 0.5 (adjust based on your needs)
      const scoreThreshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5')
      if (recaptchaResult.score < scoreThreshold) {
        console.warn('🚫 reCAPTCHA score too low', {
          score: recaptchaResult.score,
          threshold: scoreThreshold,
          ip,
          userAgent,
          email: email.substring(0, 20) + '...'
        })
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Suspicious activity detected',
            message: 'Please try again'
          }),
        }
      }
      
      console.log('✅ reCAPTCHA verified', { 
        score: recaptchaResult.score,
        action: recaptchaResult.action,
        email: email.substring(0, 20) + '...'
      })
    } else if (RECAPTCHA_SECRET_KEY) {
      // Token missing but reCAPTCHA is configured - could be bot or reCAPTCHA not loaded
      console.warn('⚠️ reCAPTCHA token missing (but configured)', {
        ip,
        userAgent,
        email: email.substring(0, 20) + '...'
      })
      // For now, we'll allow it but log it (graceful degradation)
      // You can change this to reject if you want stricter enforcement
    }

    // 1. Check honeypot fields (if filled, it's a bot)
    if (botField || website || url) {
      console.warn('🚫 Bot detected: honeypot fields filled', {
        botField: !!botField,
        website: !!website,
        url: !!url,
        ip,
        userAgent,
        email: email.substring(0, 20) + '...' // Log partial email for debugging
      })
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid submission',
          message: 'Bot detected'
        }),
      }
    }

    // 2. Validate email format (strict regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      errors.push('Email is required')
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email format')
    }

    // 3. Validate reason (if provided, must be from allowed list)
    const allowedReasons = [
      'too-many-emails',
      'not-relevant',
      'never-signed-up',
      'spam',
      'privacy-concerns',
      'other',
      '' // Empty is allowed (optional field)
    ]
    if (reason && !allowedReasons.includes(reason)) {
      errors.push('Invalid reason selected')
    }

    // 4. Check for suspicious patterns
    // Reject if email looks like a domain name (common bot pattern)
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      errors.push('Invalid email format')
    }

    // If validation failed, reject
    if (errors.length > 0) {
      console.warn('❌ Validation failed:', {
        errors,
        email: trimmedEmail.substring(0, 20) + '...',
        ip,
        userAgent,
        reason
      })
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Validation failed',
          errors: errors
        }),
      }
    }

    // 5. If validation passed, forward to Netlify Forms
    // Netlify Forms expects form data at the root URL
    const netlifyFormUrl = event.headers.host 
      ? `https://${event.headers.host}/`
      : 'https://acdrainwiz.com/'
    
    console.log('✅ Validation passed, forwarding to Netlify Forms:', {
      email: trimmedEmail.substring(0, 20) + '...',
      ip,
      hasReason: !!reason,
      hasFeedback: !!feedback
    })
    
    // Forward the submission to Netlify Forms
    const forwardResponse = await fetch(netlifyFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: event.body, // Forward original form data
    })

    if (forwardResponse.ok) {
      // Success - return Netlify's response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Unsubscribe request processed'
        }),
      }
    } else {
      // Netlify Forms rejected it
      const errorText = await forwardResponse.text()
      console.error('Netlify Forms error:', {
        status: forwardResponse.status,
        error: errorText
      })
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Form submission failed',
          message: 'Unable to process unsubscribe request'
        }),
      }
    }

  } catch (error) {
    console.error('❌ Validation error:', {
      message: error.message,
      stack: error.stack,
      body: event.body?.substring(0, 200)
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: 'An error occurred processing your request'
      }),
    }
  }
}

