# Stripe Tax Implementation Plan

**Date:** January 2025  
**Status:** Planned - Part of Stripe Production Switch  
**Priority:** P0 - Launch Blocker

---

## 🎯 Overview

Add tax calculation to the Stripe checkout flow and include taxes in payment confirmation emails.

**Current Status:**
- ❌ Taxes not calculated in checkout
- ❌ Taxes not shown in emails
- ⚠️ Tax amount extracted in webhook (but not calculated)

**Target:**
- ✅ Enable Stripe Tax (automatic tax calculation)
- ✅ Show taxes in checkout
- ✅ Include taxes in payment confirmation emails
- ✅ Display tax breakdown in order details

---

## 📋 Implementation Requirements

### 1. Enable Stripe Tax in Checkout

**File:** `netlify/functions/create-checkout.js`

**Changes Needed:**
- Add `automatic_tax: { enabled: true }` to checkout session config
- Stripe will automatically calculate taxes based on shipping address
- Supports sales tax, VAT, GST, etc. based on location

**Code Addition:**
```javascript
const sessionConfig = {
  payment_method_types: ['card'],
  line_items: [...],
  mode: 'payment',
  automatic_tax: {
    enabled: true, // Enable Stripe Tax
  },
  // ... rest of config
}
```

**Benefits:**
- ✅ Automatic tax calculation (no manual rates needed)
- ✅ Supports all tax types (sales tax, VAT, GST)
- ✅ Updates automatically when tax rates change
- ✅ Compliant with tax regulations

---

### 2. Update Checkout Session Configuration

**Current Code (Line 160-214):**
- Creates checkout session with line items
- Includes shipping as line item
- No tax calculation

**Updated Code:**
- Add `automatic_tax: { enabled: true }`
- Stripe calculates tax automatically
- Tax appears as separate line item in checkout

---

### 3. Update Payment Confirmation Emails

**Files to Update:**
- `netlify/functions/send-confirmation-email.js` (if exists)
- `netlify/functions/utils/email-templates.js` (if payment emails use templates)
- Stripe webhook handler (for order confirmation emails)

**Email Template Updates:**
- Add tax line item to order summary
- Show subtotal, tax, shipping, total
- Format: Clear breakdown table

**Example Email Structure:**
```
Order Summary:
- Product: $XX.XX
- Shipping: $XX.XX
- Tax: $X.XX
-----------
Total: $XX.XX
```

---

### 4. Update Order Details Display

**File:** `netlify/functions/get-checkout-session.js`

**Current (Lines 162-165):**
- Extracts tax from session
- But tax is null (not calculated)

**Update:**
- Tax will be available after enabling automatic_tax
- Display in order details
- Show tax breakdown if multiple tax types

---

### 5. Update Webhook Handler

**File:** `netlify/functions/stripe-webhook.js`

**Current (Line 159):**
- Extracts `taxAmount` from session
- Currently 0 (tax not calculated)

**Update:**
- Tax will be populated automatically
- Include in order data
- Pass to ShipStation (if applicable)

---

## 🔧 Step-by-Step Implementation

### Step 1: Enable Stripe Tax in Stripe Dashboard

**Before Code Changes:**
1. Go to **Stripe Dashboard** → **Settings** → **Tax**
2. Enable **Stripe Tax**
3. Configure tax settings:
   - Enable for US (sales tax)
   - Enable for international (VAT/GST) if needed
   - Set up tax registration (if required)

**Note:** Stripe Tax is a paid feature (~0.5% of transaction)

---

### Step 2: Update Checkout Session Code

**File:** `netlify/functions/create-checkout.js`

**Add to sessionConfig (around line 160):**
```javascript
automatic_tax: {
  enabled: true,
},
```

**Location:** After `mode: 'payment'`, before `success_url`

---

### Step 3: Update Email Templates

**Create/Update Payment Confirmation Email:**

**New Function:** `netlify/functions/send-payment-confirmation-email.js`

**Or Update:** Existing confirmation email function

**Email Template Should Include:**
```html
<table>
  <tr>
    <td>Subtotal:</td>
    <td>$XX.XX</td>
  </tr>
  <tr>
    <td>Shipping:</td>
    <td>$XX.XX</td>
  </tr>
  <tr>
    <td>Tax:</td>
    <td>$X.XX</td>
  </tr>
  <tr>
    <td><strong>Total:</strong></td>
    <td><strong>$XX.XX</strong></td>
  </tr>
</table>
```

