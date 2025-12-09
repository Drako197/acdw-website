# 🔍 Bot Attack Root Cause Analysis

**Date:** December 9, 2025  
**Critical Finding:** Hidden form schema mismatch enabling bot attacks

---

## 🎯 The Attack Pattern

Bots are submitting **malformed emails** into the **reason dropdown field**:
- `rsummersacdrainwiz-com` (@ replaced with -)
- `lucaslealbritogmail-com` (@ replaced with -)  
- `infofirstclassalliance-com` (@ replaced with -)

These are real emails they harvested, but submitting them to the WRONG field to evade validation.

---

## 🐛 The Root Cause: Schema Mismatch

### The Hidden Form (index.html Line 137-141)

```html
<form name="unsubscribe" data-netlify="true" hidden>
  <input type="email" name="email" />
  <input type="text" name="reason" />  ⚠️ PROBLEM: text input!
  <textarea name="feedback"></textarea>
</form>
```

### The Actual Form (UnsubscribePage.tsx Line 380-395)

```tsx
<select name="reason">  ✅ Dropdown with specific values
  <option value="">Select a reason</option>
  <option value="too-many-emails">Too many emails</option>
  <option value="not-relevant">Content not relevant</option>
  <option value="never-signed-up">I never signed up</option>
  <option value="spam">Emails look like spam</option>
  <option value="privacy-concerns">Privacy concerns</option>
  <option value="other">Other</option>
</select>
```

### The Problem

**Netlify Forms uses the HIDDEN form as the field schema**, not the actual React component!

Since `reason` is defined as `type="text"` in the hidden form:
- Netlify accepts ANY text in the reason field
- Bots can submit malformed emails like "rsummersacdrainwiz-com"  
- This bypasses our dropdown validation

---

## 🔓 How Bots Are Bypassing Security

### Theory 1: Direct Netlify Forms Submission (Most Likely)

Bots may have discovered Netlify's **form submission endpoint**:

```
POST https://www.acdrainwiz.com/?form-name=unsubscribe
```

Even though we have a redirect rule for `POST /`, Netlify Forms might be accepting submissions with a query parameter that bypasses the redirect.

### Evidence:
1. **Hidden form exists** in index.html with `data-netlify="true"`
2. **Netlify detects this** and creates a form handler
3. **Bots can POST directly** to `/?form-name=unsubscribe`
4. **Our redirect** (`POST /` → validation function) might not catch this specific pattern

### Theory 2: Form Name Mismatch

Our redirect rule:
```toml
[[redirects]]
  from = "/"
  to = "/.netlify/functions/validate-form-submission"
  status = 307
  force = true
  conditions = {Method = ["POST"]}
```

But the unsubscribe form submits to a **different endpoint**:
```tsx
// UnsubscribePage.tsx line 210
const submitUrl = window.location.origin + '/.netlify/functions/validate-unsubscribe'
```

So legitimate users go through `validate-unsubscribe`, but bots might be:
1. POSTing directly to `/?form-name=unsubscribe`  
2. Bypassing our validation entirely
3. Going straight to Netlify Forms

---

## 🕵️ Evidence From Attack Pattern

### What We Know

1. **Malformed emails in reason field**
   - Real emails with @ replaced by -
   - Submitted to dropdown that should only accept specific values
   - Netlify Forms accepts it because hidden form schema allows text

2. **All security measures bypassed**
   - reCAPTCHA ✅ (we have this)
   - Honeypot ✅ (we have this)
   - Rate limiting ✅ (we have this)  
   - CSRF tokens ✅ (we have this)
   - Request fingerprinting ✅ (we have this)
   - IP blacklist ✅ (we have this)
   - Behavioral analysis ✅ (we have this)
   - Email domain validation ✅ (we have this)

3. **They're STILL getting through**
   - This means they're NOT going through our validation function at all
   - They found a way to submit directly to Netlify Forms
   - They're exploiting the hidden form schema

---

## 🎯 Why All Our Security Failed

### The Bypass Route

```
BOT → Direct POST to /?form-name=unsubscribe
     ↓
     Skip our validation function entirely  
     ↓
     Go straight to Netlify Forms handler
     ↓
     Netlify accepts it (matches hidden form schema)
     ↓
     Forwarded to Zapier → Pipedrive → Email
```

### Our Security (All Bypassed)

```
LEGITIMATE USER → React form with validations
                ↓
                /.netlify/functions/validate-unsubscribe
                ↓
                ✅ reCAPTCHA check
                ✅ CSRF token validation
                ✅ Honeypot check
                ✅ Rate limiting
                ✅ IP reputation
                ✅ Behavioral analysis
                ✅ Email domain validation
                ↓
                Forward to Netlify Forms
                ↓
                Success ✅
```

**The bot is taking a completely different route!**

---

