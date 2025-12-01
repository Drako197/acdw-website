# Stripe Migration Testing Guide

**Purpose:** Test the payment flow with the new Stripe account and Price IDs

---

## ✅ Prerequisites

Before testing, make sure:

- [ ] All 19 Price ID environment variables are set in Netlify
- [ ] `STRIPE_SECRET_KEY` is updated (new account)
- [ ] `STRIPE_WEBHOOK_SECRET` is set
- [ ] Site has been redeployed (to load new environment variables)
- [ ] You have test accounts for different roles (homeowner, hvac_pro, property_manager)

---

## 🧪 Test Scenarios

### Test 1: Homeowner - Mini Purchase

**Steps:**
1. Sign in as a homeowner (or create a test homeowner account)
2. Navigate to the Mini product page
3. Click "Buy Now" or checkout button
4. Verify:
   - Correct price shows: $99.99
   - Checkout redirects to Stripe
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

**Expected Result:**
- ✅ Checkout session created successfully
- ✅ Redirects to Stripe Checkout
- ✅ Payment completes
- ✅ Redirects to success page
- ✅ Webhook receives `checkout.session.completed` event

**Price ID Used:** `STRIPE_PRICE_MINI_HOMEOWNER`

---

### Test 2: HVAC Pro - Mini Tier 1 (1-20 units)

**Steps:**
1. Sign in as HVAC Pro
2. Go to `/business/pro/catalog`
3. Select "AC Drain Wiz Mini"
4. Select quantity: 10 (Tier 1)
5. Click checkout
6. Verify:
   - Price shows: $71.67 per unit
   - Total: $716.70 (10 × $71.67)
   - Complete payment with test card

**Expected Result:**
- ✅ Correct tier price applied
- ✅ Checkout works
- ✅ Webhook receives event

**Price ID Used:** `STRIPE_PRICE_MINI_HVAC_T1`

---

### Test 3: HVAC Pro - Mini Tier 2 (21-100 units)

**Steps:**
1. Sign in as HVAC Pro
2. Go to `/business/pro/catalog`
3. Select "AC Drain Wiz Mini"
4. Select quantity: 50 (Tier 2)
5. Click checkout
6. Verify:
   - Price shows: $65.00 per unit
   - Total: $3,250.00 (50 × $65.00)

**Expected Result:**
- ✅ Tier 2 price applied correctly

**Price ID Used:** `STRIPE_PRICE_MINI_HVAC_T2`

---

### Test 4: HVAC Pro - Mini Tier 3 (101-500 units)

**Steps:**
1. Sign in as HVAC Pro
2. Select "AC Drain Wiz Mini"
3. Select quantity: 200 (Tier 3)
4. Click checkout
5. Verify:
   - Price shows: $58.00 per unit
   - Total: $11,600.00 (200 × $58.00)

**Expected Result:**
- ✅ Tier 3 price applied correctly

**Price ID Used:** `STRIPE_PRICE_MINI_HVAC_T3`

---

### Test 5: HVAC Pro - Sensor Purchase

**Steps:**
1. Sign in as HVAC Pro
2. Select "AC Drain Wiz Sensor"
3. Select quantity: 25 (Tier 2)
4. Click checkout
5. Verify:
   - Price shows: $45.50 per unit (Tier 2)
   - Total: $1,137.50 (25 × $45.50)

**Expected Result:**
- ✅ Sensor pricing works
- ✅ Correct tier applied

**Price ID Used:** `STRIPE_PRICE_SENSOR_HVAC_T2`

---

### Test 6: HVAC Pro - Bundle Purchase

**Steps:**
1. Sign in as HVAC Pro
2. Select "Mini + Sensor Bundle"
3. Select quantity: 15 (Tier 1)
4. Click checkout
5. Verify:
   - Price shows: $129.00 per unit (Tier 1)
   - Total: $1,935.00 (15 × $129.00)

**Expected Result:**
- ✅ Bundle pricing works
- ✅ Rounded prices display correctly

**Price ID Used:** `STRIPE_PRICE_BUNDLE_HVAC_T1`

---

### Test 7: Property Manager - All Products

**Steps:**
1. Sign in as Property Manager
2. Go to `/business/property-manager/catalog`
3. Test each product (Mini, Sensor, Bundle)
4. Test each tier (1-20, 21-100, 101-500)
5. Verify:
   - Prices are 10% lower than HVAC Pro
   - Correct tiers apply

**Expected Results:**
- ✅ Property Manager pricing is correct
- ✅ All tiers work

**Price IDs Used:** All `STRIPE_PRICE_*_PM_*` variables

---

## 🔍 How to Verify Price IDs Are Working

