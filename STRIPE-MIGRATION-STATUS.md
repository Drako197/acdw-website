# Stripe Migration Status

**Last Updated:** Current Session

---

## ✅ Completed Steps

- [x] **API Keys Received**
  - Secret Key: `sk_test_xxxxx` (added to Netlify)
  - Publishable Key: `pk_test_xxxxx` (added to Netlify)

- [x] **Webhook Created**
  - Webhook endpoint: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
  - Events configured: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
  - Webhook secret: `whsec_xxxxx` (added to Netlify as `STRIPE_WEBHOOK_SECRET`)

- [x] **Environment Variables Updated**
  - `STRIPE_SECRET_KEY` ✅
  - `STRIPE_PUBLISHABLE_KEY` ✅
  - `STRIPE_WEBHOOK_SECRET` ✅

---

## ⏳ Next Steps

### 1. Check/Create Products in Stripe

**Go to:** Stripe Dashboard → Products

**Check if these exist:**
- [ ] AC Drain Wiz Mini
- [ ] AC Drain Wiz Sensor
- [ ] AC Drain Wiz Mini + Sensor Bundle

**If they don't exist, create them:**
1. Click "Add product"
2. Name: "AC Drain Wiz Mini" (or Sensor, or Bundle)
3. Description: (your product description)
4. Save product
5. Repeat for all 3 products

---

### 2. Create 21 Price IDs

**You need to create prices for each product/role/tier combination.**

**Reference:** Use your current pricing from the old account, or see `STRIPE-ENV-VARIABLES.md` for the structure.

**Quick Checklist:**

#### Homeowner (3 Price IDs - MSRP)
- [ ] Mini - Homeowner: $XX.XX
- [ ] Sensor - Homeowner: $XX.XX
- [ ] Bundle - Homeowner: $XX.XX

#### HVAC Pro Tier 1 (1-20 units) - 3 Price IDs
- [ ] Mini - HVAC Pro T1: $XX.XX
- [ ] Sensor - HVAC Pro T1: $XX.XX
- [ ] Bundle - HVAC Pro T1: $XX.XX

#### HVAC Pro Tier 2 (21-100 units) - 3 Price IDs
- [ ] Mini - HVAC Pro T2: $XX.XX
- [ ] Sensor - HVAC Pro T2: $XX.XX
- [ ] Bundle - HVAC Pro T2: $XX.XX

#### HVAC Pro Tier 3 (101-500 units) - 3 Price IDs
- [ ] Mini - HVAC Pro T3: $XX.XX
- [ ] Sensor - HVAC Pro T3: $XX.XX
- [ ] Bundle - HVAC Pro T3: $XX.XX

#### Property Manager Tier 1 (1-20 units) - 3 Price IDs
- [ ] Mini - PM T1: $XX.XX
- [ ] Sensor - PM T1: $XX.XX
- [ ] Bundle - PM T1: $XX.XX

#### Property Manager Tier 2 (21-100 units) - 3 Price IDs
- [ ] Mini - PM T2: $XX.XX
- [ ] Sensor - PM T2: $XX.XX
- [ ] Bundle - PM T2: $XX.XX

#### Property Manager Tier 3 (101-500 units) - 3 Price IDs
- [ ] Mini - PM T3: $XX.XX
- [ ] Sensor - PM T3: $XX.XX
- [ ] Bundle - PM T3: $XX.XX

**Total: 21 Price IDs**

---

### 3. How to Create Prices

1. Go to Stripe Dashboard → **Products**
2. Click on a product (e.g., "AC Drain Wiz Mini")
3. Click **"Add price"** or **"Pricing"** tab
4. Set:
   - **Price:** $XX.XX (enter your price)
   - **Billing:** One-time
   - **Currency:** USD
5. Click **"Add price"** or **"Save"**
6. **Copy the Price ID** (starts with `price_`)
   - Example: `price_1SXaIMD0VZDEkpOxWaGoZgKt`
7. **Repeat for all 21 prices**

**Tip:** You can create multiple prices for the same product. Just add a new price each time.

---

### 4. Send Me All Price IDs

Once you have all 21 Price IDs, send them to me in this format:

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

I'll update all the Netlify environment variables for you.

---

### 5. Redeploy Site

After all environment variables are updated:

1. **Trigger a new deploy** in Netlify
   - Or make a small change and push to git
   - This ensures all new environment variables are loaded

2. **Test the payment flow:**
   - Try a test checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Verify webhook receives events

---

## 📋 Current Status Summary

**✅ Done:**
- API keys configured
- Webhook created and configured
- Environment variables set

**⏳ In Progress:**
- Products (need to check/create)
- Price IDs (need to create 21)

**📝 Waiting For:**
- All 21 Price IDs to update environment variables

---

## 🎯 What to Do Now

1. **Check Stripe Dashboard → Products**
   - See if products exist
   - Create them if needed

2. **Create 21 Price IDs**
   - Use your current pricing structure
   - Copy each Price ID as you create it

3. **Send me all 21 Price IDs**
   - I'll update the Netlify environment variables
   - Then we can test!

---

**Questions?** Let me know if you need help with any step!