---

### Step 4: Update Order Details

**File:** `netlify/functions/get-checkout-session.js`

**Update tax extraction (lines 162-165):**
```javascript
// Tax will be in total_details.breakdown.taxes array
const taxBreakdown = session.total_details?.breakdown?.taxes || []
const taxAmount = taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)

// Or use total_details.amount_tax if available
const tax = session.total_details?.amount_tax 
  ? session.total_details.amount_tax / 100 
  : taxAmount
```

---

### Step 5: Update Webhook Handler

**File:** `netlify/functions/stripe-webhook.js`

**Update tax extraction (line 159):**
```javascript
// Extract tax from session
const taxBreakdown = session.total_details?.breakdown?.taxes || []
const taxAmount = taxBreakdown.length > 0
  ? taxBreakdown.reduce((sum, tax) => sum + (tax.amount / 100), 0)
  : (session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0)
```

---

## 🧪 Testing Checklist

### Test 1: Tax Calculation in Checkout
- [ ] Create test checkout session
- [ ] Verify tax is calculated (US address)
- [ ] Verify tax is calculated (international address)
- [ ] Verify tax shows in Stripe checkout UI
- [ ] Verify tax amount is correct

### Test 2: Tax in Order Details
- [ ] Complete test purchase
- [ ] Check order details page
- [ ] Verify tax is displayed
- [ ] Verify tax breakdown (if multiple tax types)

### Test 3: Tax in Emails
- [ ] Check Stripe receipt email (automatic)
- [ ] Check custom confirmation email (if sent)
- [ ] Verify tax line item in email
- [ ] Verify totals are correct

### Test 4: Tax in Webhook
- [ ] Check webhook payload
- [ ] Verify tax amount in order data
- [ ] Verify tax passed to ShipStation (if applicable)

---

## 💰 Stripe Tax Costs

**Pricing:**
- **0.5%** of transaction amount (for tax calculation)
- **Plus** standard Stripe processing fees (2.9% + $0.30)

**Example:**
- $100 order
- Tax calculation: $0.50
- Processing fee: $2.90 + $0.30 = $3.20
- **Total fees:** ~$3.70

**Alternative:** Manual tax calculation (free, but more work)

---

## 🎯 Tax Calculation Options

### Option A: Stripe Tax (Recommended)

**Pros:**
- ✅ Automatic calculation
- ✅ Always up-to-date rates
- ✅ Supports all tax types
- ✅ Compliant with regulations
- ✅ Handles complex scenarios

**Cons:**
- ⚠️ Additional cost (0.5% of transaction)
- ⚠️ Requires Stripe Tax setup

**Best For:** Production, compliance, accuracy

---

### Option B: Manual Tax Calculation

**Pros:**
- ✅ No additional cost
- ✅ Full control

**Cons:**
- ❌ Must maintain tax rate database
- ❌ Must update rates manually
- ❌ More complex code
- ❌ Risk of errors

**Best For:** Simple scenarios, cost-sensitive

---

## 📊 Tax Data Structure

### Stripe Session Response (After Enabling Tax)

```javascript
{
  total_details: {
    amount_shipping: 1500, // $15.00 in cents
    amount_tax: 850, // $8.50 in cents
    breakdown: {
      taxes: [
        {
          amount: 850,
          rate: {
            display_name: "Sales Tax",
            percentage: 8.5,
            type: "tax"
          }
        }
      ]
    }
  },
  amount_total: 10850 // $108.50 total (product + shipping + tax)
}
```

---

## 📝 Email Template Example

### Payment Confirmation Email with Tax

```html
<div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 4px;">
  <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600;">
    Order Summary
  </h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; color: #374151; font-size: 14px;">Subtotal:</td>
      <td style="text-align: right; padding: 8px 0; color: #374151; font-size: 14px;">$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #374151; font-size: 14px;">Shipping:</td>
      <td style="text-align: right; padding: 8px 0; color: #374151; font-size: 14px;">$${shipping.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #374151; font-size: 14px;">Tax:</td>
      <td style="text-align: right; padding: 8px 0; color: #374151; font-size: 14px;">$${tax.toFixed(2)}</td>
    </tr>
    <tr style="border-top: 2px solid #e5e7eb;">
      <td style="padding: 12px 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">Total:</td>
      <td style="text-align: right; padding: 12px 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">$${total.toFixed(2)}</td>
    </tr>
  </table>
</div>
```

