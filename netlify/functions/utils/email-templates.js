/**
 * Email Templates for Form Confirmation Emails
 * 
 * Modern, responsive HTML email templates with ACDW branding
 */

/**
 * Base email template wrapper with ACDW branding
 */
function getEmailBase(content, formType = 'general') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AC Drain Wiz - Confirmation</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6; color: #1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                AC Drain Wiz
              </h1>
              <p style="margin: 8px 0 0; color: #e0e7ff; font-size: 14px; font-weight: 400;">
                Professional AC Drain Line Solutions
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; font-weight: 600;">
                      Need Help?
                    </p>
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                      <strong>Phone:</strong> <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none;">(561) 654-5237</a>
                    </p>
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                      <strong>Email:</strong> <a href="mailto:ariddle@acdrainwiz.com" style="color: #2563eb; text-decoration: none;">ariddle@acdrainwiz.com</a>
                    </p>
                    <p style="margin: 12px 0 0; color: #6b7280; font-size: 13px;">
                      <a href="https://www.acdrainwiz.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">Visit Our Website</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} AC Drain Wiz. All rights reserved.
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      <a href="https://www.acdrainwiz.com/email-preferences" style="color: #6b7280; text-decoration: underline;">Manage Email Preferences</a> | 
                      <a href="https://www.acdrainwiz.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * General Contact Form Confirmation
 */
function getGeneralContactEmail(data) {
  const { firstName, lastName, email, message } = data
  const fullName = `${firstName} ${lastName}`.trim()
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">✓</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Thank You for Contacting Us!
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We've received your message and will respond soon.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Your Submission Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      <p style="margin: 12px 0 0; color: #374151; font-size: 14px;">
        <strong>Message:</strong>
      </p>
      <p style="margin: 8px 0 0; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message || 'No message provided'}</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Our team typically responds within <strong>24 hours</strong> during business days. We'll review your message and get back to you as soon as possible.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        If your inquiry is urgent, please call us at <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'general')
}

/**
 * Support Request Form Confirmation
 */
function getSupportEmail(data) {
  const { firstName, lastName, email, product, issueType, priority, message } = data
  const fullName = `${firstName} ${lastName}`.trim()
  const priorityLabel = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Not specified'
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">🔧</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Support Request Received
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We're here to help! Your support request has been logged.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Support Request Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      ${product ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Product:</strong> ${product}</p>` : ''}
      ${issueType ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Issue Type:</strong> ${issueType}</p>` : ''}
      ${priority ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Priority:</strong> ${priorityLabel}</p>` : ''}
      <p style="margin: 12px 0 0; color: #374151; font-size: 14px;">
        <strong>Description:</strong>
      </p>
      <p style="margin: 8px 0 0; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message || 'No description provided'}</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Our support team will review your request and respond within <strong>24 hours</strong> during business days. For urgent issues, please call us at <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        We'll work with you to resolve your issue as quickly as possible.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'support')
}

/**
 * Sales Inquiry Form Confirmation
 */
