# Payment Confirmation Emails Setup Guide

**Priority:** P0 - Critical for Launch  
**Status:** Ready for Configuration  
**Timeline:** 1-2 days

---

## Overview

Payment confirmation emails are critical for customer confidence and order confirmation. This guide covers two approaches:

1. **Stripe Native Receipt Emails** (Recommended - Easiest)
   - Automatic emails sent by Stripe
   - Customizable templates in Stripe Dashboard
   - Zero code changes required
   - Professional and compliant

2. **Custom Email Integration** (Optional - More Control)
   - Custom branded emails via Netlify Functions
   - Full control over design and content
   - Requires email service integration

---

## Option 1: Stripe Native Receipt Emails (Recommended)

### How It Works

Stripe automatically sends receipt emails when:
- A payment is successful
- A checkout session is completed
- The customer's email is collected during checkout

### Setup Steps

#### Step 1: Enable Receipt Emails in Stripe Dashboard

1. **Log in to Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Navigate to **Settings** → **Emails**

2. **Enable Receipt Emails**
   - Find "Receipt emails" section
   - Toggle **"Send email receipts to customers"** to ON
   - This enables automatic receipt emails for all successful payments

3. **Configure Email Settings**
   - **From email:** Set to your business email (e.g., `orders@acdrainwiz.com`)
   - **From name:** Set to "AC Drain Wiz" or your business name
   - **Reply-to email:** Set to your support email (e.g., `support@acdrainwiz.com`)

#### Step 2: Customize Receipt Email Template

1. **Navigate to Email Templates**
   - Go to **Settings** → **Emails** → **Receipt emails**
   - Click **"Customize"** or **"Edit template"**

