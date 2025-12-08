# 📧 How to Check if Stripe Sent Payment Confirmation Email

**Quick Guide:** Verify email delivery status after test purchase

---

## 🔍 **Method 1: Stripe Dashboard (Easiest)**

### **Step 1: Find Your Payment**
1. Go to **Stripe Dashboard**: https://dashboard.stripe.com
2. Click **"Payments"** in the left sidebar
3. Find your test payment (most recent one)
4. Click on the payment to open details

### **Step 2: Check Email Status**
Look for these fields in the payment details:

**Customer Email:**
- Should show the email address used
- If blank, email wasn't set (problem!)

**Email Sent:**
- Look for "Email sent" or "Receipt sent" indicator
- May show timestamp of when email was sent
- If shows "Not sent" or error, that's the issue

**Payment Intent Details:**
- Scroll down to "Payment Intent" section
- Check "Receipt email" field
- Should match the customer email

---

## 🔍 **Method 2: Check Netlify Logs**

### **Step 1: View Function Logs**
1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Click on your site
3. Go to **"Functions"** → **"create-checkout"**
4. Scroll to find logs from your test purchase

### **Step 2: Look for Email Configuration**
Look for log entries showing:
```
Checkout session email configuration: {
  hasUserEmail: true/false,
  userEmail: 'xxx***@example.com',
  receiptEmailSet: true/false
}
```

**What to check:**
- ✅ `hasUserEmail: true` (email was provided)
- ✅ `receiptEmailSet: true` (receipt_email was set)
- ✅ Email address matches what you used

---

## 🔍 **Method 3: Stripe Dashboard - Email History**

### **Step 1: Check Email Logs**
1. Go to **Stripe Dashboard** → **Settings** → **Emails**
2. Look for **"Email history"** or **"Recent emails"** section
3. Should show list of emails sent

**Note:** Not all Stripe accounts have this feature visible. If you don't see it, use Method 1.

---

## 🐛 **Troubleshooting**

### **Issue 1: Email Not in Stripe Dashboard**

**Check:**
- Did you use a real email address? (not test@example.com)
- Is the email in the payment details?

**Fix:**
- If email is missing, that's the problem
- Check Netlify logs to see if email was passed correctly

---

### **Issue 2: Email Shows "Not Sent"**

**Possible Causes:**
1. Email settings disabled in Stripe Dashboard
2. Email address invalid
3. Stripe email delivery issue

**Fix:**
- Check Stripe Dashboard → Settings → Emails
- Verify "Successful payments" is enabled
- Check if email address is valid

---

### **Issue 3: Email in Spam Folder**

**Check:**
- Check your spam/junk folder
- Look for email from Stripe
- Check if it's from "noreply@stripe.com" or your branded email

**Fix:**
- Mark as "Not Spam"
- Add to contacts if needed

---

## 📋 **Quick Checklist**

After making a test purchase, check:

- [ ] Payment shows in Stripe Dashboard
- [ ] "Customer email" field has your email
- [ ] "Receipt email" field has your email (if shown)
- [ ] "Email sent" indicator shows (if available)
- [ ] Netlify logs show `receiptEmailSet: true`
- [ ] Check email inbox (wait 1-2 minutes)
- [ ] Check spam folder
- [ ] Email received from Stripe

---

## 💡 **What to Report Back**

After checking, let me know:

1. **Stripe Dashboard:**
   - Does payment show customer email? ✅ / ❌
   - Does it show "Email sent" status? ✅ / ❌
   - Any error messages?

2. **Netlify Logs:**
   - Does it show `receiptEmailSet: true`? ✅ / ❌
   - What email address is logged?

3. **Email:**
   - Did you receive the email? ✅ / ❌
   - How long did it take? (usually 1-2 minutes)

Based on your results, I can help fix any issues! 🚀

