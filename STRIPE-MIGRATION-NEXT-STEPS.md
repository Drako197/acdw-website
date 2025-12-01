# Stripe Migration - Next Steps

**Status:** ✅ API Keys Received  
**Account Type:** Test Mode (`sk_test_` / `pk_test_`)

---

## ✅ What We Have

- [x] Secret Key: Received (stored securely, not in git)
- [x] Publishable Key: Received (stored securely, not in git)
- [ ] Webhook Secret (needs to be created/configured)
- [ ] Products (need to check/create)
- [ ] Price IDs (need to create 21 total)

---

## 🔄 Step 1: Update Netlify Environment Variables

I've created a script to update the keys. You can either:

### Option A: Use the Script (Easiest)
```bash
./update-stripe-keys.sh
```

### Option B: Manual Update via Netlify CLI
```bash
# Replace with your actual keys
netlify env:set STRIPE_SECRET_KEY "sk_test_xxxxx"
netlify env:set STRIPE_PUBLISHABLE_KEY "pk_test_xxxxx"
```

### Option C: Update via Netlify Dashboard
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

---

## 🔗 Step 2: Set Up Webhook

### Create Webhook in Stripe Dashboard

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### Add Webhook Secret to Netlify

```bash
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_xxxxx"
```

Or via Netlify Dashboard → Environment variables

---

## 🛍️ Step 3: Check/Create Products

### Check if Products Exist

1. Go to Stripe Dashboard → **Products**
2. Check if these products exist:
   - AC Drain Wiz Mini
   - AC Drain Wiz Sensor
   - AC Drain Wiz Mini + Sensor Bundle

### If Products Don't Exist: Create Them

1. Click **Add product**
2. Create each product with:
   - **Name:** AC Drain Wiz Mini (or Sensor, or Bundle)
   - **Description:** (your product description)
   - **Pricing:** We'll add prices in the next step

### If Products Exist: Verify Names Match

Make sure product names match exactly:
- "AC Drain Wiz Mini"
- "AC Drain Wiz Sensor"  
- "AC Drain Wiz Mini + Sensor Bundle"

---

## 💰 Step 4: Create Price IDs

You need to create **21 Price IDs** total.

### Pricing Structure Reference

Use your current pricing from the old account, or reference `STRIPE-ENV-VARIABLES.md`.

### Quick Checklist

**Homeowner (3 Price IDs):**
- [ ] Mini - Homeowner (MSRP)
- [ ] Sensor - Homeowner (MSRP)
- [ ] Bundle - Homeowner (MSRP)

**HVAC Pro Tier 1 (3 Price IDs):**
- [ ] Mini - HVAC Pro T1 (1-20 units)
- [ ] Sensor - HVAC Pro T1 (1-20 units)
- [ ] Bundle - HVAC Pro T1 (1-20 units)

**HVAC Pro Tier 2 (3 Price IDs):**
- [ ] Mini - HVAC Pro T2 (21-100 units)
- [ ] Sensor - HVAC Pro T2 (21-100 units)
- [ ] Bundle - HVAC Pro T2 (21-100 units)

**HVAC Pro Tier 3 (3 Price IDs):**
- [ ] Mini - HVAC Pro T3 (101-500 units)
- [ ] Sensor - HVAC Pro T3 (101-500 units)
- [ ] Bundle - HVAC Pro T3 (101-500 units)

**Property Manager Tier 1 (3 Price IDs):**
- [ ] Mini - PM T1 (1-20 units)
- [ ] Sensor - PM T1 (1-20 units)
- [ ] Bundle - PM T1 (1-20 units)

**Property Manager Tier 2 (3 Price IDs):**
- [ ] Mini - PM T2 (21-100 units)
- [ ] Sensor - PM T2 (21-100 units)
- [ ] Bundle - PM T2 (21-100 units)

**Property Manager Tier 3 (3 Price IDs):**
- [ ] Mini - PM T3 (101-500 units)
- [ ] Sensor - PM T3 (101-500 units)
- [ ] Bundle - PM T3 (101-500 units)

### How to Create Prices

1. Go to Stripe Dashboard → **Products**
2. Click on a product (e.g., "AC Drain Wiz Mini")
3. Click **Add price**
4. Set:
   - **Price:** $XX.XX
   - **Billing:** One-time
   - **Currency:** USD
5. Click **Add price**
6. **Copy the Price ID** (starts with `price_`)

**Repeat for all 21 prices.**

---

## 📋 Step 5: Send Me All Price IDs

Once you've created all 21 Price IDs, send them to me in this format:

```
STRIPE_PRICE_MINI_HOMEOWNER=price_xxxxx
STRIPE_PRICE_SENSOR_HOMEOWNER=price_xxxxx
STRIPE_PRICE_BUNDLE_HOMEOWNER=price_xxxxx

STRIPE_PRICE_MINI_HVAC_T1=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T1=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T1=price_xxxxx

STRIPE_PRICE_MINI_HVAC_T2=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T2=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T2=price_xxxxx

STRIPE_PRICE_MINI_HVAC_T3=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T3=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T3=price_xxxxx

STRIPE_PRICE_MINI_PM_T1=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T1=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T1=price_xxxxx

STRIPE_PRICE_MINI_PM_T2=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T2=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T2=price_xxxxx

STRIPE_PRICE_MINI_PM_T3=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T3=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T3=price_xxxxx
```

I'll then update all the Netlify environment variables for you.

---

## 🚀 Step 6: Test

After all environment variables are updated:

1. **Redeploy site** (or trigger a new deploy)
2. **Test checkout flow:**
   - Try different products
   - Try different roles (homeowner, HVAC Pro, Property Manager)
   - Try different quantities (to test tiers)
3. **Test webhook:**
   - Complete a test payment
   - Check webhook logs in Stripe Dashboard
   - Verify order appears in dashboard

---

## ⚠️ Important Notes

1. **Test Mode:** These are test keys, so use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. **Webhook URL:** Make sure the webhook URL is correct:
   - Production: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
   - If testing locally, use Stripe CLI: `stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook`

3. **Environment Variables:** All variables should be set for:
   - Production environment
   - Deploy previews (optional)
   - Branch deploys (optional)

---

## 📞 Questions?

If you need help with any step, let me know!

**Current Status:**
- ✅ API keys received
- ⏳ Waiting for: Webhook secret, Products, Price IDs

