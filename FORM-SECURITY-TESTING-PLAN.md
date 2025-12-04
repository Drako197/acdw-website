# Form Security Testing Plan

## Testing Overview

This document outlines comprehensive testing procedures for all form security features across the ACDW website.

---

## 🧪 What I Can Test Locally (Automated)

### 1. **Client-Side Validation**
- ✅ Form field validation (required fields, email format, etc.)
- ✅ Honeypot field presence and visibility
- ✅ Form submission flow (development mode simulation)
- ✅ Error handling and user feedback

### 2. **Code Review**
- ✅ reCAPTCHA hook integration
- ✅ Server validation function logic
- ✅ Honeypot field implementation
- ✅ Form type handling

---

## 🔍 What Needs Production/Manual Testing

### 1. **reCAPTCHA v3**
- ⚠️ Requires production environment with valid keys
- ⚠️ Need to verify token generation
- ⚠️ Need to verify server-side token validation
- ⚠️ Need to test score thresholds

### 2. **Server-Side Validation**
- ⚠️ Requires Netlify Functions to be deployed
- ⚠️ Need to test actual validation function responses
- ⚠️ Need to verify bot detection (honeypot rejection)
- ⚠️ Need to verify form-specific validation

### 3. **End-to-End Flow**
- ⚠️ Complete form submission → validation → Netlify Forms
- ⚠️ Error handling in production
- ⚠️ Success flow verification

---

## 📋 Testing Checklist

### **Contact Form - All 5 Types**

#### General Contact Form
- [ ] Client-side validation works
- [ ] Honeypot fields present (3 fields)
- [ ] reCAPTCHA token generated
- [ ] Server validation accepts valid submission
- [ ] Server validation rejects bot (honeypot filled)
- [ ] Server validation rejects low reCAPTCHA score
- [ ] Form-specific fields validated correctly

#### Support Request Form
- [ ] All General Contact tests
- [ ] Product field required
- [ ] Issue Type field required
- [ ] Server validates support-specific fields

#### Sales Inquiry Form
- [ ] All General Contact tests
- [ ] Company field required
- [ ] Role field required
- [ ] Interest field required
- [ ] Server validates sales-specific fields

#### Find an Installer Form
- [ ] All General Contact tests
- [ ] Location field required
- [ ] Product to Install field required
- [ ] Server validates installer-specific fields

#### Request Demo Form
- [ ] All General Contact tests
- [ ] Company field required
- [ ] Demo Type field required
- [ ] Preferred Date/Time handled correctly
- [ ] Server validates demo-specific fields

### **Promo Signup Form**
- [ ] Client-side validation works
- [ ] Honeypot fields present (3 fields)
- [ ] reCAPTCHA token generated
- [ ] Server validation accepts valid submission
- [ ] Server validation rejects bot (honeypot filled)

### **Unsubscribe Form**
- [ ] Client-side validation works
- [ ] Honeypot fields present (2 fields)
- [ ] reCAPTCHA token generated
- [ ] Rate limiting works (3 attempts per 5 minutes)
- [ ] Server validation accepts valid submission
- [ ] Confirmation step works

### **Core 1.0 Upgrade Form** (Needs Hardening)
- [ ] Client-side validation works
- [ ] Honeypot field present (1 field - needs more)
- [ ] ❌ reCAPTCHA NOT implemented
- [ ] ❌ Server validation NOT implemented
- [ ] File upload validation works

---

## 🚀 Testing Steps

### Step 1: Local Testing (I can do this)
1. Check form structure and honeypot fields
2. Verify client-side validation
3. Test form submission flow (dev mode)
4. Review code for security implementation

### Step 2: Production Testing (Need your help)
1. Test actual form submissions
2. Verify reCAPTCHA works
3. Test server-side validation
4. Test bot detection (honeypot rejection)
5. Verify Netlify Forms receives submissions

