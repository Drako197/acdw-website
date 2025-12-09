# 🐛 Debugging 400 Error on Form Submission

**Issue:** Form submission returns 400 Bad Request

---

## 🔍 Step 1: Check Browser Console

Open browser DevTools (F12) → Console tab

**Look for:**
```javascript
Form submission error: {
  status: 400,
  statusText: "Bad Request",
  error: "...",
  message: "...",
  errors: [...]
}
```

**Copy the full error object** - this will tell us exactly what's wrong.

---

## 🔍 Step 2: Check Netlify Function Logs

1. **Go to Netlify Dashboard** → Your Site → **Logs** → **Functions**
2. **Select function:** `validate-form-submission`
3. **Set time range:** Last hour
4. **Look for your submission** (around the time you submitted)

**What to look for:**
- `🚫 Bot detected` messages
- `❌ Validation failed` messages
- `error` or `WARN` messages
- Any 400 status codes

---

## 🎯 Common Causes of 400 Error

### 1. Accept Header Still Blocking (Fix Not Deployed Yet)

**Symptom:**
```
🚫 Bot detected: Request fingerprinting failed
suspicious-patterns: suspicious-accept-header
```

**Fix:** Wait 2-3 minutes for deployment, then try again

---

### 2. reCAPTCHA Validation Failed

**Symptom:**
```
error: 'Security verification failed'
message: 'Please refresh and try again'
```

**Possible causes:**
- reCAPTCHA token expired
- reCAPTCHA score too low
- reCAPTCHA not configured

**Fix:** Refresh page and try again

---

### 3. CSRF Token Missing/Invalid

**Symptom:**
```
error: 'Security token required'
message: 'Please refresh the page and try again'
```

**Possible causes:**
- CSRF token not generated
- Token expired (15 minutes)
- Token already used

**Fix:** Refresh page to get new token

---

### 4. Validation Errors

**Symptom:**
```
error: 'Validation failed'
errors: ['Email is required', 'Message is required']
```

**Fix:** Fill in all required fields

---

### 5. Form Load Time Too Fast

**Symptom:**
```
🚫 Bot detected: behavioral-validation-failed
Reason: Submission too fast
```

**Fix:** Wait a few seconds after page loads before submitting

---

## 🔧 Quick Fixes to Try

### Fix 1: Refresh Page
- Get fresh CSRF token
- Get fresh reCAPTCHA token
- Reset form state

### Fix 2: Wait for Deployment
- Accept header fix might not be deployed yet
- Wait 2-3 minutes after the fix was pushed
- Try again

### Fix 3: Check Required Fields
- Make sure all required fields are filled
- Check for validation errors on page

### Fix 4: Check Browser Console
- Open DevTools → Console
- Look for detailed error messages
- Copy error details

---

## 📋 What to Share

If you need help, share:

1. **Browser Console Error:**
   - Copy the full error object from console
   - Include status, error, message, errors

2. **Netlify Logs:**
   - Copy log entries around the time of submission
   - Include any `🚫`, `❌`, or `WARN` messages

3. **Form Details:**
   - Which form type (General, Support, etc.)
   - What fields you filled
   - When you submitted (time)

---

## 🧪 Test Steps

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Submit the form**
4. **Check for error messages**
5. **Copy the error details**
6. **Check Netlify logs** for server-side errors

---

**Next:** Share the error details from browser console or Netlify logs, and I'll help you fix it!

