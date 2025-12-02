# Step 1: Server-Side Validation with Netlify Function

## Overview
Create a Netlify Function that intercepts form submissions and validates them server-side before they reach Netlify Forms. This prevents bots from bypassing client-side validation by posting directly to Netlify.

## How It Works
1. Form submits to our Netlify Function (not directly to Netlify)
2. Function validates email format, honeypot fields, etc.
3. If valid, function forwards to Netlify Forms
4. If invalid, function rejects and logs the attempt

## Implementation Steps

### Step 1.1: Create the Netlify Function

Create file: `netlify/functions/validate-unsubscribe.js`

```javascript
/**
 * Netlify Function to validate unsubscribe form submissions
 * Prevents bot submissions by validating server-side before forwarding to Netlify Forms
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse form data
    const formData = new URLSearchParams(event.body)
    const email = formData.get('email') || ''
    const reason = formData.get('reason') || ''
    const feedback = formData.get('feedback') || ''
    const botField = formData.get('bot-field') || ''
    const website = formData.get('website') || ''
    const url = formData.get('url') || ''

    // Validation errors array
    const errors = []

    // 1. Check honeypot fields (if filled, it's a bot)
    if (botField || website || url) {
      console.warn('Bot detected: honeypot fields filled', {
        botField: !!botField,
        website: !!website,
        url: !!url,
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        userAgent: event.headers['user-agent']
      })
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid submission',
          message: 'Bot detected'
        })
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
      
      // Reject common bot patterns
      if (trimmedEmail.includes('-com') && !trimmedEmail.includes('@')) {
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
    // Reject if email looks like a domain name
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      errors.push('Invalid email format')
    }

    // If validation failed, reject
    if (errors.length > 0) {
      console.warn('Validation failed:', {
        errors,
        email: trimmedEmail,
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        userAgent: event.headers['user-agent']
      })
      
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Validation failed',
          errors: errors
        })
      }
    }

    // 5. If validation passed, forward to Netlify Forms
    // Netlify Forms expects form data at the root URL
    const netlifyFormUrl = `${event.headers.host || 'acdrainwiz.com'}/`
    
    // Forward the submission to Netlify Forms
    const forwardResponse = await fetch(netlifyFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: event.body
    })

    if (forwardResponse.ok) {
      // Success - return Netlify's response
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          message: 'Unsubscribe request processed'
        })
      }
    } else {
      // Netlify Forms rejected it
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Form submission failed',
          message: 'Unable to process unsubscribe request'
        })
      }
    }

  } catch (error) {
    console.error('Unsubscribe validation error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server error',
        message: 'An error occurred processing your request'
      })
    }
  }
}
```

### Step 1.2: Update UnsubscribePage to Use the Function

Modify `src/pages/UnsubscribePage.tsx`:

**Find this section (around line 98-103):**
```typescript
// In production, submit to Netlify
const submitUrl = window.location.origin + '/'
response = await fetch(submitUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(submissionData).toString()
})
```

**Replace with:**
```typescript
// In production, submit through validation function first
const submitUrl = window.location.origin + '/.netlify/functions/validate-unsubscribe'
response = await fetch(submitUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(submissionData).toString()
})
```

### Step 1.3: Test the Function

1. **Deploy to Netlify** (function will be created automatically)
2. **Test with valid email:**
   - Submit form with `test@example.com`
   - Should succeed

3. **Test with invalid email:**
   - Submit form with `test-com` (no @)
   - Should be rejected with 400 error

4. **Test honeypot:**
   - Fill honeypot fields (requires browser dev tools)
   - Should be rejected

### Step 1.4: Monitor Function Logs

1. Go to **Netlify Dashboard → Functions → validate-unsubscribe**
2. Check logs for:
   - Bot detection warnings
   - Validation failures
   - Suspicious patterns

## Benefits

✅ **Server-side validation** - Can't be bypassed by direct POSTs
✅ **Bot detection** - Logs suspicious activity
✅ **Email validation** - Rejects malformed emails before they reach Netlify Forms
✅ **Logging** - Track bot attempts for analysis

## Limitations

- Still requires Netlify Forms to be configured
- Function adds slight latency (~100-200ms)
- Need to maintain function code

## Next Steps

After implementing, monitor function logs for 1-2 weeks to see:
- How many bot attempts are blocked
- What patterns bots are using
- If additional validation is needed

