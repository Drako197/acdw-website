# Phase 2 Security Testing Guide

**Date**: December 2024  
**Purpose**: Test Rate Limiting (2.2) and Input Sanitization (2.3) in Production

---

## Pre-Testing Checklist

- [ ] Confirm latest build is deployed to production
- [ ] Verify Netlify Functions are updated (check Netlify dashboard → Functions)
- [ ] Have browser DevTools ready (Network tab, Console tab)
- [ ] Have test email addresses ready
- [ ] Have test form data ready

---

## Test 1: Rate Limiting - Form Submissions

### Test 1.1: Normal Form Submission (Should Work)
1. Go to: `https://www.acdrainwiz.com/contact`
2. Fill out the **General Contact** form with valid data
3. Submit the form
4. **Expected Result**: ✅ Form submits successfully
5. **Check Network Tab**: Look for response headers:
   - `X-RateLimit-Limit: 10`
   - `X-RateLimit-Remaining: 9` (or lower)
   - `X-RateLimit-Reset: [ISO timestamp]`

### Test 1.2: Rapid Form Submissions (Should Rate Limit)
1. Go to: `https://www.acdrainwiz.com/contact`
2. Fill out the **General Contact** form
3. Submit the form **10 times rapidly** (within 1 minute)
4. **Expected Result**: 
   - First 10 submissions: ✅ Success
   - 11th submission: ❌ `429 Too Many Requests` error
   - Response includes: `Retry-After: [seconds]`
5. **Check Console**: Should see rate limit error message

### Test 1.3: Rate Limit Headers in Response
1. Submit any form
2. Open **Network tab** in DevTools
3. Click on the form submission request
4. Check **Response Headers** section
5. **Expected Headers**:
   ```
   X-RateLimit-Limit: 10
   X-RateLimit-Remaining: 9
   X-RateLimit-Reset: 2024-12-03T18:00:00.000Z
   ```

### Test 1.4: Rate Limit Reset (Wait and Retry)
1. After hitting rate limit (Test 1.2)
2. Wait for the `Retry-After` time period (usually 60 seconds)
3. Try submitting again
4. **Expected Result**: ✅ Form should submit successfully again

---

## Test 2: Rate Limiting - Unsubscribe Form (Strict Limit)

### Test 2.1: Unsubscribe Rate Limit (5 requests/minute)
1. Go to: `https://www.acdrainwiz.com/unsubscribe`
2. Fill out the unsubscribe form
3. Submit **6 times rapidly** (within 1 minute)
4. **Expected Result**:
   - First 5 submissions: ✅ Success
   - 6th submission: ❌ `429 Too Many Requests`
   - Response includes: `Retry-After: [seconds]`
5. **Check Headers**: `X-RateLimit-Limit: 5` (stricter than form limit)

---

## Test 3: Input Sanitization - XSS Protection

### Test 3.1: Script Injection Attempt
1. Go to: `https://www.acdrainwiz.com/contact`
2. Fill out the **General Contact** form
3. In the **Message** field, enter:
   ```
   <script>alert('XSS')</script>
   Hello, this is a test message.
   ```
4. Submit the form
5. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Script tags are removed from the submission
   - Check Netlify dashboard → Forms → Submissions
   - The message should show: `Hello, this is a test message.` (no script tags)

### Test 3.2: HTML Tag Removal
1. In the **Message** field, enter:
   ```
   <h1>Test</h1>
   <p>This is a <strong>test</strong> message.</p>
   ```
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ HTML tags are stripped
   - Message in Netlify should show: `Test This is a test message.`

### Test 3.3: JavaScript Event Handler Removal
1. In the **Message** field, enter:
   ```
   <img src="x" onerror="alert('XSS')">
   Test message
   ```
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Event handlers are removed
   - Message should show: `Test message` (no img tag)

### Test 3.4: Email Sanitization
1. In the **Email** field, enter:
   ```
   test<script>alert('xss')</script>@example.com
   ```
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Script tags are removed
   - Email in Netlify should show: `test@example.com`

### Test 3.5: Phone Number Sanitization
1. In the **Phone** field, enter:
   ```
   (555) 123-4567<script>alert('xss')</script>
   ```
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Script tags are removed
   - Phone should show: `(555) 123-4567`

