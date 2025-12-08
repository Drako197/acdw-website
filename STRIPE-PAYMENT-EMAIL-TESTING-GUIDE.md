# 📧 Stripe Payment Confirmation Email Testing Guide

**Date:** December 8, 2025  
**Status:** Testing & Configuration  
**Priority:** P0 - Launch Blocker

---

## 🎯 **Goal**

Ensure customers receive payment confirmation emails automatically after successful Stripe checkout.

---

## 🔍 **Step 1: Verify Stripe Email Settings**

### **1.1 Check Email Configuration in Stripe Dashboard**

1. **Log into Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com
   - Navigate to: **Settings → Emails**

2. **Verify Email Settings:**
   - ✅ **"Successful payments"** should be **ENABLED**
   - ✅ **"Refunds"** should be **ENABLED** (optional but recommended)
   - ✅ **"Failed payments"** (optional)

3. **Check Email Branding:**
   - Go to: **Settings → Branding**
   - Verify your logo and colors are set
   - This affects how emails look

### **1.2 Check Email Template**

1. **View Email Template:**
   - In **Settings → Emails**
   - Click **"Preview"** next to "Successful payments"
   - Verify the template shows:
     - Order details
     - Payment amount
     - Shipping address (if applicable)
     - Support contact information

---

## 🧪 **Step 2: Test Payment Email Flow**

### **2.1 Test Purchase (Test Mode)**

1. **Make a Test Purchase:**
   - Go to: https://www.acdrainwiz.com/products/mini
   - Add product to cart
   - Proceed to checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use your **real email address** (to receive the email)
   - Complete payment

2. **Check Your Email:**
   - Check inbox for email from Stripe
   - Check spam/junk folder
   - Email should arrive within 1-2 minutes

3. **Verify Email Content:**
   - ✅ Order details correct
   - ✅ Payment amount correct
   - ✅ Shipping address correct (if provided)
   - ✅ Branding/logo present

### **2.2 Check Stripe Dashboard**

1. **View Payment in Stripe:**
   - Go to: **Payments** in Stripe Dashboard
   - Find your test payment
   - Check **"Email sent"** status
   - If email wasn't sent, you'll see an error message

2. **Check Customer Email:**
   - Click on the payment
   - Verify **"Customer email"** is set correctly
   - If missing, that's the problem

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: Email Not Being Sent**

**Symptoms:**
- Payment successful but no email received
- Stripe Dashboard shows "Email not sent"

**Possible Causes:**
1. **Email settings disabled** → Enable in Settings → Emails
2. **No customer email** → Stripe needs email to send receipt
3. **Email in spam** → Check spam folder
4. **Test mode vs Production** → Make sure you're testing in the correct mode

**Fix:**
- Ensure `customer_email` is set in checkout session (we'll verify this in code)

---

### **Issue 2: Email Goes to Wrong Address**

**Symptoms:**
- Email sent but to wrong email address

**Possible Causes:**
1. **Guest checkout** → Email collected by Stripe during checkout
2. **Logged-in user** → Email from Clerk account might be different

**Fix:**
- Verify email in Stripe payment details
- Check if email matches what user entered

---

### **Issue 3: Email Template Not Branded**

**Symptoms:**
- Email received but looks generic

**Fix:**
- Go to Stripe Dashboard → Settings → Branding
- Upload logo and set brand colors
- Preview email template

---

## 🔧 **Code Verification**

### **Current Implementation:**

In `create-checkout.js`, we set:
```javascript
...(userEmail && { customer_email: userEmail }),
```

**This means:**
- ✅ **Logged-in users:** Email is set from Clerk account
- ⚠️ **Guest checkout:** Email is collected by Stripe during checkout

**Potential Issue:**
- For guest checkout, Stripe collects email, but we should verify it's being used for receipt

### **Recommended Fix:**

We should also set `receipt_email` explicitly to ensure emails are sent:

```javascript
// Set receipt_email to ensure payment confirmation is sent
receipt_email: userEmail || undefined, // For logged-in users
// For guests, Stripe will use email collected during checkout
```

---

## 📋 **Testing Checklist**

- [ ] Stripe email settings enabled (Settings → Emails)
- [ ] Email branding configured (Settings → Branding)
- [ ] Test purchase completed with real email
- [ ] Email received within 2 minutes
- [ ] Email content is correct (order details, amount, address)
- [ ] Email branding/logo present
- [ ] Checked spam folder (if email not in inbox)
- [ ] Verified email in Stripe Dashboard payment details

---

## 🚀 **Next Steps**

1. **Verify Stripe Settings** (5 minutes)
   - Check Settings → Emails
   - Check Settings → Branding

2. **Make Test Purchase** (5 minutes)
   - Use test card: `4242 4242 4242 4242`
   - Use your real email
   - Complete checkout

3. **Check Email** (2 minutes)
   - Wait 1-2 minutes
   - Check inbox and spam

4. **Report Results:**
   - Did you receive the email? ✅ / ❌
   - If not, what does Stripe Dashboard show?
   - Any error messages in Stripe?

5. **If Email Not Received:**
   - We'll update code to explicitly set `receipt_email`
   - We'll add logging to verify email is being set
   - We'll check webhook handling

---

## 💡 **Additional Notes**

### **Stripe Email Behavior:**

- **Automatic:** Stripe sends payment confirmation emails automatically when:
  - Payment is successful
  - `customer_email` or `receipt_email` is set
  - Email settings are enabled in dashboard

- **Manual:** You can also send emails manually from Stripe Dashboard:
  - Go to Payment → Actions → Send receipt

### **Email Timing:**

- Emails are sent **immediately** after payment success
- Usually arrives within **1-2 minutes**
- If delayed, check Stripe Dashboard for errors

### **Test vs Production:**

- **Test Mode:** Uses test email settings (may have different behavior)
- **Production Mode:** Uses production email settings
- Make sure you're testing in the correct mode

---

**Ready to test?** Follow Step 2 above and report back with results! 🧪

