# Email System Setup Guide

## Overview

We need to set up three types of automated emails:
1. **Payment Confirmation Emails** (Stripe)
2. **Shipping Confirmation Emails** (ShipStation)
3. **Account Welcome Emails** (Clerk)

---

## 1. Payment Confirmation Emails (Stripe)

### Current Status
- ✅ Customers see visual confirmation page after payment
- ❌ No automated email confirmation yet

### Stripe Capabilities
**Stripe Checkout automatically sends receipt emails**, but we need to:
- Check if this is enabled in Stripe settings
- Customize the email template to match ACDW branding
- Ensure it includes: order details, shipping address, order total, tax, shipping cost

### What to Check:
1. **Stripe Dashboard → Settings → Emails**
   - Check if "Receipt emails" are enabled
   - Review default email template
   - Customize template with ACDW branding

2. **Stripe Checkout Settings**
   - Verify `receipt_email` is being sent in checkout session
   - Check email template customization options

### Implementation Options:
- **Option A:** Use Stripe's built-in receipt emails (easiest, may need customization)
- **Option B:** Create custom email via Netlify Function (more control, more work)
- **Option C:** Hybrid - use Stripe receipt + custom follow-up email

### Testing:
- Make test purchase in Stripe test mode
- Verify email is received
- Check email content and branding
- Test with different order types (homeowner, pro, property manager)

---

## 2. Shipping Confirmation Emails (ShipStation)

### Current Status
- ✅ Orders automatically created in ShipStation
- ❌ Shipping confirmation emails not yet configured

### ShipStation Capabilities
**ShipStation can send automatic shipping confirmation emails** when:
- Order is marked as shipped
- Tracking number is added
- Order status changes to "shipped"

### What to Check:
1. **ShipStation Settings → Email Settings**
   - Enable "Send shipping confirmation emails"
   - Configure email template
   - Customize with ACDW branding
   - Include tracking number and carrier info

2. **ShipStation Order Settings**
   - Verify email notifications are enabled per store
   - Check if customer email is being passed correctly

### Implementation Options:
- **Option A:** Use ShipStation's built-in email notifications (easiest)
- **Option B:** Use ShipStation webhooks to trigger custom emails (more control)
- **Option C:** Hybrid - ShipStation email + custom branded follow-up

### Testing:
- Create test order in ShipStation
- Mark order as shipped with tracking number
- Verify customer receives email
- Check email content includes tracking info

---

## 3. Account Welcome Emails (Clerk)

### Current Status
- ✅ Customers can create accounts via Clerk
- ❌ No welcome email sent on account creation

### Clerk Capabilities
**Clerk sends verification emails by default**, but may not have a welcome email. Options:
- Use Clerk's email templates (if welcome email exists)
- Create custom welcome email via Clerk webhooks
- Send welcome email via Netlify Function triggered by Clerk webhook

### What to Check:
1. **Clerk Dashboard → Email Templates**
   - Check if "Welcome Email" template exists
   - Review available email templates
   - Customize templates with ACDW branding

2. **Clerk Webhooks**
   - Set up webhook for `user.created` event
   - Trigger custom welcome email function
   - Include account details, login info, dashboard link

### Implementation Options:
- **Option A:** Use Clerk's built-in welcome email (if available)
- **Option B:** Create custom email via Clerk webhook + Netlify Function (recommended)
- **Option C:** Send email directly from frontend (not recommended)

### Email Content Should Include:
- Welcome message
- Account details (email, role)
- Link to dashboard
- Link to catalog (if applicable)
- Support contact information
- Next steps based on account type

### Testing:
- Create test account via signup form
- Verify welcome email is received
- Check email content and links
- Test with different account types (homeowner, pro, property manager)

---

## Implementation Priority

### Phase 1: Quick Wins (Use Built-in Features)
1. ✅ Enable Stripe receipt emails (check settings, customize template)
2. ✅ Enable ShipStation shipping emails (check settings, customize template)
3. ⚠️ Check Clerk welcome email (may need custom implementation)

### Phase 2: Customization
1. Customize all email templates with ACDW branding
2. Ensure consistent design across all emails
3. Add ACDW logo, colors, and branding

### Phase 3: Advanced Features
1. Create custom email templates if needed
2. Add personalization (customer name, order details, etc.)
3. Set up email analytics/tracking

---

## Testing Checklist

### Payment Confirmation Email:
- [ ] Test purchase in Stripe test mode
- [ ] Verify email received at customer email
- [ ] Check email includes: order number, items, total, shipping address
- [ ] Verify branding matches ACDW style
- [ ] Test with different order types

### Shipping Confirmation Email:
- [ ] Create test order in ShipStation
- [ ] Mark order as shipped with tracking
- [ ] Verify email received at customer email
- [ ] Check email includes: tracking number, carrier, estimated delivery
- [ ] Verify branding matches ACDW style

### Account Welcome Email:
- [ ] Create test account (homeowner)
- [ ] Create test account (HVAC pro)
- [ ] Create test account (property manager)
- [ ] Verify email received for each type
- [ ] Check email includes: account details, dashboard link, role-specific info
- [ ] Verify branding matches ACDW style

---

## Next Steps

1. **Check Stripe Settings** - Enable and customize receipt emails
2. **Check ShipStation Settings** - Enable and customize shipping emails
3. **Check Clerk Settings** - Review email templates and webhook options
4. **Test All Three** - Make test purchases, create test accounts, verify emails
5. **Customize Templates** - Add ACDW branding to all emails
6. **Document Email Content** - Create email copy for each type

---

## Resources

- **Stripe Email Settings:** https://dashboard.stripe.com/settings/emails
- **ShipStation Email Settings:** ShipStation Dashboard → Settings → Email
- **Clerk Email Templates:** Clerk Dashboard → Email Templates
- **Clerk Webhooks:** Clerk Dashboard → Webhooks

