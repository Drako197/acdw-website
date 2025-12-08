# 🔍 How to Check Webhook Receipt Email Logs

**Quick Guide:** Verify if receipt email was sent via webhook

---

## 📋 **Step-by-Step Check**

### **Step 1: Find Webhook Logs**

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Click on your site
3. Go to **"Functions"** → **"stripe-webhook"**
4. Look for logs from around **6:50 PM** (after your purchase)

### **Step 2: Look for These Log Messages**

**Success Message:**
```
✅ Receipt email sent to guest checkout customer: xxx***@example.com
```

**Or Error Message:**
```
❌ Failed to send receipt email: [error message]
```

**Or Warning:**
```
⚠️ No customer email found for session: [session_id]
```

---

## 🔍 **What to Look For**

### **Good Signs:**
- ✅ `Payment successful: cs_test_...`
- ✅ `Receipt email sent to guest checkout customer: ...`
- ✅ No error messages

### **Problem Signs:**
- ❌ `Failed to send receipt email: ...`
- ❌ `No customer email found for session: ...`
- ❌ Any error messages about invoices or Stripe API

---

## 📧 **Also Check:**

1. **Your Email Inbox:**
   - Wait 1-2 minutes after payment
   - Check inbox
   - Check spam folder
   - Look for email from Stripe

2. **Stripe Dashboard:**
   - Go to Payments
   - Find your payment
   - Check if "Email sent" shows a timestamp
   - Check "Customer email" field

---

## 🐛 **If No Receipt Email Logs**

**Possible Issues:**
1. Webhook not triggered (check Stripe Dashboard → Webhooks)
2. Webhook failed silently
3. Email sending code didn't execute

**Next Steps:**
- Check Stripe Dashboard → Webhooks → Events
- Look for `checkout.session.completed` event
- Check if webhook was called successfully

---

## 💡 **What to Report Back**

After checking webhook logs, let me know:

1. **Webhook Logs:**
   - Do you see "Receipt email sent" message? ✅ / ❌
   - Any error messages? ✅ / ❌
   - What do the logs show?

2. **Email:**
   - Did you receive the receipt email? ✅ / ❌
   - How long did it take?

3. **Stripe Dashboard:**
   - Does payment show "Email sent" status? ✅ / ❌
   - What does the customer email field show?

Based on your results, I can help fix any issues! 🚀

