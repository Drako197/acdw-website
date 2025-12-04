# Quick Testing Guide - Form Security
**Production URL:** https://www.acdrainwiz.com/contact

---

## 🚀 Quick Start Testing (5 Minutes)

### Step 1: Test Valid Submission
1. Go to: https://www.acdrainwiz.com/contact
2. Fill out the form with valid data:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Message: `This is a test submission`
3. Click Submit
4. **Expected**: Success message appears, form resets
5. **Check Netlify Dashboard**: Go to Forms → Submissions → Should see new submission

---

### Step 2: Test reCAPTCHA (Browser Console)
1. Open browser console (F12 → Console tab)
2. Go to: https://www.acdrainwiz.com/contact
3. Fill form and submit
4. **Look for in console**: 
   - Should see: `reCAPTCHA script loaded`
   - Should see token generation (no errors)
5. **If errors appear**: Note them down

---

### Step 3: Test Bot Detection (Honeypot)
1. Go to: https://www.acdrainwiz.com/contact
2. Open browser console (F12)
3. Run this command:
   ```javascript
   document.querySelector('input[name="bot-field"]').value = "bot-test"
   ```
4. Fill form normally
5. Submit form
6. **Expected**: Form should be rejected with error message
7. **If it succeeds**: Honeypot detection is NOT working

---

### Step 4: Test All 5 Contact Form Types
1. **General Contact**: Default form - test above
2. **Support**: Click "Support Request" tab, fill product + issueType, submit
3. **Sales**: Click "Sales Inquiry" tab, fill company + role + interest, submit
4. **Installer**: Click "Find an Installer" tab, fill location + productToInstall, submit
5. **Demo**: Click "Request Demo" tab, fill company + demoType + date, submit

**For each**: Check Netlify Dashboard for submission

---

### Step 5: Check Netlify Function Logs
1. Go to Netlify Dashboard
2. Navigate to: **Functions** → **validate-form-submission**
3. Click on recent invocations
4. **Look for**:
   - ✅ `✅ reCAPTCHA verified` (with score)
   - ✅ `✅ Validation passed`
   - 🚫 Any errors or warnings

---

## 📝 What to Report Back

After testing, let me know:

1. **Valid submissions**: Did they work? ✅ or ❌
2. **reCAPTCHA**: Did you see tokens in console? ✅ or ❌
3. **Honeypot test**: Was bot submission rejected? ✅ or ❌
4. **All 5 form types**: Did each submit successfully? ✅ or ❌
5. **Netlify logs**: What did you see in function logs?
6. **Any errors**: What errors appeared (if any)?

---

## 🐛 Common Issues & Quick Fixes

### Issue: "reCAPTCHA not loaded"
- **Check**: Netlify environment variable `VITE_RECAPTCHA_SITE_KEY` is set
- **Fix**: Add variable in Netlify → Site settings → Environment variables

### Issue: "Security verification failed"
- **Check**: Netlify environment variable `RECAPTCHA_SECRET_KEY` is set
- **Check**: Function logs for reCAPTCHA errors
- **Fix**: Add variable and redeploy

### Issue: Form submits but no validation
- **Check**: Netlify function `validate-form-submission.js` is deployed
- **Check**: Function logs show invocations
- **Fix**: Redeploy site to ensure function is active

---

**Ready to test?** Start with Step 1 and work through each step. Report back with your findings!

