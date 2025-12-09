# 🛡️ Enhanced Bot Defense Setup Guide

**Date:** December 8, 2025  
**Purpose:** Complete setup instructions for all 6 phases of enhanced bot defense

---

## 📋 Overview

This guide covers the setup and configuration of all 6 phases of enhanced bot defense:

1. **Phase 1:** Request Fingerprinting
2. **Phase 2:** IP Reputation & Persistent Blacklist
3. **Phase 3:** Behavioral Analysis
4. **Phase 4:** Enhanced reCAPTCHA
5. **Phase 5:** CSRF Token Protection
6. **Phase 6:** Email Domain Validation

---

## ✅ Phase 1: Request Fingerprinting

**Status:** ✅ **No Setup Required**  
**Description:** Automatically checks browser headers that real browsers send but bots often miss.

**What it does:**
- Checks for required headers (`Accept`, `Accept-Language`, `Accept-Encoding`)
- Validates `Sec-Fetch-*` headers for modern browsers
- Detects suspicious header patterns

**Configuration:** None required - works automatically

---

## ✅ Phase 2: IP Reputation & Persistent Blacklist

**Status:** ⚠️ **Optional Setup Required**  
**Description:** Checks IP reputation using AbuseIPDB and maintains persistent blacklist.

### Option A: With AbuseIPDB (Recommended)

1. **Create AbuseIPDB Account:**
   - Go to https://www.abuseipdb.com/
   - Sign up for free account
   - Get API key from dashboard

2. **Add to Netlify Environment Variables:**
   - Go to **Site Settings** → **Environment Variables**
   - Add: `ABUSEIPDB_API_KEY` = (your API key)
   - Click **Save**

3. **Benefits:**
   - Real-time IP reputation checking
   - Blocks known malicious IPs
   - 90-day abuse history lookup

### Option B: Without AbuseIPDB (Fallback)

- **Status:** Works without API key (fail-open)
- **Behavior:** Uses in-memory blacklist only (not persistent)
- **Limitation:** Blacklist lost on cold start

### Netlify Blobs Setup (For Persistent Blacklist)

**Important:** Netlify Blobs stores are created automatically when you first write to them. You cannot create them via the UI.

1. **Initialize the Store (Run Once):**
   - After deploying, call the initialization function:
     ```bash
     curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
     ```
   - Or visit the URL in your browser
   - This creates the `bot-blacklist` store by writing an initial entry

2. **Verify in Dashboard:**
   - Go to Netlify Dashboard → Data & Storage → Blobs
   - You should see `bot-blacklist` store listed
   - You can browse, download, and delete entries from the UI

3. **Benefits:**
   - Persistent blacklist across deployments
   - Survives cold starts
   - 24-hour automatic expiration

**Note:** If Blobs is not configured, system uses in-memory fallback (works but not persistent).

---

## ✅ Phase 3: Behavioral Analysis

**Status:** ✅ **No Setup Required**  
**Description:** Analyzes submission patterns to detect automated behavior.

**What it does:**
- Tracks submission frequency per IP
- Detects exact-interval submissions (bot pattern)
- Validates form load time (real users take time)

**Configuration:** None required - works automatically

**Frontend Requirement:**
- Forms should include `form-load-time` hidden field:
  ```html
  <input type="hidden" name="form-load-time" value="" />
  ```
- Set value when form loads:
  ```javascript
  document.querySelector('[name="form-load-time"]').value = Date.now()
  ```

---

## ✅ Phase 4: Enhanced reCAPTCHA

**Status:** ✅ **Already Configured**  
**Description:** Stricter reCAPTCHA enforcement with higher score thresholds.

**Current Configuration:**
- **Unsubscribe form:** 0.7 threshold (stricter)
- **Other forms:** 0.5 threshold
- **Environment Variable:** `RECAPTCHA_SCORE_THRESHOLD` (optional override)

**What it does:**
- Requires reCAPTCHA token for all submissions
- Validates score (0.0 = bot, 1.0 = human)
- Verifies action matches form type

**Configuration:** Already set up - no changes needed

---

## ⚠️ Phase 5: CSRF Token Protection

**Status:** ⚠️ **Setup Required**  
**Description:** One-time use CSRF tokens to prevent replay attacks.

