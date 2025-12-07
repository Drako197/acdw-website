# 🚨 Bot Attack Security Audit & Remediation Plan

## 📋 Executive Summary

**Issue:** Bot is bypassing security features and submitting malformed emails to subscription forms, specifically the unsubscribe form's "Reason" dropdown field.

**Attack Pattern:**
- Malformed emails injected into dropdown fields (should be selectable options)
- Format: `rsummersacdrainwiz-com` (missing `@`, `.` replaced with `-`)
- Emails match users who tested login features before security hardening
- Multiple submissions per day despite rate limiting
- Bypassing reCAPTCHA, honeypot, and validation function

**Critical Finding:** Bot is likely POSTing **directly to Netlify Forms endpoint** (`/`) instead of going through `/validate-form-submission` function.

---

## 🔍 Attack Analysis

### **1. Attack Vector Identified**

#### **Primary Attack: Direct Netlify Forms Submission**

**How Netlify Forms Works:**
- Netlify Forms accepts POST requests directly to root URL (`/`)
- Forms with `data-netlify="true"` are automatically processed
- **NO validation required** if bot POSTs directly to `/`
- Bypasses all security: reCAPTCHA, honeypot, rate limiting, input sanitization

**Evidence:**
```
Bot POSTs to: https://www.acdrainwiz.com/
With form data: form-name=unsubscribe, reason=rsummersacdrainwiz-com
Netlify Forms processes it → Email sent → No validation
```

**Why This Works:**
- Netlify Forms is a **separate system** from our validation function
- Our validation function (`/.netlify/functions/validate-form-submission`) is **optional**
- If bot doesn't call it, all security is bypassed

---

### **2. Email Harvesting Investigation**

#### **How Bot Got These Emails:**

**Timeline:**
- Emails are from users who tested login **before security hardening**
- This suggests emails were exposed during testing phase

**Possible Exposure Points:**

**A. Error Messages (Most Likely)**
```javascript
// BEFORE hardening - might have exposed emails in errors:
catch (error) {
  console.error('Login failed for:', email) // ❌ Exposed in logs
  setError(`Login failed for ${email}`) // ❌ Exposed in UI
}
```

**B. Network Requests**
- Browser DevTools → Network tab
- Email visible in request payloads
- If bot monitored network traffic, could harvest emails

**C. Console Logs**
- `console.log('User email:', email)` 
- Visible in browser console
- Bot could scrape console output

**D. URL Parameters**
- `?email=user@example.com`
- If emails were passed in URLs, could be logged/harvested

**E. Form Auto-Fill**
- Browser autocomplete data
- If stored in browser, could be extracted

**F. Clerk Metadata Exposure**
- If Clerk user metadata was logged/exposed
- Emails might be in public metadata

---

### **3. Malformed Email Pattern Analysis**

**Pattern:**
```
rsummersacdrainwiz-com
lucaslealbritogmail-com
infofirstclassalliance-com
```

**Transformation:**
- Original: `rsummers@acdrainwiz.com`
- Malformed: `rsummersacdrainwiz-com`
- Missing: `@` symbol
- Replaced: `.` with `-`

**Why This Format:**
1. **Bypass Email Validation:** No `@` = not recognized as email
2. **Field Injection:** Injected into dropdown (should reject invalid values)
3. **Testing:** Bot testing what gets through validation

---

### **4. Security Bypass Analysis**

#### **What's Being Bypassed:**

| Security Feature | Status | Why Bypassed |
|-----------------|--------|--------------|
| **reCAPTCHA v3** | ❌ Bypassed | Bot POSTs directly to Netlify, doesn't call validation function |
| **Honeypot Fields** | ❌ Bypassed | Netlify Forms doesn't check honeypot if POST is direct |
| **Rate Limiting** | ❌ Bypassed | Rate limiter only in validation function |
| **Input Sanitization** | ❌ Bypassed | Sanitization only in validation function |
| **Server-Side Validation** | ❌ Bypassed | Validation function never called |
| **Field Type Validation** | ❌ Bypassed | Netlify Forms accepts any string in dropdown |