---

## Test 4: Input Sanitization - Special Characters

### Test 4.1: Control Characters
1. In the **Message** field, enter text with control characters:
   ```
   Test\x00\x01\x02message
   ```
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Control characters are removed
   - Message should show: `Testmessage`

### Test 4.2: Max Length Enforcement
1. In the **Message** field, enter a very long string (over 5000 characters)
2. Submit the form
3. **Expected Result**: 
   - ✅ Form submits successfully
   - ❌ Message is truncated to 5000 characters

---

## Test 5: Security Headers Verification

### Test 5.1: Check Security Headers on Main Page
1. Go to: `https://www.acdrainwiz.com/`
2. Open **Network tab** in DevTools
3. Reload the page
4. Click on the main document request (the HTML page)
5. Check **Response Headers**
6. **Expected Headers**:
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://js.stripe.com; ...
   ```

### Test 5.2: Check Security Headers on API Endpoints
1. Submit any form
2. Check the **validate-form-submission** request in Network tab
3. Check **Response Headers**
4. **Expected Headers**: Same security headers as above, plus rate limit headers

### Test 5.3: Use Online Security Header Checker
1. Go to: https://securityheaders.com/
2. Enter: `https://www.acdrainwiz.com`
3. **Expected Result**: 
   - ✅ Grade: A or A+
   - ✅ All security headers present
   - ✅ No missing critical headers

---

## Test 6: API Endpoint Rate Limiting

### Test 6.1: Price ID Endpoint (30 requests/minute)
1. Open browser console on catalog page (if logged in as HVAC Pro)
2. Run this script 31 times rapidly:
   ```javascript
   fetch('/.netlify/functions/get-price-id', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ product: 'mini', quantity: 1, role: 'hvac_pro' })
   }).then(r => r.json()).then(console.log)
   ```
3. **Expected Result**:
   - First 30 requests: ✅ Success
   - 31st request: ❌ `429 Too Many Requests`
   - Response includes: `Retry-After: [seconds]`

---

## Test 7: Form Functionality (Regression Testing)

### Test 7.1: All Forms Still Work
Test each form to ensure they still function correctly:

- [ ] **General Contact** form (`/contact`)
- [ ] **Support Request** form (`/contact`)
- [ ] **Sales Inquiry** form (`/contact`)
- [ ] **Find an Installer** form (`/contact`)
- [ ] **Request Demo** form (`/contact`)
- [ ] **Promo Signup** form (`/promo`)
- [ ] **Core 1.0 Upgrade** form (from homepage)
- [ ] **Email Preferences** form (`/email-preferences`)
- [ ] **Unsubscribe** form (`/unsubscribe`)

**Expected Result**: ✅ All forms submit successfully and data appears correctly in Netlify dashboard

### Test 7.2: Form Data Integrity
1. Submit a form with all fields filled
2. Check Netlify dashboard → Forms → Submissions
3. **Expected Result**: 
   - ✅ All fields are present
   - ✅ Data is correctly formatted
   - ✅ No data loss
   - ✅ Special characters are preserved (where appropriate)
   - ✅ HTML/XSS is removed (where appropriate)

---

## Test 8: File Upload Sanitization (Core 1.0 Upgrade)

### Test 8.1: Valid Image Upload
1. Go to homepage and open Core 1.0 Upgrade modal
2. Fill out the form
3. Upload a valid image file (JPG, PNG, GIF, or WebP)
4. File size: Under 5MB
5. Submit the form
6. **Expected Result**: ✅ Form submits successfully

### Test 8.2: Invalid File Type
1. Try to upload a `.exe` or `.pdf` file
2. **Expected Result**: 
   - ❌ Client-side validation should prevent upload
   - Or server-side validation should reject it

### Test 8.3: File Size Limit
1. Try to upload an image over 5MB
2. **Expected Result**: 
   - ❌ Client-side validation should show error
   - Form should not submit

### Test 8.4: Dangerous Filename
1. Try to upload a file with name: `../../../etc/passwd.jpg`
2. **Expected Result**: 
   - ❌ Filename should be sanitized or rejected