### Netlify Blobs Setup (Required for CSRF)

**Important:** Netlify Blobs stores are created automatically when you first write to them. You cannot create them via the UI.

1. **Initialize the Store (Run Once):**
   - After deploying, call the initialization function:
     ```bash
     curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
     ```
   - Or visit the URL in your browser
   - This creates the `csrf-tokens` store by writing an initial entry

2. **Verify in Dashboard:**
   - Go to Netlify Dashboard → Data & Storage → Blobs
   - You should see `csrf-tokens` store listed
   - You can browse, download, and delete entries from the UI

### Frontend Integration

**Step 1: Get CSRF Token on Form Load**

Add to each form page:

```javascript
// Get CSRF token when form loads
async function getCSRFToken() {
  try {
    const response = await fetch('/.netlify/functions/generate-csrf-token')
    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
    return null
  }
}

// Set token in hidden field
const csrfToken = await getCSRFToken()
if (csrfToken) {
  const csrfField = document.querySelector('[name="csrf-token"]')
  if (csrfField) {
    csrfField.value = csrfToken
  }
}
```

**Step 2: Add Hidden Field to Forms**

Add to all forms:

```html
<input type="hidden" name="csrf-token" value="" />
```

**Step 3: Include Token in Submission**

The token will automatically be included when form is submitted.

### Token Details

- **Expiration:** 15 minutes
- **One-time use:** Token is deleted after use
- **Automatic cleanup:** Expired tokens removed automatically

---

## ✅ Phase 6: Email Domain Validation

**Status:** ✅ **No Setup Required**  
**Description:** Validates email domains to block disposable emails and invalid domains.

**What it does:**
- Blocks 100+ known disposable email domains
- Validates domain has MX records (real email server)
- DNS lookup to verify domain exists

**Configuration:** None required - works automatically

**Blocked Domains:**
- `tempmail.com`
- `guerrillamail.com`
- `mailinator.com`
- `10minutemail.com`
- ... and 100+ more

**Note:** DNS lookups may add 100-500ms to validation. System fails open if DNS lookup fails.

---

## 🔧 Environment Variables Summary

Add these to Netlify Dashboard → Site Settings → Environment Variables:

### Required (Already Set)
```
RECAPTCHA_SECRET_KEY=your_secret_key
RECAPTCHA_SCORE_THRESHOLD=0.5  # Optional: override default
```

### Optional (Recommended)
```
ABUSEIPDB_API_KEY=your_api_key  # For IP reputation checking
NETLIFY_TOKEN=your_token        # For Blobs access (if auto-detection fails)
```

**Note:** `SITE_ID` is a **reserved** Netlify environment variable and is automatically set. You don't need to (and cannot) set it manually.

---

## 📊 Netlify Blobs Stores Required

1. **`bot-blacklist`** (Optional but recommended)
   - Purpose: Persistent IP blacklist
   - TTL: 24 hours per entry
   - Auto-cleanup: Yes

2. **`csrf-tokens`** (Required for Phase 5)
   - Purpose: CSRF token storage
   - TTL: 15 minutes per token
   - Auto-cleanup: Yes

3. **`behavioral-patterns`** (Optional for Phase 3)
   - Purpose: Submission pattern tracking
   - TTL: 1 hour per pattern
   - Auto-cleanup: Yes

**How to Create (Automatic):**

**Important:** Stores are created automatically when you first write to them. You cannot create them via the UI.

1. **Deploy your code** (stores will be created on first use)
2. **OR run the initialization function:**
   ```bash
   curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
   ```
3. **Verify in Dashboard:**
   - Netlify Dashboard → Data & Storage → Blobs
   - Stores will appear after first write
   - You can browse, download, and delete entries from the UI

---

## 🧪 Testing

### Test Phase 1 (Request Fingerprinting)
```bash
# Should be blocked (missing headers)
curl -X POST https://www.acdrainwiz.com/.netlify/functions/validate-form-submission \
  -d "form-name=contact-general&email=test@example.com"
```

### Test Phase 2 (IP Blacklist)
- Submit form multiple times with same IP
- Check Netlify logs for blacklist entries
- Verify IP is blocked for 24 hours

