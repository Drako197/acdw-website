# Payment Flow Testing Guide

This guide helps you test the complete payment flow from checkout button click to Stripe payment completion.

---

## Prerequisites

Before testing, ensure:

- [ ] All 21 Stripe Price IDs are set in Netlify environment variables
- [ ] `STRIPE_SECRET_KEY` is set in Netlify (test mode key: `sk_test_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` is set in Netlify (for webhook testing)
- [ ] Site is deployed to Netlify (functions need to be deployed)
- [ ] You have test user accounts for each role:
  - Homeowner
  - HVAC Pro
  - Property Manager

---

## Test Scenarios

### 1. Price ID Lookup Function (`get-price-id`)

**Purpose:** Verify the correct Price ID is returned based on product, quantity, and role.

#### Test Cases:

**Homeowner Tests:**
- [ ] Mini, quantity 1 → Should return `STRIPE_PRICE_MINI_HOMEOWNER`
- [ ] Sensor, quantity 1 → Should return `STRIPE_PRICE_SENSOR_HOMEOWNER`
- [ ] Bundle, quantity 1 → Should return `STRIPE_PRICE_BUNDLE_HOMEOWNER`

**HVAC Pro Tests:**
- [ ] Mini, quantity 10 (Tier 1: 1-20) → Should return `STRIPE_PRICE_MINI_HVAC_T1`
- [ ] Mini, quantity 50 (Tier 2: 21-100) → Should return `STRIPE_PRICE_MINI_HVAC_T2`
- [ ] Mini, quantity 200 (Tier 3: 101-500) → Should return `STRIPE_PRICE_MINI_HVAC_T3`
- [ ] Sensor, quantity 5 (Tier 1) → Should return `STRIPE_PRICE_SENSOR_HVAC_T1`
- [ ] Sensor, quantity 75 (Tier 2) → Should return `STRIPE_PRICE_SENSOR_HVAC_T2`
- [ ] Sensor, quantity 300 (Tier 3) → Should return `STRIPE_PRICE_SENSOR_HVAC_T3`
- [ ] Bundle, quantity 15 (Tier 1) → Should return `STRIPE_PRICE_BUNDLE_HVAC_T1`
- [ ] Bundle, quantity 80 (Tier 2) → Should return `STRIPE_PRICE_BUNDLE_HVAC_T2`
- [ ] Bundle, quantity 400 (Tier 3) → Should return `STRIPE_PRICE_BUNDLE_HVAC_T3`

**Property Manager Tests:**
- [ ] Mini, quantity 8 (Tier 1) → Should return `STRIPE_PRICE_MINI_PM_T1`
- [ ] Mini, quantity 60 (Tier 2) → Should return `STRIPE_PRICE_MINI_PM_T2`
- [ ] Mini, quantity 250 (Tier 3) → Should return `STRIPE_PRICE_MINI_PM_T3`

**Edge Cases:**
- [ ] Quantity 0 → Should return error
- [ ] Quantity > 500 → Should return error with `requiresContact: true`
- [ ] Invalid product → Should return error
- [ ] Invalid role → Should return error
- [ ] Missing fields → Should return error

#### How to Test:

**Option 1: Browser Console (on deployed site)**
```javascript
// Test Price ID lookup
fetch('/.netlify/functions/get-price-id', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: 'mini',
    quantity: 10,
    role: 'hvac_pro'
  })
})
.then(r => r.json())
.then(console.log)
```

**Option 2: Using curl (local testing with Netlify Dev)**
```bash
curl -X POST http://localhost:8888/.netlify/functions/get-price-id \
  -H "Content-Type: application/json" \
  -d '{"product":"mini","quantity":10,"role":"hvac_pro"}'
```

**Option 3: Using the test script (see below)**

---

### 2. Checkout Session Creation (`create-checkout`)

**Purpose:** Verify a Stripe Checkout session is created correctly.

#### Test Cases:

- [ ] Valid Price ID → Should return checkout URL
- [ ] Invalid Price ID → Should return error
- [ ] Missing required fields → Should return error
- [ ] Quantity validation (1-500) → Should reject invalid quantities
- [ ] Checkout URL redirects to Stripe → Should work correctly

#### How to Test:

**Browser Console:**
```javascript
// First get Price ID
const priceResponse = await fetch('/.netlify/functions/get-price-id', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: 'mini',
    quantity: 10,
    role: 'hvac_pro'
  })
})
const { priceId } = await priceResponse.json()

// Then create checkout
const checkoutResponse = await fetch('/.netlify/functions/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: priceId,
    quantity: 10,
    product: 'mini',
    userEmail: 'test@example.com',
    userId: 'user_123'
  })
})
const { url } = await checkoutResponse.json()
console.log('Checkout URL:', url)
// Open url in new tab to test Stripe Checkout
```

---

### 3. End-to-End Checkout Flow

**Purpose:** Test the complete flow from UI to Stripe payment.

#### Test Cases:

**HVAC Pro Flow:**
1. [ ] Sign in as HVAC Pro
2. [ ] Navigate to `/business/pro/catalog`
3. [ ] Select "AC Drain Wiz Mini"
4. [ ] Select quantity 10 (should show Tier 1 pricing)
5. [ ] Click "Proceed to Checkout"
6. [ ] Verify redirect to Stripe Checkout
7. [ ] Use test card: `4242 4242 4242 4242`
8. [ ] Complete payment
9. [ ] Verify redirect to success page (or current redirect behavior)

**Homeowner Flow:**
1. [ ] Sign in as Homeowner
2. [ ] Navigate to product page (when implemented)
3. [ ] Select product and quantity
4. [ ] Click checkout
5. [ ] Complete payment with test card
6. [ ] Verify success

**Property Manager Flow:**
1. [ ] Sign in as Property Manager
2. [ ] Navigate to catalog (when implemented)
3. [ ] Test checkout flow

#### Test Cards (Stripe Test Mode):

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`
- **3D Secure:** `4000 0027 6000 3184`

**Card Details:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

### 4. Webhook Testing

**Purpose:** Verify webhook events are received and processed correctly.

#### Prerequisites:

1. **Set up Stripe CLI for local webhook testing:**
   ```bash
   # Install Stripe CLI (if not installed)
   brew install stripe/stripe-cli/stripe
   
   # Login to Stripe
   stripe login
   
   # Forward webhooks to local function
   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
   ```

2. **Get webhook secret:**
   - The CLI will output a webhook signing secret
   - Add it to your local `.env` file as `STRIPE_WEBHOOK_SECRET`

3. **For production testing:**
   - Set up webhook endpoint in Stripe Dashboard
   - Add webhook URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
   - Copy webhook signing secret to Netlify environment variables

#### Test Cases:

- [ ] `checkout.session.completed` event → Should log payment success
- [ ] `payment_intent.succeeded` event → Should log success
- [ ] `payment_intent.payment_failed` event → Should log failure
- [ ] Invalid webhook signature → Should return 400 error
- [ ] Missing webhook secret → Should handle gracefully

#### How to Test:

**Local Testing with Stripe CLI:**
```bash
# In one terminal, start Netlify Dev
netlify dev

# In another terminal, forward webhooks
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook

# Trigger a test event
stripe trigger checkout.session.completed
```

**Production Testing:**
1. Complete a test payment on your deployed site
2. Check Netlify function logs for webhook events
3. Verify events are processed correctly

---

### 5. Error Handling

**Purpose:** Verify errors are handled gracefully.

#### Test Cases:

- [ ] Network error during Price ID lookup → Should show error message
- [ ] Invalid Price ID → Should show error message
- [ ] Stripe API error → Should show user-friendly error
- [ ] User cancels checkout → Should redirect to cancel page
- [ ] Payment fails → Should handle gracefully

---

## Automated Test Script

See `test-payment-flow.sh` for automated testing of the functions.

---

## Checklist Summary

### Pre-Testing Setup
- [ ] All environment variables set in Netlify
- [ ] Site deployed to Netlify
- [ ] Test user accounts created
- [ ] Stripe test mode enabled
- [ ] Webhook endpoint configured (for production)

### Function Testing
- [ ] `get-price-id` returns correct Price IDs for all scenarios
- [ ] `create-checkout` creates valid checkout sessions
- [ ] `stripe-webhook` processes events correctly

### End-to-End Testing
- [ ] HVAC Pro checkout flow works
- [ ] Homeowner checkout flow works (when implemented)
- [ ] Property Manager checkout flow works (when implemented)
- [ ] Success/cancel pages work (when implemented)
- [ ] Webhook events are received and processed

### Error Handling
- [ ] All error cases handled gracefully
- [ ] User-friendly error messages displayed
- [ ] Invalid inputs rejected properly

---

## Next Steps After Testing

1. **Create Success/Cancel Pages** (if not done)
2. **Complete Webhook Handler** (add order creation logic)
3. **Add Email Notifications** (order confirmation, etc.)
4. **Add Order History** (display past orders in dashboard)
5. **Security Hardening** (rate limiting, additional validation)

---

## Troubleshooting

### Price ID Not Found
- Verify environment variables are set correctly
- Check variable names match exactly (case-sensitive)
- Ensure site has been redeployed after adding variables

### Checkout Session Creation Fails
- Verify `STRIPE_SECRET_KEY` is set
- Check Stripe key is in test mode (for testing)
- Verify Price ID exists in Stripe Dashboard

### Webhook Not Receiving Events
- Verify webhook endpoint URL is correct
- Check `STRIPE_WEBHOOK_SECRET` is set
- Verify webhook is enabled in Stripe Dashboard
- Check Netlify function logs for errors

---

**Ready to test?** Start with the Price ID lookup function, then move to checkout session creation, and finally test the end-to-end flow.