---

## Test 9: Address Sanitization (Shipping Address)

### Test 9.1: Shipping Address with HTML
1. If logged in, go to checkout flow
2. Enter shipping address with HTML:
   ```
   Name: <script>alert('xss')</script>John Doe
   Street: <h1>123 Main St</h1>
   ```
3. **Expected Result**: 
   - ✅ Address is saved
   - ❌ HTML tags are removed
   - Address in Clerk metadata should be clean

---

## Test 10: Rate Limit Headers in All Responses

### Test 10.1: Check All Function Responses
For each Netlify Function, verify rate limit headers are present:

- [ ] `validate-form-submission` - Has rate limit headers
- [ ] `validate-unsubscribe` - Has rate limit headers
- [ ] `get-price-id` - Has rate limit headers
- [ ] `get-checkout-session` - Has rate limit headers
- [ ] `create-checkout` - Has rate limit headers
- [ ] `save-shipping-address` - Has rate limit headers
- [ ] `create-shipstation-order` - Has rate limit headers

**How to Check**:
1. Trigger each function
2. Open Network tab
3. Click on the function request
4. Check Response Headers for `X-RateLimit-*` headers

---

## Expected Test Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| Normal form submission | ✅ Success with rate limit headers | ⬜ |
| Rapid form submissions (11+) | ❌ 429 error after 10 requests | ⬜ |
| XSS script injection | ✅ Script tags removed | ⬜ |
| HTML tag removal | ✅ HTML stripped | ⬜ |
| Email sanitization | ✅ Dangerous chars removed | ⬜ |
| Security headers present | ✅ All headers present | ⬜ |
| All forms functional | ✅ All forms work | ⬜ |
| File upload validation | ✅ Size/type validated | ⬜ |
| Rate limit headers | ✅ Present in all responses | ⬜ |

---

## Troubleshooting

### Issue: Rate limiting not working
- **Check**: Netlify Functions logs for rate limit messages
- **Check**: Function code is deployed (check Netlify dashboard)
- **Check**: `utils/rate-limiter.js` exists in function directory

### Issue: Input sanitization not working
- **Check**: Netlify Functions logs for sanitization
- **Check**: `utils/input-sanitizer.js` exists in function directory
- **Check**: Form data in Netlify dashboard (should be clean)

### Issue: Security headers missing
- **Check**: `netlify.toml` is deployed
- **Check**: Headers are in the correct format
- **Check**: Netlify build completed successfully

### Issue: Forms not submitting
- **Check**: Browser console for errors
- **Check**: Network tab for failed requests
- **Check**: Rate limiting might be blocking (wait and retry)

---

## Quick Test Script

Run this in browser console on production site to quickly test rate limiting:

```javascript
// Test rate limiting on contact form
async function testRateLimit() {
  const formData = new URLSearchParams({
    'form-type': 'contact-general',
    'firstName': 'Test',
    'lastName': 'User',
    'email': 'test@example.com',
    'phone': '(555) 123-4567',
    'message': 'Rate limit test'
  });
  
  for (let i = 1; i <= 12; i++) {
    try {
      const response = await fetch('/.netlify/functions/validate-form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      
      const data = await response.json();
      console.log(`Request ${i}: ${response.status}`, {
        remaining: response.headers.get('X-RateLimit-Remaining'),
        limit: response.headers.get('X-RateLimit-Limit'),
        retryAfter: response.headers.get('Retry-After')
      });
      
      if (response.status === 429) {
        console.log('✅ Rate limit working! Blocked at request', i);
        break;
      }
    } catch (error) {
      console.error(`Request ${i} failed:`, error);
    }
  }
}

testRateLimit();
```

---

## Next Steps After Testing

1. **If all tests pass**: ✅ Ready to proceed to Phase 3
2. **If issues found**: Document them and we'll fix before Phase 3
3. **If rate limiting too strict**: We can adjust limits in `rate-limiter.js`
4. **If sanitization too aggressive**: We can adjust rules in `input-sanitizer.js`

---

**Testing Date**: _______________  
**Tester**: _______________  
**Results**: See table above