### Step 3: Bot Simulation Testing (Need your help)
1. Attempt to fill honeypot fields (should be rejected)
2. Submit without reCAPTCHA token (should be rejected)
3. Submit with invalid data (should be rejected)
4. Test rate limiting on unsubscribe form

---

## 📝 What I Need From You

### For Complete Testing:

1. **Production Access**
   - URL to production site
   - Ability to submit test forms
   - Access to Netlify dashboard (to see submissions)

2. **reCAPTCHA Keys** (if testing reCAPTCHA)
   - Site key (already in code)
   - Secret key (for server validation testing)
   - Or confirmation that keys are configured

3. **Test Scenarios**
   - Valid submissions (should succeed)
   - Bot attempts (should fail)
   - Invalid data (should fail with proper errors)

4. **Netlify Functions Status**
   - Confirmation that `validate-form-submission.js` is deployed
   - Confirmation that `validate-unsubscribe.js` is deployed
   - Environment variables set (RECAPTCHA_SECRET_KEY, etc.)

---

## 🎯 Quick Test Plan (Start Here)

### Option A: I Test Locally First
- I'll review code and test client-side features
- You test production submissions
- We compare results

### Option B: You Test Production
- I'll guide you through test scenarios
- You execute tests and report results
- I'll help fix any issues found

### Option C: Hybrid Approach (Recommended)
- I test local code structure
- You test production functionality
- We document findings together

---

## 🔧 Test Commands/Scenarios

### Test 1: Valid Submission
```
1. Fill all required fields correctly
2. Leave honeypot fields empty
3. Submit form
Expected: Success message, form resets
```

### Test 2: Bot Detection (Honeypot)
```
1. Fill honeypot fields (via browser console)
2. Submit form
Expected: Rejection, error message
```

### Test 3: Missing Required Fields
```
1. Leave required fields empty
2. Submit form
Expected: Client-side validation errors
```

### Test 4: Invalid Email
```
1. Enter invalid email format
2. Submit form
Expected: Email validation error
```

### Test 5: reCAPTCHA Verification
```
1. Submit form normally
2. Check browser console for reCAPTCHA token
3. Check Netlify function logs for token validation
Expected: Token generated and validated
```

---

## 📊 Expected Results Summary

| Form Type | reCAPTCHA | Server Validation | Honeypot | Rate Limit | Status |
|-----------|-----------|-------------------|----------|------------|--------|
| Contact (All 5) | ✅ | ✅ | ✅ (3) | ❌ | ✅ Protected |
| Promo | ✅ | ✅ | ✅ (3) | ❌ | ✅ Protected |
| Unsubscribe | ✅ | ✅ | ✅ (2) | ✅ | ✅ Protected |
| Core 1.0 Upgrade | ❌ | ❌ | ⚠️ (1) | ❌ | ⚠️ Needs Work |

---

## 🐛 Common Issues to Watch For

1. **reCAPTCHA not loading**
   - Check VITE_RECAPTCHA_SITE_KEY is set
   - Check script loads correctly
   - Check browser console for errors

2. **Server validation not working**
   - Check Netlify function is deployed
   - Check RECAPTCHA_SECRET_KEY is set
   - Check function logs in Netlify dashboard

3. **Honeypot fields visible**
   - Should be hidden with `display: none`
   - Should have `tabIndex={-1}`
   - Should have `aria-hidden="true"`

4. **Form submissions not reaching Netlify**
   - Check form-name matches Netlify form name
   - Check static form in index.html
   - Check Netlify Forms is enabled

---

## ✅ Ready to Test?

Let me know:
1. **Which approach do you prefer?** (A, B, or C)
2. **Do you have production access?** (URL, Netlify dashboard)
3. **Are reCAPTCHA keys configured?** (in production environment)
4. **Are Netlify Functions deployed?** (validate-form-submission.js, etc.)

I'll start with local code review and testing, then guide you through production testing!