---

## 🔍 Current Code Analysis

### Checkout Session (create-checkout.js)

**Current:**
- Line 160-214: Session config
- No `automatic_tax` setting
- Tax not calculated

**Needs:**
- Add `automatic_tax: { enabled: true }`
- Stripe will calculate automatically

---

### Webhook Handler (stripe-webhook.js)

**Current:**
- Line 159: Extracts `taxAmount`
- Currently 0 (tax not calculated)

**Needs:**
- Update to extract from `total_details.breakdown.taxes`
- Handle multiple tax types
- Include in order data

---

### Order Details (get-checkout-session.js)

**Current:**
- Lines 162-165: Extracts tax
- Currently null (tax not calculated)

**Needs:**
- Update to extract from session
- Display in order details
- Show tax breakdown

---

## ✅ Implementation Checklist

### Pre-Implementation
- [ ] Enable Stripe Tax in Stripe Dashboard
- [ ] Configure tax settings (US, international)
- [ ] Review Stripe Tax pricing
- [ ] Test tax calculation in Stripe test mode

### Code Changes
- [ ] Add `automatic_tax: { enabled: true }` to checkout session
- [ ] Update webhook handler to extract tax
- [ ] Update order details to display tax
- [ ] Create/update payment confirmation email template
- [ ] Include tax in email order summary

### Testing
- [ ] Test checkout with US address (sales tax)
- [ ] Test checkout with international address (VAT/GST)
- [ ] Verify tax shows in Stripe checkout UI
- [ ] Verify tax in order details page
- [ ] Verify tax in payment confirmation email
- [ ] Verify tax in webhook payload
- [ ] Test with different states/countries

### Production
- [ ] Enable Stripe Tax in production
- [ ] Test with real payment (small amount)
- [ ] Verify tax calculation accuracy
- [ ] Monitor for issues

---

## 🚨 Important Notes

### Stripe Tax Requirements

1. **Stripe Account Setup:**
   - Must enable Stripe Tax in dashboard
   - May require tax registration numbers
   - Must configure tax settings

2. **Cost:**
   - 0.5% of transaction amount
   - In addition to standard processing fees
   - Example: $100 order = $0.50 tax calculation fee

3. **Compliance:**
   - Stripe handles tax compliance
   - Automatically updates rates
   - Handles tax reporting

---

## 📋 Files to Update

1. **`netlify/functions/create-checkout.js`**
   - Add `automatic_tax: { enabled: true }`

2. **`netlify/functions/stripe-webhook.js`**
   - Update tax extraction logic

3. **`netlify/functions/get-checkout-session.js`**
   - Update tax extraction and display

4. **`netlify/functions/send-payment-confirmation-email.js`** (create if needed)
   - Add tax to email template

5. **`netlify/functions/utils/email-templates.js`** (if payment emails use templates)
   - Add tax to order summary template

---

## 🎯 Success Criteria

✅ **Tax Calculation:**
- Tax calculated automatically based on shipping address
- Correct tax rate applied
- Tax shown in Stripe checkout

✅ **Email Display:**
- Tax included in payment confirmation email
- Clear breakdown: subtotal, shipping, tax, total
- Accurate totals

✅ **Order Details:**
- Tax displayed on order details page
- Tax breakdown shown (if multiple tax types)
- Accurate calculations

✅ **Webhook Integration:**
- Tax amount extracted correctly
- Tax passed to ShipStation (if applicable)
- Tax included in order data

---

## 📅 Timeline

### Phase 1: Setup (1-2 hours)
- Enable Stripe Tax in dashboard
- Configure tax settings
- Test in Stripe test mode

### Phase 2: Code Updates (2-3 hours)
- Update checkout session
- Update webhook handler
- Update order details
- Create/update email templates

### Phase 3: Testing (2-3 hours)
- Test tax calculation
- Test email display
- Test order details
- Test webhook integration

### Phase 4: Production (1 hour)
- Enable in production
- Test with real payment
- Verify accuracy

**Total Time:** 6-9 hours

---

## 🔗 Resources

- **Stripe Tax Documentation:** https://stripe.com/docs/tax
- **Stripe Tax Setup Guide:** https://stripe.com/docs/tax/set-up
- **Stripe Tax Pricing:** https://stripe.com/pricing#tax

---

**Status:** Ready to implement as part of Stripe Production Switch  
**Next:** Enable Stripe Tax in dashboard, then update code

