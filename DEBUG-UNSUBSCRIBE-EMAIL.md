# Debug Unsubscribe Email Notification

**Issue:** Unsubscribe form works but email notification not received  
**Goal:** Find where email was sent and why it wasn't received

---

## 🔍 Step 1: Check Netlify Function Logs

### In Netlify Dashboard:

1. Go to **Netlify Dashboard** → Your Site
2. Click **Functions** tab
3. Find **send-unsubscribe-notification** function
4. Click on it to see recent invocations
5. Look for your test submission

### What to Look For:

**✅ Success Logs:**
```
✅ Unsubscribe notification sent via Resend: {
  emailId: "re_xxxxx",
  to: "support@acdrainwiz.com",
  from: "AC Drain Wiz <unsubscribe@acdrainwiz.com>"
}
```

**⚠️ Warning Logs:**
```
⚠️ Resend API key not configured - skipping email notification
```

**❌ Error Logs:**
```
❌ Error sending unsubscribe notification: {
  message: "...",
  error: "..."
}
```

---

## 🔧 Step 2: Check Environment Variables

### Verify Resend API Key:

1. Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. Check if `RESEND_API_KEY` exists
3. Verify it starts with `re_` (not placeholder text)
4. Check if it's set for the correct environment (Production/Deploy Preview)

### Verify Notification Email:

1. Check if `NOTIFICATION_EMAIL` exists
2. Verify it's set to your email address
3. Check spelling/typos

### Current Environment Variables Should Be:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx          # Should start with 're_'
NOTIFICATION_EMAIL=your-email@acdrainwiz.com
FROM_EMAIL=AC Drain Wiz <unsubscribe@acdrainwiz.com>  # Optional
```

---

## 🧪 Step 3: Test Resend API Directly

### Option A: Check Resend Dashboard

1. Go to https://resend.com
2. Log in to your account
3. Go to **Emails** tab
4. Look for recent emails sent
5. Check:
   - Was email sent?
   - What email address was it sent to?
   - What was the status (delivered/bounced/failed)?

### Option B: Test Resend API Key

We can create a test function to verify the API key works.

---

## 📋 Common Issues & Solutions

### Issue 1: Resend API Key Not Configured

**Symptoms:**
- Log shows: `⚠️ Resend API key not configured`
- No email sent

**Solution:**
1. Get API key from resend.com
2. Add to Netlify environment variables
3. Redeploy site

---

### Issue 2: Email Sent to Wrong Address

**Symptoms:**
- Log shows email sent successfully
- But you didn't receive it

**Solution:**
1. Check `NOTIFICATION_EMAIL` environment variable
2. Verify it's your correct email address
3. Check Resend dashboard to see actual recipient

---

### Issue 3: Email in Spam Folder

**Symptoms:**
- Email sent successfully
- Not in inbox

**Solution:**
1. Check spam/junk folder
2. Check Resend dashboard for delivery status
3. Verify domain is verified in Resend (optional but recommended)

---

### Issue 4: Resend API Error

**Symptoms:**
- Log shows error from Resend API
- Error message in logs

**Solution:**
1. Check error message in logs
2. Verify API key is valid
3. Check Resend account status
4. Verify domain is verified (if using custom domain)

---

## 🔍 Step 4: Check Function Invocation

### Verify Function Was Called:

1. In Netlify Dashboard → Functions → **send-unsubscribe-notification**
2. Look for recent invocations
3. Check:
   - Was function called? (should see invocation)
   - What was the response status? (200 = success, 500 = error)
   - What was the response body?

### Check validate-unsubscribe.js Logs:

1. Go to **validate-unsubscribe** function
2. Look for your test submission
3. Check for:
   ```
   ✅ Validation passed, processing unsubscribe
   ✅ Unsubscribe notification sent: { messageId: "..." }
   ```

---

## 🧪 Step 5: Manual Test Function

Let me create a test function you can call directly to test Resend.

---

## 📊 Expected Log Flow

### Successful Email Send:

```
1. validate-unsubscribe.js:
   ✅ Validation passed, processing unsubscribe

2. send-unsubscribe-notification.js:
   ✅ Unsubscribe notification sent via Resend: {
     emailId: "re_xxxxx",
     to: "your-email@acdrainwiz.com",
     from: "AC Drain Wiz <unsubscribe@acdrainwiz.com>"
   }

3. Resend Dashboard:
   Email sent to: your-email@acdrainwiz.com
   Status: Delivered
```

---

## 🚨 Quick Checks

### Checklist:

- [ ] `RESEND_API_KEY` environment variable exists and starts with `re_`
- [ ] `NOTIFICATION_EMAIL` environment variable is set to your email
- [ ] Function logs show email was sent
- [ ] Resend dashboard shows email was sent
- [ ] Check spam folder
- [ ] Verify email address spelling

---

**Next Steps:** Check the logs first, then we'll debug based on what we find!

