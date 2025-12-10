# 🔍 Quick Log Check Guide

**How to check if bot defense is working**

---

## 📍 Step 1: Access Logs

1. **Netlify Dashboard** → Your Site
2. **Click "Logs"** (left sidebar)
3. **Click "Functions"** tab
4. **Select function:** `validate-form-submission` or `validate-unsubscribe`

---

## 🔍 Step 2: What to Search For

### Search 1: Bot Detections
**Search box:** `🚫 Bot detected`

**What you should see:**
- Multiple bot detection messages
- Different reasons (fingerprint, blacklist, behavioral, etc.)
- IP addresses being blocked

**If you see this:** ✅ **Bots are being blocked!**

---

### Search 2: Successful Submissions
**Search box:** `✅ Validation passed`

**What you should see:**
- Messages showing legitimate form submissions
- "forwarding to Netlify Forms"
- "Confirmation email triggered"

**If you see this:** ✅ **Legitimate users can submit forms!**

---

### Search 3: Blobs Working
**Search box:** `Blobs`

**What you should see:**
- "Using explicit Blobs config"
- "Token stored in Blobs"
- "IP added to blacklist (Blobs)"

**If you see this:** ✅ **Persistent storage is working!**

---

### Search 4: CSRF Tokens
**Search box:** `csrf`

**What you should see:**
- "CSRF token generated"
- "CSRF token validated"
- "Token stored in Blobs"

**If you see this:** ✅ **CSRF protection is working!**

---

## 🎯 Quick Health Check

**Copy/paste these searches one by one:**

1. `🚫 Bot detected` → Should see bot blocking messages
2. `✅ Validation passed` → Should see successful submissions
3. `Blobs` → Should see Blobs store access
4. `csrf` → Should see CSRF token activity
5. `error` → Should see minimal errors (some warnings OK)

---

## 📊 What Good Logs Look Like

### Healthy Log Pattern:
```
✅ Request fingerprint valid
✅ IP validation passed
✅ CSRF token validated
✅ Behavioral analysis passed
✅ reCAPTCHA verified (score: 0.9)
✅ Validation passed, forwarding to Netlify Forms
```

### Bot Blocked Pattern:
```
🚫 Bot detected: request-fingerprint-failed
🚫 IP added to blacklist: 1.2.3.4
```

---

## 🚨 Red Flags

**If you see:**
- `⚠️ Netlify Blobs not available` → Blobs not configured
- `🚫 reCAPTCHA verification failed` (for legitimate users) → Too strict
- `🚫 CSRF token missing` (for legitimate users) → Frontend issue
- Many errors → Something is broken

---

## 💡 Pro Tip

**Set time range to "Last 24 hours"** to see recent activity.

**Filter by function** to focus on specific forms.

---

**Ready to check!** Go to Netlify Dashboard → Logs → Functions and try the searches above.