---

## 🛡️ Remediation Plan

### **PHASE 1: Immediate Block (Critical - Do First)**

#### **1.1 Block Direct Netlify Forms Submissions**

**Problem:** Netlify Forms accepts direct POSTs without validation.

**Solution:** Force all form submissions through validation function.

**Implementation:**

**A. Remove `data-netlify="true"` from forms**
- Remove from all forms (unsubscribe, email-preferences, promo, contact)
- Forms will no longer auto-submit to Netlify Forms
- All submissions must go through validation function

**B. Update form submission handlers**
- Ensure ALL forms call `/.netlify/functions/validate-form-submission`
- Remove any direct POSTs to `/`
- Validation function forwards to Netlify Forms after validation

**C. Add Netlify Forms blocking rule**
- Use Netlify redirects to block direct form POSTs
- Redirect `/` POSTs to validation function

**Files to Update:**
- `src/pages/UnsubscribePage.tsx` - Remove `data-netlify="true"`
- `src/pages/EmailPreferencesPage.tsx` - Remove `data-netlify="true"`
- `src/pages/PromoPage.tsx` - Remove `data-netlify="true"`
- `src/pages/ContactPage.tsx` - Remove `data-netlify="true"`
- `src/components/home/Hero.tsx` - Remove `data-netlify="true"`

---

#### **1.2 Add Server-Side Form Name Validation**

**Problem:** Bot can submit to any form name.

**Solution:** Validate form name in validation function.

**Implementation:**
```javascript
// In validate-form-submission.js
const ALLOWED_FORM_NAMES = [
  'contact-general',
  'contact-support',
  'contact-sales',
  'contact-installer',
  'contact-demo',
  'email-preferences',
  'unsubscribe',
  'promo-signup',
  'core-upgrade',
  'hero-email'
]

const formName = formData.get('form-name')
if (!ALLOWED_FORM_NAMES.includes(formName)) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'Invalid form name' })
  }
}
```

---

#### **1.3 Add Field Type Validation**

**Problem:** Bot injects malformed emails into dropdown fields.

**Solution:** Validate dropdown values against allowed options.

**Implementation:**
```javascript
// In validate-form-submission.js
const UNSUBSCRIBE_REASONS = [
  'no-longer-interested',
  'too-many-emails',
  'never-signed-up',
  'other'
]

if (formType === 'unsubscribe') {
  const reason = formData.get('reason')
  if (reason && !UNSUBSCRIBE_REASONS.includes(reason)) {
    errors.push('Invalid reason selected')
  }
}
```

---

### **PHASE 2: Enhanced Security (High Priority)**

#### **2.1 Add CSRF Token Protection**

**Problem:** No token validation = easy to forge requests.

**Solution:** Generate unique tokens per form load.

**Implementation:**
1. Generate token on form load (server-side or client-side)
2. Include token in form submission
3. Validate token in validation function
4. Reject if token missing/invalid

**Files:**
- Create `netlify/functions/generate-csrf-token.js`
- Update all form components to request token
- Update validation function to check token

---

#### **2.2 Add Request Origin Validation**

**Problem:** Bot can POST from anywhere.

**Solution:** Validate `Origin` and `Referer` headers.

**Implementation:**
```javascript
// In validate-form-submission.js
const allowedOrigins = [
  'https://www.acdrainwiz.com',
  'https://acdrainwiz.com'
]

const origin = event.headers.origin || event.headers.referer
if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Invalid origin' })
  }
}
```

---

#### **2.3 Add User-Agent Validation**

**Problem:** Bot might use suspicious user agents.

**Solution:** Block known bot user agents.

