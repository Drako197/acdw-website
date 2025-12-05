# Stripe Dynamic Shipping Setup Guide

**Purpose:** Enable real-time shipping calculation in Stripe Checkout based on customer address

**Date:** December 5, 2025

---

## Overview

This guide will configure Stripe to automatically calculate shipping costs based on the customer's address during checkout. When a customer enters their address, Stripe will call our webhook to get the exact shipping cost for their location.

---

## Prerequisites

- ✅ Netlify Functions deployed
- ✅ `calculate-shipping-rate.js` function live
- ✅ Stripe account with Checkout enabled

---

## Step 1: Get Your Webhook URL

Your webhook endpoint is:

**Production:**
```
https://www.acdrainwiz.com/.netlify/functions/calculate-shipping-rate
```

**Testing (if using Stripe test mode):**
```
https://www.acdrainwiz.com/.netlify/functions/calculate-shipping-rate
```

---

## Step 2: Configure Stripe Dashboard

### 2.1 Go to Stripe Dashboard

1. Log in to: https://dashboard.stripe.com
2. **Make sure you're in the correct mode:**
   - **Test mode** (for testing)
   - **Live mode** (for production)

### 2.2 Navigate to Checkout Settings

1. Click **Settings** (top right corner)
2. In the left sidebar, click **Checkout and payment links**
3. Scroll down to **Shipping rate calculation**

### 2.3 Enable Shipping Rate Calculation

1. Toggle **ON** the "Calculate shipping rates in real time" option
2. You'll see a field for **Webhook endpoint URL**
3. Enter your webhook URL:
   ```
   https://www.acdrainwiz.com/.netlify/functions/calculate-shipping-rate
   ```
4. Click **Save**

### 2.4 Configure Allowed Countries

In the same section:
1. Ensure **Shipping address collection** is enabled
2. Set allowed countries to: **United States** and **Canada**
3. Click **Save**

---

## Step 3: Test the Webhook

### 3.1 Create a Test Checkout Session

1. Go to your website: https://www.acdrainwiz.com/products/mini
2. Click **Buy Now**
3. Select quantity (e.g., 10 units)
4. You'll be redirected to Stripe Checkout

### 3.2 Enter Address

1. Enter a test shipping address:
   - **Address:** 123 Main St
   - **City:** Miami
   - **State:** FL
   - **ZIP:** 33101
   - **Country:** United States

2. **Watch what happens:**
   - As soon as you enter the ZIP code, Stripe will call our webhook
   - Shipping cost should update automatically
   - You should see: **$19.00** for 10 units in Zone 1-2 (FL)

### 3.3 Verify in Netlify Logs

1. Go to: https://app.netlify.com
2. Select your site
3. Click **Functions** tab
4. Click **calculate-shipping-rate** function
5. Check **Function log**

**You should see:**
```
Stripe shipping calculation request: { shippingAddress: {...}, lineItems: 1 }
Calculating shipping for: { address: 'Miami, FL 33101', products: { mini: 10 } }
Shipping calculation result: { cost: 19, method: 'zone', carrier: 'ups_ground' }
Returning shipping rate to Stripe: { amount: 1900, displayName: 'Standard Ground Shipping' }
```

---

## Step 4: Test Different Zones

Try these addresses to verify all zones work:

### Zone 1-2: Florida
- Address: 123 Main St, Miami, FL 33101
- **Expected:** $19.00 (10 units)

### Zone 3-4: Texas
- Address: 456 Oak Ave, Houston, TX 77001
- **Expected:** $22.50 (10 units)

### Zone 5-6: Illinois
- Address: 789 State St, Chicago, IL 60601
- **Expected:** $26.50 (10 units)

### Zone 7-8: California
- Address: 321 Pacific Blvd, Los Angeles, CA 90001
- **Expected:** $31.00 (10 units)

### Canada
- Address: 100 King St, Toronto, ON M5H 2N2
- **Expected:** $46.00 (10 units)

---

## Step 5: Verify User Experience

### For Guests (No Saved Address):

**What should happen:**
1. Click "Buy Now" → Select quantity
2. Redirected to Stripe Checkout
3. Enter shipping address
4. As soon as ZIP is entered, shipping cost appears
5. **ONE shipping option** shown: "Standard Ground Shipping - $XX.XX"
6. Proceed to payment

