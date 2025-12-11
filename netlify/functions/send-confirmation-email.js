
const { Resend } = require('resend')
const { getEmailTemplate } = require('./utils/email-templates')
const { getSecurityHeaders } = require('./utils/cors-config')
const { checkRateLimit, getRateLimitHeaders, getClientIP } = require('./utils/rate-limiter')
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AC Drain Wiz <noreply@acdrainwiz.com>'

// Initialize Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

/**
 * Send confirmation email to customer
 */
async function sendConfirmationEmail(formType, formData) {
  // Check if Resend is configured
  if (!resend) {
    console.warn('⚠️ Resend API key not configured - skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  // Extract email from form data
  const email = formData.email || formData.get?.('email')?.trim()
  
  if (!email) {
    console.warn('⚠️ No email address provided - cannot send confirmation email')
    return { success: false, error: 'No email address provided' }
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    console.warn('⚠️ Invalid email format - cannot send confirmation email:', email.substring(0, 10) + '***')
    return { success: false, error: 'Invalid email format' }
  }

  try {
    // Get email template based on form type
    const { subject, html } = getEmailTemplate(formType, formData)

    // Send email via Resend
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: html,
    })

    if (result.error) {
      console.error('❌ Resend API error:', result.error)
      return { success: false, error: result.error.message || 'Failed to send email' }
    }

    console.log('✅ Confirmation email sent successfully:', {
      formType,
      email: email.substring(0, 3) + '***@' + email.split('@')[1],
      messageId: result.data?.id
    })

    return { 
      success: true, 
      messageId: result.data?.id,
      email: email.substring(0, 3) + '***@' + email.split('@')[1]
    }

  } catch (error) {
    console.error('❌ Error sending confirmation email:', {
      formType,
      email: email.substring(0, 3) + '***@' + email.split('@')[1],
      error: error.message,
      stack: error.stack
    })
    
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Netlify Function Handler
 * 
 * This function can be called directly or from validate-form-submission.js
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

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
    }

    // Rate limiting
    const ip = getClientIP(event)
    const rateLimitResult = await checkRateLimit(ip, 'form')
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
    // Parse request body
    const body = JSON.parse(event.body || '{}')
    const { formType, formData } = body

    if (!formType || !formData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing formType or formData' }),
      }
    }

    // Send confirmation email
    const result = await sendConfirmationEmail(formType, formData)

    if (result.success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Confirmation email sent successfully',
          messageId: result.messageId
        }),
      }
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: result.error || 'Failed to send email'
        }),
      }
    }

  } catch (error) {
    console.error('❌ Handler error:', error)
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

// Export the send function for use in other modules
exports.sendConfirmationEmail = sendConfirmationEmail