## 🔬 How to Confirm This Theory

### Test 1: Check Netlify Form Submissions

1. Go to Netlify Dashboard → Forms → unsubscribe
2. Look at raw submissions
3. Check if they have validation fields:
   - `recaptcha-token` ❓
   - `csrf-token` ❓  
   - `form-load-time` ❓
   - `bot-field`, `website`, `url` (honeypots) ❓

**If these fields are MISSING**, bots are bypassing our validation function.

### Test 2: Test Direct POST

```bash
curl -X POST "https://www.acdrainwiz.com/?form-name=unsubscribe" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "form-name=unsubscribe&email=test@example.com&reason=malformed-email&feedback="
```

**If this succeeds without our security fields**, we've confirmed the bypass.

### Test 3: Check Function Logs

Search Netlify function logs for bot submissions:
- Look for `validate-unsubscribe` function calls
- Check if bot submissions show up in logs

**If bot submissions DON'T appear in logs**, they're bypassing the function.

---

## ✅ The Fix: Nuclear Options

### Option 1: Remove Hidden Form (Recommended)

**Problem:** The hidden form enables direct Netlify Forms submissions.

**Solution:** Remove it entirely and handle forms programmatically.

```html
<!-- DELETE THIS from index.html -->
<form name="unsubscribe" data-netlify="true" hidden>
  ...
</form>
```

**Impact:**
- ✅ Blocks direct Netlify Forms submissions  
- ✅ Forces all traffic through our validation function
- ✅ All security measures enforced
- ❌ Lose Netlify Forms UI for viewing submissions

### Option 2: Disable Netlify Forms Completely

Add to `netlify.toml`:
```toml
[build]
  functions = "netlify/functions"
  
[forms]
  enabled = false  # Disable Netlify Forms entirely
```

**Impact:**
- ✅ Completely prevents Netlify Forms bypass
- ✅ Forces all submissions through functions
- ❌ Lose all Netlify Forms features
- ❌ Need to handle storage differently

### Option 3: Change Form Name (Quick Fix)

Change the form name so bots can't target it:

1. Update hidden form: `name="unsubscribe"` → `name="unsubscribe-v2-secured"`
2. Update React form: `form-name="unsubscribe"` → `form-name="unsubscribe-v2-secured"`  
3. Update validation function to accept new name
4. Update Zapier integration

**Impact:**
- ✅ Breaks bot's current targeting
- ✅ Quick to implement
- ⚠️ Temporary - bots will find new name
- ⚠️ Requires updating integrations

### Option 4: Block Form Submissions at Redirect Level (Aggressive)

Update `netlify.toml`:
```toml
# Block ALL direct form submissions - force through validation
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/validate-form-submission"
  status = 307
  force = true
  conditions = {Method = ["POST"]}
  query = {form-name = ":formname"}
```

**Impact:**
- ✅ Catches form submissions with query parameters
- ✅ Forces ALL POSTs through validation
- ⚠️ May break other POST endpoints (Stripe, etc.)
- ⚠️ Needs careful testing

---

## 🎯 Recommended Solution

### Phase 1: Immediate Fix (15 minutes)

1. **Remove the hidden unsubscribe form** from `index.html`
2. **Change the form name** to `unsubscribe-secured`
3. **Deploy and monitor**

This breaks the bot's current attack immediately.

### Phase 2: Comprehensive Fix (1-2 hours)

1. **Remove ALL hidden forms** from `index.html`
2. **Handle form registration programmatically** via functions
3. **Add server-side schema validation** (dropdown values only)
4. **Add submission source tracking** (validate it came from our UI)
5. **Monitor and adjust**

### Phase 3: Long-term Prevention

1. **Implement form submission signatures**
2. **Add time-based tokens** (expire after 15 minutes)
3. **Track legitimate form loads** vs submissions
4. **Alert on direct Netlify Forms submissions**

---

## 📊 Expected Results

After implementing the fix:

### Before Fix:
- ❌ Bots submitting malformed emails daily
- ❌ Bypassing all security measures  
- ❌ Direct Netlify Forms access

### After Fix:
- ✅ Hidden form removed - no direct access
- ✅ All submissions through validation function
- ✅ All security measures enforced
- ✅ Bot attacks blocked

---

## 🚨 Priority: Critical

**Severity:** High - Bots are bypassing all security  
**Effort:** Low (15 minutes to remove hidden form)  
**Impact:** High (blocks current attack vector)

**Recommendation:** Implement Phase 1 immediately, then Phase 2 within 24 hours.

---

## Next Steps

1. ✅ Confirm theory by checking Netlify Forms dashboard
2. ✅ Remove hidden unsubscribe form from index.html
3. ✅ Change form name to break bot targeting
4. ✅ Deploy and monitor for 24 hours
5. ✅ Implement comprehensive fix if attacks continue

