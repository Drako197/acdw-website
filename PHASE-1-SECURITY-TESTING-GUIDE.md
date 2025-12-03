# Phase 1 Security Testing Guide

**Status:** Ready for Testing  
**Date:** December 2025

---

## Overview

This guide will help you test the security features implemented in Phase 1:
- reCAPTCHA v3 integration
- Honeypot fields
- Server-side validation
- Form submission security

---

## Pre-Testing Checklist

### ✅ Environment Setup

1. **Verify reCAPTCHA Keys are Configured:**
   ```bash
   # Check Netlify environment variables
   netlify env:list
   ```
   Should see:
   - `VITE_RECAPTCHA_SITE_KEY` (public key)
   - `RECAPTCHA_SECRET_KEY` (secret key)
   - `RECAPTCHA_SCORE_THRESHOLD` (optional, defaults to 0.5)

2. **Start Development Server:**
   ```bash
   npm run dev:netlify
   # OR for production testing:
   netlify dev
   ```
   Access at: `http://localhost:8888` (Netlify Dev) or `http://localhost:5173` (Vite)

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for any errors
   - Check Network tab to monitor requests

---

## Test Cases

### **Test 1: Contact Form - Valid Submission**

**Location:** `/contact`

**Steps:**
1. Navigate to `/contact`
2. Fill out the form with valid data:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone: `(555) 123-4567`
   - Message: `This is a test message`
   - Check consent checkbox
3. Submit the form

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Form resets
- ✅ Check browser console: Should see `reCAPTCHA script loaded`
- ✅ Check Network tab: Should see POST to `/.netlify/functions/validate-form-submission`
- ✅ Response should be `200 OK` with `{"success": true}`

**How to Verify:**
- Open DevTools → Network tab
- Filter by "validate-form-submission"
- Check request payload includes `recaptcha-token`
- Check response is successful

---

### **Test 2: Contact Form - Bot Detection (Honeypot)**

**Location:** `/contact`

