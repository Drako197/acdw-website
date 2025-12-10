# 📊 Bot Defense Log Checking Guide

**Purpose:** How to check Netlify Function logs to verify bot defense is working

---

## 🔍 Where to Find Logs

### Step 1: Access Function Logs

1. **Go to Netlify Dashboard** → Your Site
2. **Click "Logs"** in the left sidebar
3. **Select "Functions"** tab
4. **Choose a function:**
   - `validate-form-submission` (most form submissions)
   - `validate-unsubscribe` (unsubscribe form)
   - `generate-csrf-token` (CSRF token generation)
   - `init-blobs-stores` (store initialization - already done)

### Step 2: Filter Logs

- **Time Range:** Select last 24 hours or custom range
- **Function:** Select specific function or "All functions"
- **Search:** Use search box to filter by keywords

---

## ✅ What to Look For (Success Indicators)

### 1. CSRF Token Generation

**Look for:**
```
✅ CSRF token generated
📝 Token expires in 15 minutes
```

**What it means:** CSRF tokens are being generated successfully

---

### 2. Form Submissions (Legitimate)

**Look for:**
```
✅ Validation passed, forwarding to Netlify Forms
✅ reCAPTCHA verified (score: 0.9)
✅ Request fingerprint valid
✅ IP validation passed
✅ Behavioral analysis passed
✅ Email domain validation passed
✅ Confirmation email triggered
```

**What it means:** Legitimate user submitted form successfully

---

### 3. Bot Detection (Blocked)

**Look for:**
```
🚫 Bot detected: request-fingerprint-failed
🚫 Bot detected: ip-blacklisted
🚫 Bot detected: behavioral-validation-failed
🚫 Bot detected: email-domain-validation-failed
🚫 Bot detected: missing-csrf-token
🚫 Bot detected: invalid-csrf-token
🚫 Bot detected: honeypot
🚫 Bot detected: bot-user-agent
🚫 Bot detected: invalid-origin
```

**What it means:** Bot was detected and blocked (this is good!)

---

### 4. Blobs Store Access

**Look for:**
```
✅ Using explicit Blobs config for csrf-tokens
✅ Token stored in Blobs
✅ IP added to blacklist (Blobs)
✅ Pattern stored in Blobs
```

**What it means:** Persistent storage is working

---

## 🚨 What to Watch For (Issues)

### Issue 1: Blobs Not Working

**Look for:**
```
⚠️ Netlify Blobs not available, using in-memory blacklist
⚠️ Failed to initialize Blobs store
```

**What it means:** Blobs not configured (falling back to in-memory)

**Fix:** Check `NETLIFY_TOKEN` environment variable

---

### Issue 2: reCAPTCHA Failures

**Look for:**
```
🚫 reCAPTCHA verification failed
🚫 reCAPTCHA score too low (0.2)
```

**What it means:** Either bot or legitimate user with low score

**Action:** Check if legitimate users are being blocked

---

### Issue 3: CSRF Token Issues

**Look for:**
```
🚫 CSRF token missing
🚫 CSRF token expired
🚫 CSRF token already used
```

**What it means:** Frontend not sending tokens or token expired

**Fix:** Check frontend CSRF token integration

---

## 📋 Log Message Reference

### Phase 1: Request Fingerprinting

**Success:**
```
✅ Request fingerprint valid
```

**Blocked:**
```
🚫 Bot detected: request-fingerprint-failed
   Reason: missing-headers: accept, accept-language
```

---

### Phase 2: IP Reputation & Blacklist

**Success:**
```
✅ IP validation passed
✅ IP reputation check: 5% abuse confidence (allowed)
```

**Blocked:**
```
🚫 Bot detected: ip-blacklisted
   Reason: IP is blacklisted
   Unblock at: 2025-12-09T12:00:00Z
```

**Added to Blacklist:**
```
🚫 IP added to blacklist: 1.2.3.4
   Reason: Bot detected
   Attempts: 3
```

---

### Phase 3: Behavioral Analysis

**Success:**
```
✅ Behavioral analysis passed
✅ Form load time: 5.2 seconds (valid)
```

**Blocked:**
```
🚫 Bot detected: behavioral-validation-failed
   Reason: Submission too fast
   Time since load: 500ms (minimum: 2000ms)
```

---

### Phase 4: Enhanced reCAPTCHA

**Success:**
```
✅ reCAPTCHA verified
   Score: 0.9 (threshold: 0.5)
   Action: contact-general
```

**Blocked:**
```
🚫 reCAPTCHA score too low
   Score: 0.2 (threshold: 0.5)
```

---

### Phase 5: CSRF Token Protection

**Success:**
```
✅ CSRF token validated
✅ Token used (one-time use enforced)
```

**Blocked:**
```
🚫 Bot detected: missing-csrf-token
🚫 Bot detected: invalid-csrf-token
🚫 Bot detected: expired-csrf-token
🚫 Bot detected: csrf-token-reused
```

---

### Phase 6: Email Domain Validation

**Success:**
```
✅ Email domain validation passed
   Domain: gmail.com
   MX records: 5
```

