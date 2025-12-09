# 🧪 Post-Fix Testing Plan

**Purpose:** Verify all security features still work after bot attack fix  
**Date:** December 9, 2025

---

## ✅ Test 1: General Contact Form (5 minutes)

### Test Case: Legitimate Submission

1. Go to `/contact?type=general`
2. Fill out all required fields:
   - First Name: Test
   - Last Name: User
   - Email: your-email@example.com
   - Customer Type: Select one
   - Message: Test message
   - Referral Source: Select one
   - Consent: Check
3. Submit form

**Expected:**
- ✅ Form submits successfully
- ✅ Success message displayed
- ✅ Form resets
- ✅ Page scrolls to top
- ✅ Submission appears in Netlify Forms dashboard
- ✅ Zapier receives data
- ✅ Pipedrive creates/updates person

**Console Check:**
- ✅ No errors
- ✅ `reCAPTCHA script loaded`
- ✅ POST to `validate-form-submission` returns 200

---

## ✅ Test 2: Unsubscribe Form (10 minutes)

### Test Case 2A: Legitimate Unsubscribe

1. Go to `/unsubscribe`
2. Enter email: your-email@example.com
3. Select reason: "Too many emails"
4. Click "Unsubscribe from All Marketing Emails"
5. Confirm in modal

**Expected:**
- ✅ Form submits successfully
- ✅ Success message: "You've Been Unsubscribed"
- ✅ Submission appears in Netlify Forms with VALID reason value
- ✅ Zapier receives data
- ✅ Pipedrive updates person

### Test Case 2B: Bot Attack Pattern (Should Be BLOCKED)

```bash
# Try to submit malformed email in reason field
curl -X POST "https://www.acdrainwiz.com/.netlify/functions/validate-unsubscribe" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "form-name=unsubscribe&email=test@example.com&reason=rsummersacdrainwiz-com&feedback="
```

**Expected:**
- ✅ Returns 400 error
- ✅ Error message: "Invalid reason selected - suspicious pattern detected"
- ✅ IP blacklisted
- ✅ NOT forwarded to Netlify Forms
- ✅ Zapier does NOT receive data

**Netlify Logs Should Show:**
```
🚨 Bot attack detected: Malformed email in reason field
🚫 Bot detected: malformed-email-in-dropdown
✅ IP added to blacklist
```

### Test Case 2C: Invalid Reason Value (Should Be BLOCKED)

```bash
# Try to submit invalid dropdown value
curl -X POST "https://www.acdrainwiz.com/.netlify/functions/validate-unsubscribe" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "form-name=unsubscribe&email=test@example.com&reason=invalid-value&feedback="
```

**Expected:**
- ✅ Returns 400 error
- ✅ Error message: "Invalid reason selected"
- ✅ NOT forwarded to Netlify Forms

---

## ✅ Test 3: Email Preferences Form (5 minutes)

1. Go to `/email-preferences`
2. Enter email
3. Select/deselect checkboxes
4. Submit

**Expected:**
- ✅ Form submits successfully
- ✅ Success message displayed
- ✅ Zapier updates Pipedrive fields

---

## ✅ Test 4: Core 1.0 Upgrade Form (5 minutes)

1. Go to homepage
2. Scroll to Heritage section
3. Click "Start Your Upgrade"
4. Fill out all fields
5. Upload image
6. Submit

**Expected:**
- ✅ Image uploads to Cloudinary
- ✅ Form submits successfully
- ✅ Success modal displayed
- ✅ Image URL in Netlify Forms
- ✅ Zapier receives all data

---

## ✅ Test 5: Security Features Working

### Honeypot Test

Fill out a form but also fill the hidden `bot-field`:

```javascript
// In browser console before submitting:
document.querySelector('input[name="bot-field"]').value = 'test'
```

**Expected:**
- ✅ Form rejected silently
- ✅ "Invalid submission detected" error
- ✅ NOT forwarded to Netlify Forms

### Rate Limiting Test

Submit same form 6+ times quickly:

**Expected:**
- ✅ First 5 submissions succeed
- ✅ 6th submission blocked
- ✅ Error: "Too many submissions. Please wait..."

### reCAPTCHA Test

Check browser console when submitting:

**Expected:**
- ✅ `reCAPTCHA script loaded`
- ✅ Token generated
- ✅ Included in form submission
- ✅ Server validates token (check Netlify logs)

---

## 🔍 Test 6: Check Netlify Forms Dashboard

1. Go to Netlify Dashboard → Forms
2. Check each form:
   - contact-general
   - contact-support
   - contact-sales
   - contact-installer
   - contact-demo
   - unsubscribe
   - email-preferences
   - core-upgrade
   - promo-signup

**Verify:**
- ✅ Submissions appear
- ✅ All fields populated correctly
- ✅ No malformed emails in dropdown fields
- ✅ Security fields present (recaptcha-token, csrf-token, form-load-time)

---

## 🎯 Test 7: Zapier Integration

Check each Zap:
1. General Contact
2. Support Request
3. Sales Inquiry
4. Find Installer
5. Request Demo
6. Promo Signup
7. Core 1.0 Upgrade
8. Email Preferences
9. Unsubscribe

**Verify:**
- ✅ Triggers firing
- ✅ Data mapping correctly
- ✅ Pipedrive receiving data
- ✅ No failed runs

---

## 📊 Success Criteria

### Must Pass:
- ✅ All legitimate form submissions work
- ✅ All security features still active
- ✅ Bot attack pattern blocked
- ✅ Zapier integrations working
- ✅ No 502 errors
- ✅ No 400 errors for legitimate users

### Monitor For:
- ⚠️ Bot attacks on unsubscribe form (should be ZERO)
- ⚠️ New attack patterns on other forms
- ⚠️ Legitimate users blocked (false positives)

---

## 🐛 If Something Breaks

### Forms Not Submitting:
1. Check browser console for errors
2. Check Netlify function logs
3. Verify reCAPTCHA configured
4. Check CSRF token generation

### Zapier Not Triggering:
1. Check Netlify Forms dashboard (data should be there)
2. Check Zapier dashboard for errors
3. Verify form name matches Zap trigger

### 502 Errors:
1. Check Netlify function logs for crashes
2. Look for JavaScript errors
3. Check for timeout issues

---

## 📝 Testing Order

1. ✅ Test unsubscribe form first (the one we just fixed)
2. ✅ Test general contact (most common)
3. ✅ Test one other form (spot check)
4. ✅ Monitor for 24 hours
5. ✅ Do comprehensive test if issues arise

---

**Ready to test!** Start with the unsubscribe form to verify the bot attack fix works.