2. **Customize the Template**
   - **Logo:** Upload your AC Drain Wiz logo
   - **Colors:** Match your brand colors (orange #f97316)
   - **Footer:** Add your business information:
     - Company name: AC Drain Wiz
     - Contact: (561) 654-5237
     - Email: ariddle@acdrainwiz.com
     - Website: www.acdrainwiz.com

3. **Add Custom Fields** (Optional)
   - Order number
   - Product details
   - Shipping information
   - Support contact

#### Step 3: Verify Checkout Session Configuration

Our checkout session already collects customer email automatically. Verify in `netlify/functions/create-checkout.js`:

```javascript
// Line 94-100: Checkout session creation
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  customer_email: userEmail, // ✅ Email is passed for logged-in users
  // For guest checkout, Stripe collects email automatically
  // ...
})
```

**Current Status:** ✅ Email collection is already configured

#### Step 4: Test Receipt Emails

1. **Test Mode**
   - Create a test checkout session
   - Complete payment with test card: `4242 4242 4242 4242`
   - Check your test email for receipt

2. **Verify Email Content**
   - Order details are correct
   - Amount matches
   - Product information is accurate
   - Shipping address is included (if applicable)

3. **Check Email Delivery**
   - Receipt should arrive within seconds
   - Check spam folder if not received
   - Verify sender is correct

---

## Option 2: Custom Email Integration (Optional)

If you want more control over email design and content, you can send custom emails via Netlify Functions.

### Implementation Approach

#### Option 2A: Use Stripe Webhook + Email Service

1. **Trigger on Payment Success**
   - Use existing `stripe-webhook.js`
   - Add email sending logic on `checkout.session.completed` event

2. **Email Service Options**
   - **Netlify Functions + SendGrid** (Recommended)
   - **Netlify Functions + Mailgun**
   - **Netlify Functions + AWS SES**
   - **Netlify Functions + Resend**

#### Option 2B: Implementation Example (SendGrid)

**Note:** This is optional. Stripe's native emails are usually sufficient.

```javascript
// In stripe-webhook.js, add after ShipStation order creation:

case 'checkout.session.completed':
  // ... existing ShipStation code ...
  
  // Send custom confirmation email
  try {
    const emailData = {
      to: fullSession.customer_email,
      subject: 'Order Confirmation - AC Drain Wiz',
      html: generateOrderConfirmationEmail(fullSession, orderItems),
    }
    
    // Call email function
    await sendEmail(emailData)
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't fail webhook - email is non-critical
  }
  
  break
```

---

## Recommended Approach

**Use Stripe Native Receipt Emails** because:

✅ **Zero code changes** - Already works  
✅ **Automatic** - No additional setup needed  
✅ **Compliant** - Stripe handles tax receipts, legal requirements  
✅ **Professional** - Stripe's templates are well-designed  
✅ **Customizable** - Can customize logo, colors, footer in Dashboard  
✅ **Reliable** - Stripe's email delivery is highly reliable  
✅ **Free** - Included with Stripe account  

**Custom emails are only needed if:**
- You need very specific branding requirements
- You want to include custom content not available in Stripe templates
- You need to integrate with your email marketing system

---

## Configuration Checklist

### Stripe Dashboard Configuration

- [ ] Enable receipt emails in Stripe Dashboard
- [ ] Set "From" email address
- [ ] Set "From" name
- [ ] Set "Reply-to" email
- [ ] Upload company logo
- [ ] Customize email colors (brand orange #f97316)
- [ ] Add company footer information
- [ ] Test receipt email delivery

### Code Verification

- [ ] Verify `customer_email` is passed in checkout session (✅ Already done)
- [ ] Verify email is collected for guest checkout (✅ Automatic)
- [ ] Test checkout flow end-to-end
- [ ] Verify receipt email arrives after payment

### Testing

- [ ] Test with test card in Stripe test mode
- [ ] Verify email arrives within seconds
- [ ] Check email content is accurate
- [ ] Verify order details match
- [ ] Test with guest checkout
- [ ] Test with logged-in user checkout

---

## Email Content Recommendations

### What Should Be Included

1. **Order Confirmation**
   - Order number (Stripe session ID)
   - Order date
   - Customer name and email

2. **Product Details**
   - Product name(s)
   - Quantity
   - Unit price
   - Total amount

3. **Payment Information**
   - Amount paid
   - Payment method (last 4 digits)
   - Payment date

4. **Shipping Information** (if applicable)
   - Shipping address
   - Estimated delivery date
   - Tracking number (when available)

5. **Next Steps**
   - What to expect next
   - How to track order
   - Support contact information

6. **Support Information**
   - Phone: (561) 654-5237
   - Email: support@acdrainwiz.com
   - Website: www.acdrainwiz.com

---

## Troubleshooting

### Email Not Received

1. **Check Stripe Dashboard**
   - Go to **Payments** → Find the payment
   - Check if receipt email was sent
   - Check email delivery status

2. **Check Email Settings**
   - Verify receipt emails are enabled
   - Check "From" email is correct
   - Verify customer email is correct

3. **Check Spam Folder**
   - Stripe emails sometimes go to spam
   - Add Stripe to contacts/whitelist

4. **Check Stripe Logs**
   - Go to **Developers** → **Logs**
   - Look for email delivery errors

### Email Content Issues

1. **Customize Template**
   - Go to **Settings** → **Emails** → **Receipt emails**
   - Edit template to match your needs

2. **Add Custom Fields**
   - Use Stripe's template editor
   - Add custom variables if needed

---

## Next Steps

1. **Configure Stripe Receipt Emails** (15 minutes)
   - Enable in Dashboard
   - Customize template
   - Test delivery

2. **Test End-to-End** (30 minutes)
   - Complete test checkout
   - Verify email arrives
   - Check content accuracy

3. **Production Verification** (After launch)
   - Monitor email delivery
   - Check customer feedback
   - Adjust template if needed

---

## Additional Resources

- **Stripe Receipt Emails Documentation:** https://stripe.com/docs/billing/invoices/email-receipts
- **Stripe Email Templates:** https://stripe.com/docs/billing/invoices/email-templates
- **Stripe Dashboard:** https://dashboard.stripe.com/settings/emails

---

## Status

**Current Implementation:**
- ✅ Checkout session collects customer email
- ✅ Stripe webhook processes successful payments
- ⚠️ Receipt emails need to be enabled in Stripe Dashboard

**Action Required:**
1. Enable receipt emails in Stripe Dashboard (5 minutes)
2. Customize email template (10 minutes)
3. Test email delivery (5 minutes)

**Total Time:** ~20 minutes

---

**Last Updated:** December 2025  
**Next Review:** After Stripe Dashboard configuration