### Test Phase 3 (Behavioral Analysis)
- Submit form too quickly (< 2 seconds after load)
- Should be blocked

### Test Phase 4 (Enhanced reCAPTCHA)
- Submit form without reCAPTCHA token
- Should be blocked

### Test Phase 5 (CSRF Token)
- Submit form without CSRF token
- Should be blocked (after frontend integration)

### Test Phase 6 (Email Domain Validation)
- Submit form with disposable email (e.g., `test@tempmail.com`)
- Should be blocked

---

## 📝 Frontend Integration Checklist

- [ ] Add `form-load-time` hidden field to all forms
- [ ] Set `form-load-time` value when form loads
- [ ] Add `csrf-token` hidden field to all forms
- [ ] Call `/.netlify/functions/generate-csrf-token` on form load
- [ ] Set CSRF token value in hidden field

---

## 🚀 Deployment

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "🛡️ Implement enhanced bot defense (Phases 1-6)"
   git push origin main
   ```

2. **Verify Netlify deployment:**
   - Check Netlify Dashboard → Deploys
   - Verify all functions deployed successfully

3. **Test in production:**
   - Test each form submission
   - Check Netlify logs for security events
   - Verify bots are blocked

---

## 📊 Monitoring

### Netlify Function Logs

Check for security events:
- `🚫 Bot detected: request-fingerprint-failed`
- `🚫 Bot detected: ip-blacklisted`
- `🚫 Bot detected: behavioral-validation-failed`
- `🚫 Bot detected: email-domain-validation-failed`

### Metrics to Track

- **Bot detection rate:** How many bots blocked per day
- **False positive rate:** Legitimate users blocked (should be 0%)
- **Blacklist size:** Number of IPs in blacklist
- **CSRF token usage:** Tokens generated vs. used

---

## ⚠️ Important Notes

1. **Fail-Open Design:**
   - All security checks fail open (allow if check fails)
   - Prevents blocking legitimate users if services are down
   - Logs errors for monitoring

2. **Stripe/Clerk Exemptions:**
   - All Stripe endpoints are exempt from form security
   - Clerk has no server-side endpoints (100% safe)
   - See `SECURITY-IMPACT-ANALYSIS.md` for details

3. **Performance:**
   - Most checks are fast (< 10ms)
   - IP reputation check: 100-500ms (async, non-blocking)
   - Email domain validation: 100-500ms (async, non-blocking)

4. **Cost:**
   - AbuseIPDB: Free tier (1,000 requests/day)
   - Netlify KV: Free tier (1 GB storage)
   - No additional costs for other phases

---

## 🆘 Troubleshooting

### CSRF Tokens Not Working

**Problem:** Forms rejected with "Security token required"

**Solutions:**
1. Verify Netlify KV store `csrf-tokens` is created and linked
2. Check frontend is calling `generate-csrf-token` function
3. Verify token is included in form submission
4. Check Netlify logs for CSRF validation errors

### IP Blacklist Not Persistent

**Problem:** Blacklist lost after deployment

**Solutions:**
1. Verify Netlify KV store `bot-blacklist` is created and linked
2. Check KV store is linked to your site
3. Verify entries are being saved (check Netlify logs)

### Email Domain Validation Blocking Legitimate Users

**Problem:** Real email addresses rejected

**Solutions:**
1. Check Netlify logs for DNS lookup errors
2. System fails open if DNS lookup fails (should allow)
3. Verify email domain has MX records
4. Check if domain is in disposable list (may be false positive)

---

## ✅ Completion Checklist

- [x] Phase 1: Request Fingerprinting (automatic)
- [ ] Phase 2: IP Reputation (optional - AbuseIPDB API key)
- [ ] Phase 2: Persistent Blacklist (Netlify KV store `bot-blacklist`)
- [x] Phase 3: Behavioral Analysis (automatic - needs frontend `form-load-time`)
- [x] Phase 4: Enhanced reCAPTCHA (already configured)
- [ ] Phase 5: CSRF Tokens (Netlify KV store `csrf-tokens` + frontend integration)
- [x] Phase 6: Email Domain Validation (automatic)

---

**Ready to deploy!** 🚀

All phases are implemented. Complete the optional setup items for maximum protection.