**Blocked:**
```
🚫 Bot detected: email-domain-validation-failed
   Reason: Disposable email domain not allowed
   Domain: tempmail.com
```

---

## 🔍 Search Tips

### Find All Bot Detections

**Search for:**
```
🚫 Bot detected
```

### Find All Successful Submissions

**Search for:**
```
✅ Validation passed
```

### Find Blobs Access

**Search for:**
```
Blobs
```

### Find CSRF Token Activity

**Search for:**
```
csrf
```

### Find IP Blacklist Activity

**Search for:**
```
blacklist
```

---

## 📊 Log Analysis Checklist

### Daily Check (First Week)

- [ ] Count bot detections per day
- [ ] Count successful form submissions
- [ ] Check for any errors
- [ ] Verify Blobs stores are being used
- [ ] Check IP blacklist growth

### Weekly Review

- [ ] Review bot detection patterns
- [ ] Check if legitimate users are being blocked (false positives)
- [ ] Review blacklist size
- [ ] Check CSRF token usage
- [ ] Verify all phases are working

---

## 🎯 Expected Log Patterns

### Legitimate User Submission

```
1. ✅ Request fingerprint valid
2. ✅ IP validation passed
3. ✅ CSRF token validated
4. ✅ Behavioral analysis passed
5. ✅ reCAPTCHA verified (score: 0.8+)
6. ✅ Email domain validation passed
7. ✅ Validation passed, forwarding to Netlify Forms
8. ✅ Confirmation email triggered
```

### Bot Submission (Blocked)

```
1. 🚫 Bot detected: request-fingerprint-failed
   OR
2. 🚫 Bot detected: missing-csrf-token
   OR
3. 🚫 Bot detected: ip-blacklisted
   OR
4. 🚫 Bot detected: behavioral-validation-failed
```

---

## 🐛 Troubleshooting Common Issues

### No Logs Showing

**Problem:** Can't see any logs

**Solutions:**
1. Check time range (select last 24 hours)
2. Make sure function was called (submit a test form)
3. Check if logs are enabled for your plan
4. Try refreshing the page

### Too Many Bot Detections

**Problem:** Seeing lots of bot detections

**Solutions:**
1. This is **good** - bots are being blocked!
2. Check if they're the same IPs (blacklist working)
3. Review detection reasons (which phase is catching them)

### Legitimate Users Blocked

**Problem:** Real users can't submit forms

**Solutions:**
1. Check which phase is blocking them
2. Review reCAPTCHA scores (might be too strict)
3. Check CSRF token integration (frontend)
4. Review behavioral analysis (form load time)

---

## 📈 Metrics to Track

### Daily Metrics

- **Bot Detections:** How many bots blocked per day
- **Successful Submissions:** How many legitimate forms submitted
- **False Positives:** Legitimate users blocked (should be 0)
- **Blacklist Size:** Number of IPs in blacklist
- **CSRF Token Usage:** Tokens generated vs. used

### Weekly Trends

- **Bot Attack Patterns:** Are attacks increasing/decreasing?
- **Blocking Effectiveness:** Which phase catches most bots?
- **Performance Impact:** Are checks slowing down forms?

---

## 🎓 Log Examples

### Example 1: Successful Form Submission

```
Dec 8, 2025, 2:30:15 PM
INFO ✅ Request fingerprint valid
INFO ✅ IP validation passed (reputation: 2%)
INFO ✅ CSRF token validated
INFO ✅ Behavioral analysis passed (load time: 4.2s)
INFO ✅ reCAPTCHA verified (score: 0.9, action: contact-general)
INFO ✅ Email domain validation passed (gmail.com, 5 MX records)
INFO ✅ Validation passed, forwarding to Netlify Forms
INFO ✅ Confirmation email triggered for contact-general
```

### Example 2: Bot Blocked

```
Dec 8, 2025, 2:31:22 PM
WARN 🚫 Bot detected: request-fingerprint-failed
     Reason: missing-headers: accept, accept-language
     IP: 1.2.3.4
     User-Agent: curl/7.68.0
INFO 🚫 IP added to blacklist: 1.2.3.4
     Reason: Bot detected
     Attempts: 1
```

### Example 3: Blobs Store Access

```
Dec 8, 2025, 2:32:10 PM
INFO ✅ Using explicit Blobs config for csrf-tokens
INFO ✅ Token stored in Blobs (expires: 15 minutes)
INFO ✅ IP added to blacklist (Blobs): 1.2.3.4
INFO ✅ Pattern stored in Blobs (expires: 1 hour)
```

---

## ✅ Quick Health Check

Run this checklist:

- [ ] Can see function logs in Netlify Dashboard
- [ ] See "✅ Validation passed" for legitimate submissions
- [ ] See "🚫 Bot detected" for bot attempts
- [ ] See "✅ Using explicit Blobs config" for store access
- [ ] No errors about missing Blobs configuration
- [ ] No errors about CSRF tokens
- [ ] reCAPTCHA scores are reasonable (0.5+ for legitimate users)

---

**Ready to check your logs!** 📊

Go to Netlify Dashboard → Logs → Functions and look for the patterns above.

