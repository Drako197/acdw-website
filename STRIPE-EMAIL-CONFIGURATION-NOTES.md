# 📧 Stripe Email Configuration Notes

**Date:** December 8, 2025  
**Status:** Configuration & Testing  
**Priority:** P0 - Launch Blocker

---

## 🔍 **Key Finding from Stripe Dashboard**

Stripe Dashboard → Settings → Emails shows:

> **"Successful payments"**  
> This setting is ignored when you create a payment in the API and provide the `receipt_email` parameter.

---

## 📋 **What This Means**

### **Two Email Configuration Methods:**

1. **Dashboard Setting (Automatic):**
   - Enable "Successful payments" in Stripe Dashboard → Settings → Emails
   - Stripe automatically sends receipt to `customer_email` (or email collected during checkout)
   - **Works when:** `receipt_email` is NOT provided in API

2. **API Parameter (Explicit):**
   - Set `receipt_email` in PaymentIntent or Checkout Session
   - Stripe sends receipt to the specified `receipt_email`
   - **Overrides:** Dashboard email settings (they are ignored)

---

## ✅ **Our Current Implementation**

### **For Logged-In Users:**
```javascript
customer_email: userEmail,  // Sets customer email
payment_intent_data: {
  receipt_email: userEmail  // Explicitly sets receipt email
}
```

**Result:**
- ✅ `receipt_email` is explicitly set
- ✅ Dashboard setting is ignored (but that's OK - we're explicitly setting it)
- ✅ Receipt will be sent to `userEmail`

### **For Guest Checkout:**
```javascript
// No customer_email or receipt_email set
// Stripe collects email during checkout
```

**Result:**
- ✅ Stripe collects email during checkout
- ✅ Dashboard setting applies (since we don't set `receipt_email`)
- ✅ Receipt will be sent to email collected during checkout

---

## 🎯 **Why This Should Work**

1. **Logged-In Users:**
   - We explicitly set `receipt_email` in `payment_intent_data`
   - Stripe will send receipt to that email
   - Dashboard setting is ignored (but we don't need it - we're setting it explicitly)

2. **Guest Users:**
   - We don't set `receipt_email` in API
   - Stripe collects email during checkout
   - Dashboard setting applies → Receipt sent automatically

---

## 🧪 **Testing Checklist**

### **Test 1: Logged-In User Purchase**
- [ ] User is logged in
- [ ] Make test purchase
- [ ] Check Netlify logs: `receiptEmailSet: true`
- [ ] Check email inbox (should receive receipt)
- [ ] Verify email is from Stripe with your branding

### **Test 2: Guest Checkout**
- [ ] User is NOT logged in
- [ ] Make test purchase
- [ ] Enter email during Stripe checkout
- [ ] Check Netlify logs: `receiptEmailSet: false` (for guest)
- [ ] Check email inbox (should receive receipt)
- [ ] Verify email is from Stripe with your branding

### **Test 3: Verify Stripe Dashboard**
- [ ] Go to Stripe Dashboard → Payments
- [ ] Find test payment
- [ ] Check "Customer email" field (should have email)
- [ ] Check "Email sent" status (should show if sent)
- [ ] If not sent, check for error messages

---

## 🐛 **Troubleshooting**

### **Issue: Email Not Received (Logged-In User)**

**Check:**
1. Netlify logs show `receiptEmailSet: true`?
2. Email address is correct in logs?
3. Check spam folder
4. Stripe Dashboard shows "Email sent"?

**Fix:**
- Verify `userEmail` is being passed correctly
- Check Stripe Dashboard for email delivery errors

---

### **Issue: Email Not Received (Guest)**

**Check:**
1. Did user enter email during Stripe checkout?
2. Netlify logs show `isGuest: true`?
3. Dashboard setting "Successful payments" is enabled?
4. Check spam folder
5. Stripe Dashboard shows "Email sent"?

**Fix:**
- Verify dashboard email setting is enabled
- Check if email was collected during checkout
- Verify Stripe Dashboard email delivery status

---

## 📝 **Code Location**

**File:** `netlify/functions/create-checkout.js`

**Key Code:**
```javascript
// For logged-in users
...(userEmail && { 
  customer_email: userEmail,
  payment_intent_data: {
    receipt_email: userEmail  // Explicitly set receipt email
  }
}),

// For guests: No receipt_email set → Dashboard setting applies
```

---

## 💡 **Important Notes**

1. **Dashboard Setting:**
   - Should be enabled (you confirmed it is ✅)
   - Only applies when `receipt_email` is NOT set in API
   - For guests, this is what triggers the email

2. **API Parameter:**
   - When `receipt_email` is set, dashboard setting is ignored
   - This is intentional - we're explicitly controlling email delivery
   - For logged-in users, we set it explicitly

3. **Email Delivery:**
   - Stripe sends emails immediately after payment success
   - Usually arrives within 1-2 minutes
   - Check spam folder if not in inbox

---

## 🚀 **Next Steps**

1. **Test logged-in purchase:**
   - Make test purchase while logged in
   - Check if email is received
   - Review Netlify logs

2. **Test guest checkout:**
   - Make test purchase as guest
   - Enter email during Stripe checkout
   - Check if email is received
   - Review Netlify logs

3. **Report Results:**
   - Did logged-in user receive email? ✅ / ❌
   - Did guest receive email? ✅ / ❌
   - What do Netlify logs show?
   - What does Stripe Dashboard show?

---

**Ready to test!** 🧪

