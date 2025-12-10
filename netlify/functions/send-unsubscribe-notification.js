/**
 * Send Unsubscribe Notification via Resend
 * 
 * Sends email notification to site owner when someone unsubscribes
 * Replaces Netlify Forms notification system
 */

const { Resend } = require('resend')

// Initialize Resend (API key from environment variable)
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'support@acdrainwiz.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'AC Drain Wiz <unsubscribe@acdrainwiz.com>'

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // CORS headers
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

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}')
    const { email, reason, feedback, ip, userAgent } = body

    // Validate required fields
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      }
    }

    // Check if Resend is configured
    if (!RESEND_API_KEY || RESEND_API_KEY === 'RESEND_API_KEY') {
      console.warn('⚠️ Resend API key not configured - skipping email notification')
      // Return success even if email fails (don't break unsubscribe flow)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Unsubscribe processed (email notification skipped - not configured)'
        }),
      }
    }

    // Initialize Resend
    const resend = new Resend(RESEND_API_KEY)

    // Build email content
    const reasonText = reason ? getReasonText(reason) : 'Not provided'
    const feedbackText = feedback || 'None'
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Unsubscribe Request</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Email Address:</div>
                <div class="value">${escapeHtml(email)}</div>
              </div>
              <div class="field">
                <div class="label">Reason:</div>
                <div class="value">${escapeHtml(reasonText)}</div>
              </div>
              <div class="field">
                <div class="label">Feedback:</div>
                <div class="value">${escapeHtml(feedbackText)}</div>
              </div>
              ${ip ? `
              <div class="field">
                <div class="label">IP Address:</div>
                <div class="value">${escapeHtml(ip)}</div>
              </div>
              ` : ''}
              ${userAgent ? `
              <div class="field">
                <div class="label">User Agent:</div>
                <div class="value">${escapeHtml(userAgent)}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This unsubscribe request was processed through the secure validation function.</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Unsubscribe Request

Email: ${email}
Reason: ${reasonText}
Feedback: ${feedbackText}
${ip ? `IP Address: ${ip}` : ''}
${userAgent ? `User Agent: ${userAgent}` : ''}

Timestamp: ${new Date().toISOString()}
    `.trim()

    // Send email via Resend
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: `Unsubscribe Request: ${email}`,
      html: emailHtml,
      text: emailText,
    })

    console.log('✅ Unsubscribe notification sent via Resend:', {
      emailId: result.id,
      to: NOTIFICATION_EMAIL,
      from: FROM_EMAIL
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        messageId: result.id
      }),
    }

  } catch (error) {
    console.error('❌ Error sending unsubscribe notification:', {
      message: error.message,
      stack: error.stack
    })

    // Don't fail the unsubscribe if email fails - log and continue
    return {
      statusCode: 200, // Return 200 so unsubscribe still succeeds
      headers,
      body: JSON.stringify({ 
        success: true,
        warning: 'Unsubscribe processed but email notification failed',
        error: error.message
      }),
    }
  }
}

/**
 * Get human-readable reason text
 */
function getReasonText(reason) {
  const reasons = {
    'too-many-emails': 'Too many emails',
    'not-relevant': 'Content not relevant',
    'never-signed-up': 'I never signed up',
    'spam': 'Emails look like spam',
    'privacy-concerns': 'Privacy concerns',
    'other': 'Other'
  }
  return reasons[reason] || reason
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.toString().replace(/[&<>"']/g, m => map[m])
}