**Implementation:**
```javascript
const BOT_USER_AGENTS = [
  'curl',
  'wget',
  'python-requests',
  'go-http-client',
  'java/',
  'scrapy'
]

const userAgent = event.headers['user-agent'] || ''
if (BOT_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot))) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Bot detected' })
  }
}
```

---

#### **2.4 Enhance Rate Limiting**

**Problem:** In-memory rate limiting resets on cold start.

**Solution:** Use persistent storage (Redis) or Netlify Edge Functions.

**Current:** In-memory Map (resets on function restart)
**Better:** Netlify Edge Functions with KV storage
**Best:** External Redis service

**Implementation:**
- Use Netlify Edge Functions for rate limiting
- Store rate limit data in Netlify KV
- More persistent across function restarts

---

### **PHASE 3: Data Exposure Remediation (High Priority)**

#### **3.1 Audit Email Exposure Points**

**Action Items:**
1. ✅ Check all `console.log()` statements for email addresses
2. ✅ Review error messages for email exposure
3. ✅ Check URL parameters for email addresses
4. ✅ Review Clerk metadata exposure
5. ✅ Check network request logging
6. ✅ Review browser DevTools exposure

**Files to Audit:**
- `src/components/auth/SignInForm.tsx`
- `src/components/auth/SignUpForm.tsx`
- `src/contexts/AuthContext.tsx`
- All form submission handlers

---

#### **3.2 Remove Email from Logs**

**Find and Replace:**
```javascript
// ❌ BAD
console.log('User email:', email)
console.error('Login failed for:', email)

// ✅ GOOD
console.log('User email:', email.substring(0, 3) + '***')
console.error('Login failed for user')
```

---

#### **3.3 Sanitize Error Messages**

**Find and Replace:**
```javascript
// ❌ BAD
setError(`Login failed for ${email}`)

// ✅ GOOD
setError('Invalid email or password')
```

---

#### **3.4 Rotate Exposed Credentials**

**Action Items:**
1. **reCAPTCHA Keys:** Generate new site key and secret key
2. **Clerk Keys:** Review Clerk API keys (if exposed)
3. **Netlify API Keys:** Check if any API keys were exposed
4. **Environment Variables:** Rotate all env vars as precaution

---

### **PHASE 4: Advanced Protection (Medium Priority)**

#### **4.1 Add IP Reputation Checking**

**Solution:** Use service like AbuseIPDB or MaxMind to check IP reputation.

**Implementation:**
- Check IP against known bot/spam databases
- Block IPs with poor reputation scores
- Log suspicious IPs for manual review

---

#### **4.2 Add Behavioral Analysis**

**Solution:** Track submission patterns to detect bots.

