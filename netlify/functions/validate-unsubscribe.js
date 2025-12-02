/**
 * Validate Unsubscribe Form Submission
 * 
 * Server-side validation to prevent bot submissions
 * Validates before forwarding to Netlify Forms
 */

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Get request metadata for logging
    const ip = event.headers['x-forwarded-for']?.split(',')[0] || 
               event.headers['client-ip'] || 
               event.headers['x-nf-client-connection-ip'] ||
               'unknown'
    const userAgent = event.headers['user-agent'] || 'unknown'

    // Validation errors array
    const errors = []

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      errors.push('Email is required')
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email format')
    } else {
      // Additional validation: check for domain-like strings
      const [localPart, domain] = trimmedEmail.split('@')
      if (!localPart || !domain || !domain.includes('.')) {
        errors.push('Invalid email format')
      }
      
      // Reject common bot patterns (domain-like strings without @)
      if (trimmedEmail.match(/^[a-z0-9-]+\.(com|net|org|io)$/i) && !trimmedEmail.includes('@')) {
        errors.push('Invalid email format')
      }
      
      // Reject emails that look like domain names (e.g., "test-com")
      if (trimmedEmail.includes('-com') && trimmedEmail.split('@').length === 1) {
        errors.push('Invalid email format')
      }
      
      // Reject if email is just a domain (no local part)
      if (!localPart || localPart.length === 0) {
        errors.push('Invalid email format')
      }
      
      // Reject if domain doesn't have TLD
      const domainParts = domain.split('.')
      if (domainParts.length < 2) {
        errors.push('Invalid email format')
      }
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

