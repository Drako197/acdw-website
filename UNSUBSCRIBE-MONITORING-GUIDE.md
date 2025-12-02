# Step 3: Monitoring & Pattern Detection

## Overview
Set up monitoring to track form submissions, detect suspicious patterns, and alert on bot activity.

## What to Monitor

1. **Submission patterns** (time, frequency, IP addresses)
2. **Email format issues** (malformed emails)
3. **Honeypot triggers** (bots filling hidden fields)
4. **reCAPTCHA scores** (low scores = bots)
5. **Geographic patterns** (unusual locations)

## Implementation Options

### Option A: Netlify Function Logging (Simple)

**Update `netlify/functions/validate-unsubscribe.js`:**

Add logging function at the top:
```javascript
const logSubmission = (event, data, result) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
    userAgent: event.headers['user-agent'] || 'unknown',
    email: data.email,
    reason: data.reason,
    result: result, // 'accepted', 'rejected', 'bot_detected'
    validationErrors: data.errors || [],
    recaptchaScore: data.recaptchaScore || null
  }
  
  // Log to console (appears in Netlify Function logs)
  console.log('Unsubscribe submission:', JSON.stringify(logEntry))
  
  // You can also send to external logging service here
  // Example: send to Loggly, Datadog, etc.
}
```

**Call logging in handler:**
```javascript
// After validation, before forwarding
logSubmission(event, {
  email: trimmedEmail,
  reason: reason,
  errors: errors,
  recaptchaScore: recaptchaResult?.score
}, errors.length > 0 ? 'rejected' : 'accepted')
```

### Option B: Netlify Analytics (Built-in)

1. **Enable Netlify Analytics:**
   - Go to **Netlify Dashboard → Analytics**
   - Enable **"Forms"** analytics
   - View form submission stats

2. **Monitor:**
   - Submission count
   - Success/failure rates
   - Time patterns

### Option C: Zapier Webhook (Recommended)

**Set up Zapier to monitor submissions:**

1. **Create Zap:**
   - **Trigger:** Netlify → New Form Submission
   - **Filter:** Form name = `unsubscribe`

2. **Add Filter (Conditional):**
   - Check if email contains `@`
   - If no `@`, mark as suspicious

3. **Add Action - Send Alert:**
   - **Action:** Email or Slack notification
   - **Condition:** If email is malformed OR honeypot triggered
   - **Message:** Include IP, user agent, email

4. **Add Action - Log to Google Sheets:**
   - **Action:** Create Spreadsheet Row
   - **Fields:**
     - Timestamp
     - Email
     - IP Address
     - User Agent
     - Status (valid/suspicious/bot)
     - reCAPTCHA Score

### Option D: Custom Dashboard (Advanced)

**Create monitoring dashboard:**

1. **Store submissions in database** (Supabase, Firebase, etc.)
2. **Create dashboard** (Retool, Metabase, etc.)
3. **Track metrics:**
   - Daily submission count
   - Bot detection rate
   - Malformed email rate
   - reCAPTCHA score distribution
   - IP address patterns

## Alert Rules

### High Priority Alerts

1. **Multiple malformed emails from same IP:**
   - 3+ submissions with invalid emails in 1 hour
   - Action: Block IP address

2. **Honeypot triggered:**
   - Any submission with honeypot fields filled
   - Action: Log and reject

3. **Low reCAPTCHA scores:**
   - 5+ submissions with score < 0.3 in 1 hour
   - Action: Review and potentially block

### Medium Priority Alerts

1. **Unusual submission patterns:**
   - Submissions at odd hours (2-5 AM)
   - Very high frequency (10+ per minute)

2. **Geographic anomalies:**
   - Submissions from countries you don't serve
   - Multiple countries in short time

## Implementation Steps

### Step 3.1: Add Logging to Function

**Add to `netlify/functions/validate-unsubscribe.js`:**

```javascript
// Enhanced logging function
const logSubmission = async (event, submissionData, result, metadata = {}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: event.headers['x-forwarded-for']?.split(',')[0] || event.headers['client-ip'] || 'unknown',
    userAgent: event.headers['user-agent'] || 'unknown',
    email: submissionData.email,
    emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submissionData.email || ''),
    reason: submissionData.reason,
    result: result, // 'accepted', 'rejected', 'bot_detected'
    honeypotTriggered: metadata.honeypotTriggered || false,
    recaptchaScore: metadata.recaptchaScore || null,
    validationErrors: metadata.errors || []
  }
  
  // Log to console (Netlify Function logs)
  console.log('📊 Unsubscribe Submission:', JSON.stringify(logData))
  
  // Optional: Send to external service
  // await sendToLoggingService(logData)
  
  return logData
}
```

**Call in handler:**
```javascript
// After all validation
await logSubmission(event, {
  email: trimmedEmail,
  reason: reason
}, 
errors.length > 0 ? 'rejected' : 'accepted',
{
  honeypotTriggered: !!(botField || website || url),
  recaptchaScore: recaptchaResult?.score,
  errors: errors
})
```

### Step 3.2: Set Up Zapier Monitoring (Recommended)

1. **Create Zap:**
   ```
   Trigger: Netlify → New Form Submission
   Filter: Form name contains "unsubscribe"
   ```

2. **Add Conditional:**
   ```
   If email does NOT contain "@"
   → Mark as "SUSPICIOUS"
   ```

3. **Add Actions:**
   - **Email Alert** (if suspicious)
   - **Slack Notification** (if suspicious)
   - **Google Sheets Log** (all submissions)

### Step 3.3: Review Netlify Function Logs Weekly

1. Go to **Netlify Dashboard → Functions → validate-unsubscribe**
2. Review logs for:
   - Bot detection patterns
   - Common IP addresses
   - reCAPTCHA score trends
   - Validation failures

### Step 3.4: Create Alert Dashboard (Optional)

**Use Google Sheets or Airtable:**

1. **Create spreadsheet with columns:**
   - Date/Time
   - Email
   - IP Address
   - Status (Valid/Suspicious/Bot)
   - reCAPTCHA Score
   - User Agent

2. **Set up Zapier to populate:**
   - Every submission → New row
   - Color-code suspicious entries

3. **Review weekly:**
   - Look for patterns
   - Identify repeat offenders
   - Adjust thresholds

## Metrics to Track

### Daily Metrics
- Total submissions
- Valid submissions
- Rejected submissions
- Bot detections

### Weekly Metrics
- Bot detection rate (%)
- Average reCAPTCHA score
- Top IP addresses
- Common validation errors

### Monthly Metrics
- Trend analysis
- Effectiveness of bot detection
- False positive rate

## Alert Examples

### Email Alert Template
```
Subject: 🚨 Bot Activity Detected - Unsubscribe Form

Bot submission detected:
- Email: test-com (invalid)
- IP: 198.244.213.61
- Time: 2024-01-15 09:39 AM
- User Agent: [bot user agent]
- Honeypot: Triggered
- reCAPTCHA Score: 0.1

Action: Submission rejected
```

## Benefits

✅ **Early detection** - Catch bots before they cause issues
✅ **Pattern recognition** - Identify bot behavior trends
✅ **Data-driven decisions** - Adjust thresholds based on data
✅ **Compliance** - Track unsubscribe requests for legal requirements

## Next Steps

1. ✅ Implement logging in Netlify Function
2. ⏳ Set up Zapier monitoring
3. ⏳ Create alert rules
4. ⏳ Review logs weekly for first month
5. ⏳ Adjust thresholds based on data

