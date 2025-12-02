# ShipStation Integration Setup Guide

## Overview
This guide will help you set up the Stripe → ShipStation integration to automatically create orders in ShipStation when payments are completed.

## Prerequisites

✅ **Completed:**
- ShipStation integration function created
- Stripe webhook updated
- SKU mapping configured

⏳ **Still Needed:**
- ShipStation API credentials
- Environment variables in Netlify
- Email notification addresses
- Test order

---

## Step 1: Get ShipStation API Credentials

See `SHIPSTATION-API-CREDENTIALS-GUIDE.md` for detailed instructions.

**Quick Steps:**
1. Log into ShipStation
2. Go to **Settings → API Settings** (or **Account → API**)
3. Find or generate:
   - **API Key**
   - **API Secret**
4. Copy both values (you'll need them in Step 2)

**Note:** If you have multiple stores, also note the **Store ID**.

---

## Step 2: Add Environment Variables to Netlify

1. Go to **Netlify Dashboard → Your Site → Site Settings → Environment Variables**
2. Click **"Add variable"** and add each of these:

### Required Variables:

**SHIPSTATION_API_KEY**
- **Value:** Your ShipStation API Key
- **Scopes:** All scopes (Production, Deploy previews, Branch deploys)

**SHIPSTATION_API_SECRET**
- **Value:** Your ShipStation API Secret
- **Scopes:** All scopes

**SHIPSTATION_STORE_ID** (Optional - only if you have multiple stores)
- **Value:** Your Store ID
- **Scopes:** All scopes

**SHIPSTATION_NOTIFICATION_EMAILS**
- **Value:** Comma-separated list of email addresses
- **Example:** `orders@acdrainwiz.com,fulfillment@acdrainwiz.com`
- **Scopes:** All scopes
- **Purpose:** Email notifications when orders are created (or fail)

### Example:
```
SHIPSTATION_API_KEY = abc123xyz789...
SHIPSTATION_API_SECRET = secret456def...
SHIPSTATION_STORE_ID = 12345 (optional)
SHIPSTATION_NOTIFICATION_EMAILS = orders@acdrainwiz.com,fulfillment@acdrainwiz.com
```

3. Click **Save** after adding each variable

---

## Step 3: Create SKUs in ShipStation

You need to create the following SKUs in ShipStation before orders can be created:

### SKU List (19 total):

**Homeowner:**
- `ACDW-MINI-HOMEOWNER` - AC Drain Wiz Mini

**HVAC Pro - Mini:**
- `ACDW-MINI-PRO-T1` - AC Drain Wiz Mini (Tier 1)
- `ACDW-MINI-PRO-T2` - AC Drain Wiz Mini (Tier 2)
- `ACDW-MINI-PRO-T3` - AC Drain Wiz Mini (Tier 3)

**HVAC Pro - Sensor:**
- `ACDW-SENSOR-PRO-T1` - AC Drain Wiz Sensor (Tier 1)
- `ACDW-SENSOR-PRO-T2` - AC Drain Wiz Sensor (Tier 2)
- `ACDW-SENSOR-PRO-T3` - AC Drain Wiz Sensor (Tier 3)

**HVAC Pro - Bundle:**
- `ACDW-BUNDLE-PRO-T1` - AC Drain Wiz Mini + Sensor Bundle (Tier 1)
- `ACDW-BUNDLE-PRO-T2` - AC Drain Wiz Mini + Sensor Bundle (Tier 2)
- `ACDW-BUNDLE-PRO-T3` - AC Drain Wiz Mini + Sensor Bundle (Tier 3)

**Property Manager - Mini:**
- `ACDW-MINI-PM-T1` - AC Drain Wiz Mini (Tier 1)
- `ACDW-MINI-PM-T2` - AC Drain Wiz Mini (Tier 2)
- `ACDW-MINI-PM-T3` - AC Drain Wiz Mini (Tier 3)

**Property Manager - Sensor:**
- `ACDW-SENSOR-PM-T1` - AC Drain Wiz Sensor (Tier 1)
- `ACDW-SENSOR-PM-T2` - AC Drain Wiz Sensor (Tier 2)
- `ACDW-SENSOR-PM-T3` - AC Drain Wiz Sensor (Tier 3)

**Property Manager - Bundle:**
- `ACDW-BUNDLE-PM-T1` - AC Drain Wiz Mini + Sensor Bundle (Tier 1)
- `ACDW-BUNDLE-PM-T2` - AC Drain Wiz Mini + Sensor Bundle (Tier 2)
- `ACDW-BUNDLE-PM-T3` - AC Drain Wiz Mini + Sensor Bundle (Tier 3)

### How to Create SKUs in ShipStation:

1. Go to **ShipStation → Settings → Products**
2. Click **"Add Product"** or **"Import Products"**
3. For each SKU:
   - **SKU:** Enter the SKU code (e.g., `ACDW-MINI-HOMEOWNER`)
   - **Name:** Enter product name (e.g., "AC Drain Wiz Mini")
   - **Weight:** Enter product weight (if needed for shipping calculations)
   - **Dimensions:** Enter package dimensions (if needed)
4. Save each product

**Tip:** You can import all products at once using ShipStation's bulk import feature (CSV).

---

## Step 4: Redeploy Site

After adding environment variables:

1. Go to **Netlify Dashboard → Deploys**
2. Click **"Trigger deploy" → "Deploy site"**
3. Wait for deployment to complete

This ensures the functions have access to the new environment variables.

---

## Step 5: Test the Integration

### Test with Stripe Test Mode:

1. **Make a test purchase:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete checkout
   - Use a test email address

2. **Check Stripe Webhook Logs:**
   - Go to **Stripe Dashboard → Developers → Webhooks**
   - Find your webhook endpoint
   - Check for `checkout.session.completed` event
   - Verify it was successful (green checkmark)

3. **Check Netlify Function Logs:**
   - Go to **Netlify Dashboard → Functions → stripe-webhook**
   - Look for log entry: "Payment successful: cs_test_..."
   - Check for: "Order created in ShipStation"

4. **Check ShipStation:**
   - Go to **ShipStation → Orders**
   - Look for new order with order number matching Stripe session ID
   - Verify:
     - Customer information is correct
     - Shipping address is correct
     - Line items match the purchase
     - SKUs are correct

5. **Check Email Notifications:**
   - Check the email addresses you configured
   - Should receive notification about order creation

### Test with Real Payment (Production):

1. Make a small real purchase
2. Follow same verification steps as above
3. Verify order appears in ShipStation
4. Process the order in ShipStation to test full workflow

---

## Troubleshooting

### Issue: Orders not appearing in ShipStation

**Check:**
1. ✅ Environment variables are set correctly
2. ✅ SKUs exist in ShipStation
3. ✅ Netlify function logs for errors
4. ✅ Stripe webhook is firing
5. ✅ ShipStation API credentials are valid

**Common Errors:**

**"ShipStation API credentials not configured"**
- Solution: Add `SHIPSTATION_API_KEY` and `SHIPSTATION_API_SECRET` to Netlify

**"ShipStation API error: 401"**
- Solution: API credentials are incorrect - verify in ShipStation

**"SKU not found"**
- Solution: Create the SKU in ShipStation (see Step 3)

**"No shipping address found"**
- Solution: Ensure shipping address collection is enabled in Stripe Checkout

### Issue: Email notifications not sending

**Current Status:** Email notifications are logged but not automatically sent.

**Options:**
1. **Use Zapier:** Set up Zap to send emails when Netlify function logs contain "Email Notification"
2. **Add email service:** Integrate SendGrid, Mailgun, or similar
3. **Manual check:** Review Netlify function logs for notification details

---

## What Happens When an Order is Created

1. **Customer completes payment** in Stripe Checkout
2. **Stripe sends webhook** to `stripe-webhook.js`
3. **Webhook verifies signature** and processes event
4. **Webhook fetches order details** from Stripe
5. **Webhook calls** `create-shipstation-order.js`
6. **ShipStation function:**
   - Maps Stripe Price IDs to ShipStation SKUs
   - Formats order data for ShipStation API
   - Creates order in ShipStation
   - Sends email notification (if configured)
7. **Order appears in ShipStation** ready for fulfillment

---

## Next Steps

1. ✅ Get ShipStation API credentials
2. ✅ Add environment variables to Netlify
3. ✅ Create SKUs in ShipStation
4. ✅ Redeploy site
5. ✅ Test with test order
6. ✅ Test with real order
7. ✅ Set up email notifications (Zapier or email service)

---

## Support

If you encounter issues:
1. Check Netlify function logs
2. Check Stripe webhook logs
3. Check ShipStation API logs (if available)
4. Review error messages in email notifications

**Need help?** Let me know what errors you're seeing and I can help troubleshoot!