**What should NOT happen:**
- ❌ Multiple zone options to choose from
- ❌ No shipping cost shown
- ❌ Error messages
- ❌ Manual zone selection

### For Logged-In Users (Saved Address):

**What should happen:**
1. Click "Buy Now" → Select quantity
2. System calculates shipping BEFORE Stripe
3. Redirected to Stripe Checkout
4. Address is pre-filled
5. **ONE shipping option** already calculated
6. Proceed to payment

**What should NOT happen:**
- ❌ Address collection (already saved)
- ❌ Multiple zone options
- ❌ Incorrect shipping cost

---

## Troubleshooting

### Issue: "Shipping rates not available"

**Cause:** Webhook not configured or not responding

**Fix:**
1. Check Stripe Dashboard → Checkout settings → Shipping rate calculation
2. Verify webhook URL is correct
3. Check Netlify function logs for errors
4. Ensure function is deployed and live

### Issue: Multiple shipping options shown

**Cause:** Old code still creating zone options

**Fix:**
1. Check if latest code is deployed
2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
3. Verify `create-checkout.js` has updated logic

### Issue: Wrong shipping cost

**Cause:** Shipping calculator error or zone mapping issue

**Fix:**
1. Check Netlify function logs for calculation details
2. Verify state-to-zone mapping in `shipping-calculator.cjs`
3. Test with known addresses to verify zones

### Issue: Webhook timeout

**Cause:** Shipping calculation taking too long

**Fix:**
1. Check if ShipStation API is responding (if configured)
2. Verify zone-based fallback is working
3. Increase webhook timeout in Stripe Dashboard (if available)

### Issue: Address validation fails

**Cause:** Invalid address or country not supported

**Fix:**
1. Ensure only US and Canada are allowed
2. Verify address format in webhook payload
3. Add better error handling for edge cases

---

## Monitoring Checklist

After setup, monitor for:

- [ ] All zone calculations work correctly
- [ ] Canada shipping calculates properly
- [ ] Webhook response time < 3 seconds
- [ ] No errors in Netlify function logs
- [ ] Customers see accurate shipping costs
- [ ] No complaints about zone selection
- [ ] Checkout completion rate improves

---

## Rollback Plan

If issues occur:

### Option 1: Disable Dynamic Shipping Temporarily

1. Go to Stripe Dashboard → Checkout settings
2. Toggle OFF "Calculate shipping rates in real time"
3. System will fall back to pre-defined rates (if configured)

### Option 2: Revert Code

```bash
git revert HEAD
git push origin main
```

Wait for Netlify to redeploy.

---

## Advanced Configuration (Optional)

### Add Multiple Shipping Speeds

Currently only Standard Ground is offered. To add expedited:

1. Update `calculate-shipping-rate.js` to return multiple options:
```javascript
shipping_rates: [
  {
    shipping_rate_data: {
      display_name: 'Standard Ground',
      fixed_amount: { amount: 1900 },
      delivery_estimate: { minimum: 5, maximum: 7 }
    }
  },
  {
    shipping_rate_data: {
      display_name: '2-Day Express',
      fixed_amount: { amount: 3500 },
      delivery_estimate: { minimum: 2, maximum: 2 }
    }
  }
]
```

2. Update shipping calculator to support multiple carriers/speeds

### Add International Shipping

1. Update allowed countries in Stripe Dashboard
2. Add country-specific rates in `shipping-calculator.cjs`
3. Test thoroughly for customs/duties messaging

---

## Success Metrics

**Before dynamic shipping:**
- Multiple zone options shown ❌
- Customer confusion
- Support tickets: "Which zone am I?"

**After dynamic shipping:**
- ONE shipping option shown ✅
- Clear, automatic calculation
- No zone selection needed
- Better UX = higher conversion

---

## Next Steps

1. ✅ Deploy code (already done)
2. ⏳ Configure Stripe Dashboard (Step 2)
3. ⏳ Test with multiple addresses (Step 4)
4. ⏳ Monitor for 24-48 hours
5. ⏳ Verify no errors
6. ✅ Mark as complete

---

**Status:** Ready for Stripe Dashboard configuration

**Estimated Time:** 15 minutes to configure Stripe Dashboard

**Questions?** Check troubleshooting section or Netlify function logs