function getSalesEmail(data) {
  const { firstName, lastName, email, company, role, message } = data
  const fullName = `${firstName} ${lastName}`.trim()
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">💼</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Thank You for Your Interest!
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We've received your sales inquiry and will connect you with our team.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Your Inquiry Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      ${company ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Company:</strong> ${company}</p>` : ''}
      ${role ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Role:</strong> ${role}</p>` : ''}
      ${message ? `<p style="margin: 12px 0 0; color: #374151; font-size: 14px;"><strong>Message:</strong></p><p style="margin: 8px 0 0; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>` : ''}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Our sales team will review your inquiry and reach out within <strong>24 hours</strong> to discuss your needs, provide pricing information, and answer any questions you may have.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        For immediate assistance, please call us at <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'sales')
}

/**
 * Find an Installer Form Confirmation
 */
function getInstallerEmail(data) {
  const { firstName, lastName, email, location, productToInstall } = data
  const fullName = `${firstName} ${lastName}`.trim()
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">🔍</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Installer Search Request Received
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We'll help you find a qualified installer in your area.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Your Request Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      ${location ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Location:</strong> ${location}</p>` : ''}
      ${productToInstall ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Product:</strong> ${productToInstall}</p>` : ''}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        We'll search our network of certified installers in your area and connect you with qualified professionals. You can expect to hear from us within <strong>24-48 hours</strong> with installer recommendations.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        If you need immediate assistance, please call us at <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'installer')
}

/**
 * Demo Request Form Confirmation
 */
function getDemoEmail(data) {
  const { firstName, lastName, email, company, preferredDate, preferredTime, city, state } = data
  const fullName = `${firstName} ${lastName}`.trim()
  const location = city && state ? `${city}, ${state}` : (city || state || 'Not specified')
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #e0e7ff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">📅</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Demo Request Received
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We're excited to show you AC Drain Wiz in action!
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #6366f1; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Your Demo Request Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      ${company ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Company:</strong> ${company}</p>` : ''}
      ${preferredDate ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
      ${preferredTime ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
      ${location !== 'Not specified' ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Location:</strong> ${location}</p>` : ''}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Our sales team will review your demo request and contact you within <strong>24 hours</strong> to confirm the date, time, and location. We'll work with you to schedule a convenient time for your demonstration.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        For immediate scheduling, please call us at <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'demo')
}

/**
 * Promo Signup Form Confirmation
 */
function getPromoSignupEmail(data) {
  const { firstName, lastName, email } = data
  const fullName = `${firstName} ${lastName}`.trim()
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #fce7f3; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">🎉</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        You're All Set!
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Thank you for signing up for exclusive offers and updates.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #ec4899; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Welcome, ${fullName}!
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        You've successfully signed up to receive exclusive promotions, product updates, and special offers from AC Drain Wiz.
      </p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What to Expect:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
        <li>Exclusive discounts and promotional offers</li>
        <li>Product updates and new feature announcements</li>
        <li>Installation tips and maintenance guides</li>
        <li>Industry news and best practices</li>
      </ul>
      <p style="margin: 20px 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        You can manage your email preferences or unsubscribe at any time by visiting our <a href="https://www.acdrainwiz.com/email-preferences" style="color: #2563eb; text-decoration: none; font-weight: 500;">email preferences page</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'promo')
}

/**
 * Core 1.0 Upgrade Form Confirmation
 */
function getCoreUpgradeEmail(data) {
  const { firstName, lastName, email, street, city, state, zip } = data
  const fullName = `${firstName} ${lastName}`.trim()
  const address = [street, city, state, zip].filter(Boolean).join(', ')
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">⬆️</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Upgrade Request Received
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Thank you for your AC Drain Wiz Core 1.0 upgrade request!
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Your Upgrade Request Details:
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Name:</strong> ${fullName}
      </p>
      <p style="margin: 0 0 8px; color: #374151; font-size: 14px;">
        <strong>Email:</strong> ${email}
      </p>
      ${address ? `<p style="margin: 0 0 8px; color: #374151; font-size: 14px;"><strong>Shipping Address:</strong> ${address}</p>` : ''}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        What Happens Next?
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        We've received your upgrade request and proof of purchase. Our team will review your submission and send you a secure payment link for the $10.99 shipping and handling fee within <strong>7-10 business days</strong>.
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Once payment is received, we'll process your upgrade and ship your new AC Drain Wiz Core 1.0 to the address you provided.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        If you have any questions, please contact us at <a href="mailto:ariddle@acdrainwiz.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">ariddle@acdrainwiz.com</a> or call <a href="tel:+15616545237" style="color: #2563eb; text-decoration: none; font-weight: 500;">(561) 654-5237</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'upgrade')
}

/**
 * Email Preferences Update Confirmation
 */
function getEmailPreferencesEmail(data) {
  const { email } = data
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #dbeafe; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">✉️</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        Email Preferences Updated
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Your email preferences have been successfully updated.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Confirmation:
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        Your email preferences for <strong>${email}</strong> have been updated. You'll now receive emails based on your selected preferences.
      </p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        Manage Your Preferences:
      </p>
      <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        You can update your email preferences at any time by visiting our <a href="https://www.acdrainwiz.com/email-preferences" style="color: #2563eb; text-decoration: none; font-weight: 500;">email preferences page</a>.
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        If you have any questions, please contact us at <a href="mailto:ariddle@acdrainwiz.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">ariddle@acdrainwiz.com</a>.
      </p>
    </div>
  `
  
  return getEmailBase(content, 'preferences')
}

/**
 * Unsubscribe Confirmation
 */
function getUnsubscribeEmail(data) {
  const { email, reason } = data
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="font-size: 30px;">👋</span>
      </div>
      <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">
        You've Been Unsubscribed
      </h2>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        We're sorry to see you go, but we've processed your request.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
        Confirmation:
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        The email address <strong>${email}</strong> has been successfully unsubscribed from all marketing emails. You will no longer receive promotional emails from AC Drain Wiz.
      </p>
      ${reason ? `<p style="margin: 12px 0 0; color: #4b5563; font-size: 14px; line-height: 1.6;">We appreciate your feedback and will use it to improve our communications.</p>` : ''}
    </div>
    
    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 600;">
        Important Notes:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
        <li>You may still receive transactional emails (order confirmations, shipping updates, etc.)</li>
        <li>You can resubscribe at any time by visiting our <a href="https://www.acdrainwiz.com/email-preferences" style="color: #2563eb; text-decoration: none; font-weight: 500;">email preferences page</a></li>
        <li>If you have any questions, contact us at <a href="mailto:ariddle@acdrainwiz.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">ariddle@acdrainwiz.com</a></li>
      </ul>
    </div>
  `
  
  return getEmailBase(content, 'unsubscribe')
}

/**
 * Get email template based on form type
 */
function getEmailTemplate(formType, formData) {
  // Normalize form type
  const normalizedType = formType.replace('contact-', '')
  
  switch (normalizedType) {
    case 'general':
      return {
        subject: 'Thank You for Contacting AC Drain Wiz',
        html: getGeneralContactEmail(formData)
      }
    
    case 'support':
      return {
        subject: 'Support Request Received - AC Drain Wiz',
        html: getSupportEmail(formData)
      }
    
    case 'sales':
      return {
        subject: 'Thank You for Your Interest - AC Drain Wiz',
        html: getSalesEmail(formData)
      }
    
    case 'installer':
      return {
        subject: 'Installer Search Request Received - AC Drain Wiz',
        html: getInstallerEmail(formData)
      }
    
    case 'demo':
      return {
        subject: 'Demo Request Received - AC Drain Wiz',
        html: getDemoEmail(formData)
      }
    
    case 'promo-signup':
      return {
        subject: 'Welcome to AC Drain Wiz - You\'re All Set!',
        html: getPromoSignupEmail(formData)
      }
    
    case 'upgrade':
      return {
        subject: 'Core 1.0 Upgrade Request Received - AC Drain Wiz',
        html: getCoreUpgradeEmail(formData)
      }
    
    case 'email-preferences':
      return {
        subject: 'Email Preferences Updated - AC Drain Wiz',
        html: getEmailPreferencesEmail(formData)
      }
    
    case 'unsubscribe':
      return {
        subject: 'You\'ve Been Unsubscribed - AC Drain Wiz',
        html: getUnsubscribeEmail(formData)
      }
    
    default:
      // Fallback to general contact
      return {
        subject: 'Thank You for Contacting AC Drain Wiz',
        html: getGeneralContactEmail(formData)
      }
  }
}

module.exports = {
  getEmailTemplate,
  getGeneralContactEmail,
  getSupportEmail,
  getSalesEmail,
  getInstallerEmail,
  getDemoEmail,
  getPromoSignupEmail,
  getCoreUpgradeEmail,
  getEmailPreferencesEmail,
  getUnsubscribeEmail
}

