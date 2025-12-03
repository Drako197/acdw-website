/**
 * Generic Form Submission Validator
 * 
 * Server-side validation to prevent bot submissions
 * Validates before forwarding to Netlify Forms
 * 
 * Supports multiple form types: contact, hero-email, promo
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

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const trimmedEmail = email?.trim() || ''
  
  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true, email: trimmedEmail }
}

/**
 * Validate form-specific fields
 */
const validateFormFields = (formType, formData) => {
  const errors = []
  
  // Handle contact form subtypes (contact-general, contact-support, contact-sales, contact-installer, contact-demo)
  if (formType.startsWith('contact-')) {
    const contactSubType = formType.replace('contact-', '')
    const firstName = formData.get('firstName')?.trim() || ''
    const lastName = formData.get('lastName')?.trim() || ''
    const message = formData.get('message')?.trim() || ''
    
    // Common fields for all contact forms
    if (!firstName) errors.push('First name is required')
    if (!lastName) errors.push('Last name is required')
    if (!message) errors.push('Message is required')
    if (message && message.length > 2000) {
      errors.push('Message must be 2000 characters or less')
    }
    
    // Form-specific required fields
    switch (contactSubType) {
      case 'support':
        // Support form requires: product, issueType
        const product = formData.get('product')?.trim() || ''
        const issueType = formData.get('issueType')?.trim() || ''
        if (!product) errors.push('Product is required')
        if (!issueType) errors.push('Issue type is required')
        break
        
      case 'sales':
        // Sales form requires: company, role, interest
        const company = formData.get('company')?.trim() || ''
        const role = formData.get('role')?.trim() || ''
        const interest = formData.get('interest')?.trim() || ''
        if (!company) errors.push('Company is required')
        if (!role) errors.push('Role is required')
        if (!interest) errors.push('Interest type is required')
        break
        
      case 'installer':
        // Installer form requires: location, productToInstall
        const location = formData.get('location')?.trim() || ''
        const productToInstall = formData.get('productToInstall')?.trim() || ''
        if (!location) errors.push('Location is required')
        if (!productToInstall) errors.push('Product to install is required')
        break
        
      case 'demo':
        // Demo form requires: company, demoType
        const demoCompany = formData.get('company')?.trim() || ''
        const demoType = formData.get('demoType')?.trim() || ''
        if (!demoCompany) errors.push('Company is required')
        if (!demoType) errors.push('Demo type is required')
        break
        
      case 'general':
        // General form - no additional required fields beyond common ones
        break
        
      default:
        console.warn(`Unknown contact form subtype: ${contactSubType}`)
    }
  } else {
    // Handle other form types
    switch (formType) {
      case 'hero-email':
      case 'promo':
        // Email-only forms - email validation handled separately
        break
        
      default:
        console.warn(`Unknown form type: ${formType}`)
    }
  }
  
  return errors
}

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
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
    // Parse form data
    const formData = new URLSearchParams(event.body)
    
    // Get form type from form data or default to 'contact'
    const formType = formData.get('form-type') || 'contact'
    
    // Get honeypot fields (field names may vary by form)
    const botField = formData.get('bot-field') || formData.get('website') || formData.get('url') || ''
    const honeypot1 = formData.get('honeypot-1') || ''
    const honeypot2 = formData.get('honeypot-2') || ''
    
    // Get reCAPTCHA token
    const recaptchaToken = formData.get('recaptcha-token') || ''
    
    // Get email for validation
    const email = formData.get('email') || ''
    
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
          formType,
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
      const scoreThreshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5')
      if (recaptchaResult.score < scoreThreshold) {
        console.warn('🚫 reCAPTCHA score too low', {
          formType,
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
        formType,
        score: recaptchaResult.score,
        action: recaptchaResult.action,
        email: email.substring(0, 20) + '...'
      })
    } else if (RECAPTCHA_SECRET_KEY) {
      // Token missing but reCAPTCHA is configured
      console.warn('⚠️ reCAPTCHA token missing (but configured)', {
        formType,
        ip,
        userAgent,
        email: email.substring(0, 20) + '...'
      })
      // Graceful degradation - allow but log
    }

    // 1. Check honeypot fields (if filled, it's a bot)
    if (botField || honeypot1 || honeypot2) {
      console.warn('🚫 Bot detected: honeypot fields filled', {
        formType,
        botField: !!botField,
        honeypot1: !!honeypot1,
        honeypot2: !!honeypot2,
        ip,
        userAgent,
        email: email.substring(0, 20) + '...'
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

    // 2. Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      errors.push(emailValidation.error)
    }

    // 3. Validate form-specific fields
    const formErrors = validateFormFields(formType, formData)
    errors.push(...formErrors)

    // 4. Check for suspicious patterns
    if (email && !email.includes('@')) {
      errors.push('Invalid email format')
    }

    // If validation failed, reject
    if (errors.length > 0) {
      console.warn('❌ Validation failed:', {
        formType,
        errors,
        email: email.substring(0, 20) + '...',
        ip,
        userAgent
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
    const netlifyFormUrl = event.headers.host 
      ? `https://${event.headers.host}/`
      : 'https://acdrainwiz.com/'
    
    console.log('✅ Validation passed, forwarding to Netlify Forms:', {
      formType,
      email: emailValidation.email?.substring(0, 20) + '...',
      ip,
      hasRecaptcha: !!recaptchaToken
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
          message: 'Form submitted successfully'
        }),
      }
    } else {
      // Netlify Forms rejected it
      const errorText = await forwardResponse.text()
      console.error('Netlify Forms error:', {
        formType,
        status: forwardResponse.status,
        error: errorText
      })
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Form submission failed',
          message: 'Unable to process your submission'
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