**Metrics to Track:**
- Time between page load and submission (< 2 seconds = bot)
- Mouse movement patterns (bots don't move mouse)
- Form field interaction order (bots fill fields instantly)
- Typing speed (bots type instantly)

---

#### **4.3 Add Honeypot Field Variations**

**Solution:** Use multiple honeypot fields with random names.

**Implementation:**
```javascript
// Generate random honeypot field names
const honeypotFields = [
  `website-${Math.random().toString(36).substring(7)}`,
  `url-${Math.random().toString(36).substring(7)}`,
  `homepage-${Math.random().toString(36).substring(7)}`
]
```

---

#### **4.4 Add Form Submission Fingerprinting**

**Solution:** Track unique browser fingerprints.

**Metrics:**
- Screen resolution
- Timezone
- Language
- Browser plugins
- Canvas fingerprint

**Block if:** Fingerprint matches known bot patterns

---

## 📊 Implementation Priority

### **🔴 CRITICAL (Do Immediately):**
1. ✅ Remove `data-netlify="true"` from all forms
2. ✅ Force all submissions through validation function
3. ✅ Add form name validation
4. ✅ Add dropdown value validation
5. ✅ Add Origin/Referer validation

### **🟠 HIGH (Do This Week):**
6. ✅ Add CSRF token protection
7. ✅ Audit and remove email exposure
8. ✅ Rotate reCAPTCHA keys
9. ✅ Enhance rate limiting (persistent storage)
10. ✅ Add User-Agent validation

### **🟡 MEDIUM (Do This Month):**
11. ✅ Add IP reputation checking
12. ✅ Add behavioral analysis
13. ✅ Add form fingerprinting

---

## 🔐 Key Changes Required

### **File: `netlify.toml`**
```toml
# Block direct Netlify Forms submissions
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/validate-form-submission"
  status = 307
  force = true
  conditions = {Method = ["POST"]}
```

### **File: `netlify/functions/validate-form-submission.js`**
- Add form name whitelist validation
- Add dropdown value validation
- Add Origin/Referer validation
- Add User-Agent validation
- Add CSRF token validation (Phase 2)

### **All Form Components:**
- Remove `data-netlify="true"`
- Ensure all POSTs go to validation function
- Add CSRF token request (Phase 2)

---

## 🧪 Testing Plan

### **Test 1: Direct POST Block**
```bash
curl -X POST https://www.acdrainwiz.com/ \
  -d "form-name=unsubscribe&email=test@example.com"
# Expected: 307 redirect to validation function or 403 error
```

### **Test 2: Invalid Form Name**
```bash
curl -X POST /.netlify/functions/validate-form-submission \
  -d "form-name=fake-form&email=test@example.com"
# Expected: 400 error "Invalid form name"
```

### **Test 3: Invalid Dropdown Value**
```bash
curl -X POST /.netlify/functions/validate-form-submission \
  -d "form-name=unsubscribe&reason=malformed-email&email=test@example.com"
# Expected: 400 error "Invalid reason selected"
```

### **Test 4: Missing Origin Header**
```bash
curl -X POST /.netlify/functions/validate-form-submission \
  -H "Origin: https://evil.com" \
  -d "form-name=unsubscribe&email=test@example.com"
# Expected: 403 error "Invalid origin"
```

---

## 📈 Success Metrics

**Before Remediation:**
- ❌ Bot submissions: Multiple per day
- ❌ Security bypass: 100% (direct POSTs work)
- ❌ Email exposure: Unknown

**After Remediation:**
- ✅ Bot submissions: 0 (blocked at validation)
- ✅ Security bypass: 0% (all submissions validated)
- ✅ Email exposure: Audited and removed

---

## ⚠️ Risk Assessment

### **Current Risk: CRITICAL**
- Bot can submit unlimited spam
- Email addresses exposed
- Security features completely bypassed
- Reputation damage from spam emails

### **After Phase 1: LOW**
- Direct POSTs blocked
- All submissions validated
- Dropdown injection prevented

### **After Phase 2: VERY LOW**
- CSRF protection added
- Enhanced validation
- Email exposure removed

---

## 🚀 Deployment Plan

### **Step 1: Backup Current State**
```bash
git checkout -b security-fix-bot-attack
git commit -am "Backup before security fixes"
```

### **Step 2: Implement Phase 1 (Critical)**
- Remove `data-netlify="true"` from all forms
- Add form name validation
- Add dropdown validation
- Add Origin validation
- Test locally

### **Step 3: Deploy to Production**
- Deploy Phase 1 changes
- Monitor for 24 hours
- Verify bot submissions stop

### **Step 4: Implement Phase 2 (High Priority)**
- Add CSRF tokens
- Audit email exposure
- Rotate keys
- Deploy

### **Step 5: Monitor & Iterate**
- Monitor logs for new attack patterns
- Adjust security as needed
- Document lessons learned

---

## 📝 Notes

- **Do NOT deploy until user approves this plan**
- **Test thoroughly in staging first**
- **Monitor closely after deployment**
- **Have rollback plan ready**

---

**Status:** ⏸️ **AWAITING USER APPROVAL**

**Next Step:** Review this plan and approve implementation order.

