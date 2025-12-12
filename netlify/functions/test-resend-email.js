
const { Resend } = require('resend')
const { getSecurityHeaders } = require('./utils/cors-config')  
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'support@acdrainwiz.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'AC Drain Wiz <unsubscribe@acdrainwiz.com>'

exports.handler = async (event, context) => {

    const headers = getSecurityHeaders(event)

  // Build response with diagnostic info
  const diagnostics = {
    timestamp: new Date().toISOString(),
    resendApiKeyConfigured: !!RESEND_API_KEY && RESEND_API_KEY !== 'RESEND_API_KEY',
    resendApiKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 3) : 'NOT_SET',
    notificationEmail: NOTIFICATION_EMAIL,
    fromEmail: FROM_EMAIL,
    testResult: null,
    error: null
  }

  try {
    // Check if Resend is configured
    if (!RESEND_API_KEY || RESEND_API_KEY === 'RESEND_API_KEY') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: '❌ Resend API key not configured',
          diagnostics,
          instructions: [
            '1. Go to https://resend.com and sign up/login',
            '2. Get your API key from the dashboard',
            '3. Add RESEND_API_KEY to Netlify environment variables',
            '4. Redeploy your site'
          ]
        }),
      }
    }

    // Initialize Resend
    const resend = new Resend(RESEND_API_KEY)

    // Send test email
    const testEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Resend Email Test</h2>
            </div>
            <div class="content">
              <p class="success">This is a test email from your AC Drain Wiz unsubscribe notification system.</p>
              <p>If you received this email, Resend is configured correctly!</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p><strong>From:</strong> ${FROM_EMAIL}</p>
              <p><strong>To:</strong> ${NOTIFICATION_EMAIL}</p>
            </div>
          </div>
        </body>
      </html>
    `

    const testEmailText = `
Resend Email Test

This is a test email from your AC Drain Wiz unsubscribe notification system.

If you received this email, Resend is configured correctly!

Timestamp: ${new Date().toISOString()}
From: ${FROM_EMAIL}
To: ${NOTIFICATION_EMAIL}
    `.trim()

    // Send test email
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: '✅ Resend Email Test - AC Drain Wiz',
      html: testEmailHtml,
      text: testEmailText,
    })

    diagnostics.testResult = {
      success: true,
      emailId: result.id,
      sentTo: NOTIFICATION_EMAIL,
      sentFrom: FROM_EMAIL
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '✅ Test email sent successfully!',
        diagnostics,
        instructions: [
          `1. Check your inbox: ${NOTIFICATION_EMAIL}`,
          '2. Check spam/junk folder if not in inbox',
          '3. Check Resend dashboard: https://resend.com/emails',
          '4. Look for email with subject: "✅ Resend Email Test - AC Drain Wiz"',
          `5. Email ID: ${result.id}`
        ]
      }),
    }

  } catch (error) {
    diagnostics.error = {
      message: error.message,
      type: error.constructor.name
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        message: '❌ Error sending test email',
        diagnostics,
        error: error.message,
        instructions: [
          '1. Check Resend API key is valid',
          '2. Verify domain is verified in Resend (if using custom domain)',
          '3. Check Resend account status',
          '4. Review error message above for details'
        ]
      }),
    }
  }
}