### Method 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Attempt a checkout
4. Look for:
   - Network requests to `/.netlify/functions/get-price-id`
   - Check the response - should show the correct Price ID
   - Check the response - should show the correct price amount

### Method 2: Check Netlify Function Logs

1. Go to Netlify Dashboard
2. Navigate to **Functions** → **get-price-id**
3. Click on a recent invocation
4. Check the logs:
   - Should show the Price ID being returned
   - Should show the product, role, and tier

### Method 3: Check Stripe Dashboard

1. Go to Stripe Dashboard → **Payments**
2. Look for test payments
3. Click on a payment
4. Verify:
   - Correct Price ID was used
   - Correct amount was charged

---

## 🧪 Stripe Test Cards

Use these test cards in Stripe Checkout:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Decline:**
- Card: `4000 0000 0000 0002`
- Use to test failed payment handling

**Requires Authentication:**
- Card: `4000 0025 0000 3155`
- Use to test 3D Secure flow

---

## 🔗 Webhook Testing

### Check Webhook Events

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. View **"Recent deliveries"**
4. You should see:
   - `checkout.session.completed` events
   - `payment_intent.succeeded` events

### Test Webhook Locally (Optional)

If you want to test webhooks locally:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

---

## ✅ Testing Checklist

### Basic Functionality
- [ ] Homeowner can purchase Mini
- [ ] HVAC Pro can purchase all products
- [ ] Property Manager can purchase all products
- [ ] Correct prices display for each role
- [ ] Quantity tiers work correctly (1-20, 21-100, 101-500)
- [ ] Checkout redirects to Stripe
- [ ] Payment completes successfully
- [ ] Success page displays correctly
- [ ] Cancel page works

### Price ID Verification
- [ ] Homeowner Mini uses correct Price ID
- [ ] HVAC Pro Mini uses correct Price IDs for each tier
- [ ] HVAC Pro Sensor uses correct Price IDs for each tier
- [ ] HVAC Pro Bundle uses correct Price IDs for each tier
- [ ] Property Manager prices are 10% lower than HVAC Pro
- [ ] All Property Manager Price IDs work

### Webhook Testing
- [ ] Webhook receives `checkout.session.completed` events
- [ ] Webhook receives `payment_intent.succeeded` events
- [ ] Webhook signature verification works
- [ ] No webhook errors in Stripe Dashboard

### Error Handling
- [ ] Invalid quantity shows error
- [ ] Unauthorized role access is blocked
- [ ] Failed payments are handled gracefully
- [ ] Network errors show user-friendly messages

---

## 🐛 Troubleshooting

### Issue: "Price ID not found" or "Invalid Price ID"

**Solution:**
- Check environment variables are set in Netlify
- Verify Price IDs match exactly (no extra spaces)
- Redeploy site to load new environment variables
- Check `get-price-id.js` function logs

### Issue: Wrong price showing

**Solution:**
- Check pricing config file (`src/config/pricing.ts`)
- Verify Price IDs in Stripe match the prices in config
- Check browser console for errors
- Verify correct tier is being calculated

### Issue: Webhook not receiving events

**Solution:**
- Check webhook URL is correct in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook is enabled (not disabled)
- Test with Stripe CLI locally

### Issue: "Checkout session creation failed"

**Solution:**
- Check `STRIPE_SECRET_KEY` is correct (new account key)
- Verify secret key is for test mode (starts with `sk_test_`)
- Check Netlify function logs for detailed error
- Verify all required environment variables are set

---

## 📊 What to Check After Testing

1. **Stripe Dashboard:**
   - Payments show correct amounts
   - Price IDs match what we created
   - Webhook events are received

2. **Netlify Dashboard:**
   - Function logs show no errors
   - Environment variables are loaded
   - Deploy was successful

3. **Browser Console:**
   - No JavaScript errors
   - Network requests succeed
   - Correct Price IDs are used

4. **Application:**
   - Prices display correctly
   - Checkout flow works
   - Success/cancel pages work
   - User experience is smooth

---

## 🎯 Quick Test Script

Run through these quickly:

1. ✅ Homeowner buys Mini ($99.99)
2. ✅ HVAC Pro buys 10 Minis (Tier 1: $71.67 each)
3. ✅ HVAC Pro buys 50 Sensors (Tier 2: $45.50 each)
4. ✅ HVAC Pro buys 200 Bundles (Tier 3: $104.00 each)
5. ✅ Property Manager buys 25 Minis (Tier 2: $58.50 each)
6. ✅ Check webhook received all events

---

**Ready to test?** Start with Test 1 (Homeowner Mini) and work through each scenario!