**Steps:**
1. Navigate to `/contact`
2. Open DevTools → Elements tab
3. Find the honeypot fields (they're hidden):
   ```html
   <input name="bot-field" />
   <input name="honeypot-1" />
   <input name="honeypot-2" />
   ```
4. Manually fill one of these fields using DevTools:
   - Right-click on `input[name="bot-field"]`
   - Select "Edit as HTML"
   - Add `value="filled-by-bot"`
5. Fill out the rest of the form normally
6. Submit the form

**Expected Results:**
- ❌ Form submission should be rejected
- ❌ Error message: "Invalid submission detected."
- ✅ Check browser console: Should see warning `Bot detected: honeypot fields filled`
- ✅ Check Network tab: Response should be `400 Bad Request`

**How to Verify:**
- Check console for bot detection log
- Check Network response shows error

---

### **Test 3: Contact Form - Invalid Email**

**Location:** `/contact`

**Steps:**
1. Navigate to `/contact`
2. Fill out form with invalid email:
   - Email: `not-an-email`
3. Try to submit

**Expected Results:**
- ❌ Form should show validation error
- ❌ Error message: "Invalid email format" or similar
- ✅ Form should not submit

**How to Verify:**
- Check for inline error message below email field
- Check email field has red border (`input-error` class)

---

### **Test 4: Promo Signup Form - Valid Submission**

**Location:** `/promo`

**Steps:**
1. Navigate to `/promo`
2. Fill out the form:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane.smith@example.com`
   - Check consent checkbox
3. Submit the form

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success page appears with "Check Your Email" message
- ✅ Check browser console: Should see `reCAPTCHA script loaded`
- ✅ Check Network tab: Should see POST to `/.netlify/functions/validate-form-submission`
- ✅ Response should be `200 OK`

**How to Verify:**
- Success page displays correctly
- Network request shows validation function was called

---

### **Test 5: Promo Signup Form - Bot Detection (Honeypot)**

**Location:** `/promo`

**Steps:**
1. Navigate to `/promo`
2. Open DevTools → Elements tab
3. Find and fill honeypot field using DevTools (same as Test 2)
4. Fill out the rest of the form normally
5. Submit the form

**Expected Results:**
- ❌ Form submission should be rejected
- ❌ Error message: "Invalid submission detected."
- ✅ Check browser console: Should see bot detection warning

---

### **Test 6: Promo Signup Form - Real-time Email Validation**

**Location:** `/promo`

**Steps:**
1. Navigate to `/promo`
2. Click in the email field
3. Type invalid email: `test@`
4. Click outside the field (blur event)

**Expected Results:**
- ✅ Error message appears immediately: "Invalid email format"
- ✅ Email field shows red border
5. Fix the email: `test@example.com`
6. Click outside the field

**Expected Results:**
- ✅ Error message disappears
- ✅ Red border is removed

---

### **Test 7: reCAPTCHA Token Generation**

**Location:** Any form (`/contact` or `/promo`)

**Steps:**
1. Navigate to a form
2. Open DevTools → Console tab
3. Fill out and submit the form
4. Check Network tab → Request to `validate-form-submission`

**Expected Results:**
- ✅ Request payload should include `recaptcha-token` field
- ✅ Token should be a long string (reCAPTCHA v3 tokens are ~1000+ characters)
- ✅ Check console: Should see `reCAPTCHA verified` log (in server logs)

**How to Verify:**
- Open Network tab → Click on `validate-form-submission` request
- Go to "Payload" or "Request" tab
- Look for `recaptcha-token` in form data

---

### **Test 8: Server-Side Validation**

**Location:** Any form

**Steps:**
1. Navigate to a form
2. Open DevTools → Network tab
3. Submit form with valid data
4. Check the response from `validate-form-submission`

**Expected Results:**
- ✅ Response should be JSON: `{"success": true, "message": "Form submitted successfully"}`
- ✅ Check server logs (Netlify Functions logs) for validation messages

**How to View Server Logs:**
```bash
# If using Netlify Dev locally
# Logs appear in terminal where you ran `netlify dev`

# For production, check Netlify Dashboard:
# Site → Functions → validate-form-submission → Logs
```

---

### **Test 9: Missing reCAPTCHA (Graceful Degradation)**

**Note:** This test verifies the form still works if reCAPTCHA fails to load

**Location:** Any form

**Steps:**
1. Navigate to a form
2. Open DevTools → Network tab
3. Block reCAPTCHA script:
   - Right-click on page → Inspect
   - Go to Network tab
   - Find request to `recaptcha/api.js`
   - Right-click → Block request
4. Refresh page
5. Fill out and submit form

**Expected Results:**
- ⚠️ Form should still submit (graceful degradation)
- ⚠️ Console may show warning: `reCAPTCHA not loaded`
- ✅ Form submission should still work (if reCAPTCHA is optional)

**Note:** In production with reCAPTCHA configured, this should still work but may log warnings.

---

### **Test 10: Rate Limiting (Future Test)**

**Status:** Not yet implemented (Phase 2)

**Note:** This will be tested in Phase 2 when rate limiting is added.

---

## Production Testing

### Before Testing in Production:

1. **Verify Environment Variables:**
   ```bash
   netlify env:list
   ```
   Ensure all reCAPTCHA keys are set in production.

2. **Deploy to Production:**
   ```bash
   git add .
   git commit -m "Phase 1: Add form security (reCAPTCHA, honeypot, validation)"
   git push origin main
   ```
   Netlify will auto-deploy.

3. **Test on Production URL:**
   - Visit `https://www.acdrainwiz.com/contact`
   - Visit `https://www.acdrainwiz.com/promo`
   - Run through the same test cases above

---

## Troubleshooting

### Issue: reCAPTCHA not loading

**Symptoms:**
- Console shows: `reCAPTCHA not loaded`
- Form submits but no token is generated

**Solutions:**
1. Check `VITE_RECAPTCHA_SITE_KEY` is set in environment variables
2. Verify the key is correct (not a placeholder)
3. Check browser console for script loading errors
4. Verify reCAPTCHA site key matches the domain

---

### Issue: Form submission fails with 400 error

**Symptoms:**
- Form shows error: "Security verification failed"
- Network shows 400 Bad Request

**Solutions:**
1. Check `RECAPTCHA_SECRET_KEY` is set in Netlify environment variables
2. Verify reCAPTCHA score threshold (default 0.5)
3. Check server logs for specific error message
4. Verify reCAPTCHA token is being generated (check Network tab)

---

### Issue: Honeypot fields visible

**Symptoms:**
- Honeypot fields are visible on the page

**Solutions:**
1. Check CSS: Fields should have `display: none` and `aria-hidden="true"`
2. Verify fields are inside a hidden div
3. Check browser DevTools → Elements to ensure they're properly hidden

---

### Issue: Validation function returns 500 error

**Symptoms:**
- Network shows 500 Internal Server Error
- Form submission fails

**Solutions:**
1. Check Netlify Functions logs for error details
2. Verify all environment variables are set
3. Check function code for syntax errors
4. Verify Netlify Functions are deployed correctly

---

## Success Criteria

✅ **All tests pass when:**
1. Valid submissions work correctly
2. Bot detection (honeypot) blocks suspicious submissions
3. Email validation works in real-time
4. reCAPTCHA tokens are generated and sent
5. Server-side validation is working
6. Error messages are clear and helpful
7. Forms degrade gracefully if reCAPTCHA fails

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Document any issues found
2. ✅ Fix any bugs discovered
3. ✅ Move to Phase 2: API & Server Security
4. ✅ Deploy to production

---

## Questions or Issues?

If you encounter any problems during testing:
1. Check the browser console for errors
2. Check Netlify Functions logs
3. Review the troubleshooting section above
4. Document the issue with screenshots/logs

---

**Last Updated:** December 2025  
**Status:** Ready for Testing

