# Quick Test Walkthrough - Step by Step

**Let's test the payment flow together!**

---

## 🧪 Test 1: Homeowner - Mini Purchase (Simplest Test)

### Step-by-Step:

1. **Open your site in a browser**
   - Go to your production URL (or localhost if testing locally)

2. **Sign in as a homeowner**
   - If you don't have a homeowner account, create one at `/auth/signup`
   - Role: Homeowner

3. **Navigate to Mini product**
   - Go to the Mini product page
   - Or use the product selector if available

4. **Click "Buy Now" or checkout button**
   - Should show price: **$99.99**

5. **Check browser console (F12)**
   - Open DevTools → Console tab
   - Look for network request to `/.netlify/functions/get-price-id`
   - Click on it to see the response
   - Should show: `priceId: "price_1SZe5X60dq6nGBAfwo2hsNxK"`

6. **Complete checkout**
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)
   - Click "Pay"

7. **Verify success**
   - Should redirect to success page
   - Should show order details

**✅ Expected Result:** Payment completes successfully, redirects to success page

---

## 🧪 Test 2: HVAC Pro - Mini Tier 1 (1-20 units)

### Step-by-Step:

1. **Sign in as HVAC Pro**
   - Use an HVAC Pro account (or create one)
   - Role: HVAC Pro

2. **Go to HVAC Pro catalog**
   - Navigate to `/business/pro/catalog`
   - Or click "View Products & Pricing" from dashboard

3. **Select "AC Drain Wiz Mini"**
   - Click the Mini product button

4. **Select quantity: 10**
   - Use quick-select button or enter manually
   - Should show: **$71.67 per unit**
   - Total: **$716.70** (10 × $71.67)

5. **Check browser console**
   - Look for `get-price-id` request
   - Should show: `priceId: "price_1SZebe60dq6nGBAfutAtD9re"` (Tier 1)

6. **Click checkout**
   - Should redirect to Stripe
   - Complete payment with test card

**✅ Expected Result:** Tier 1 price ($71.67) applied correctly

---

## 🧪 Test 3: HVAC Pro - Mini Tier 2 (21-100 units)

### Step-by-Step:

1. **Same as Test 2, but:**
   - Select quantity: **50** (Tier 2)
   - Should show: **$65.00 per unit**
   - Total: **$3,250.00** (50 × $65.00)

2. **Check Price ID**
   - Should use: `price_1SZeiH60dq6nGBAf2o2ypICU` (Tier 2)

**✅ Expected Result:** Tier 2 price ($65.00) applied correctly

---

## 🧪 Test 4: HVAC Pro - Mini Tier 3 (101-500 units)

### Step-by-Step:

1. **Same as Test 2, but:**
   - Select quantity: **200** (Tier 3)
   - Should show: **$58.00 per unit**
   - Total: **$11,600.00** (200 × $58.00)

2. **Check Price ID**
   - Should use: `price_1SZekg60dq6nGBAfTQ8c630l` (Tier 3)

**✅ Expected Result:** Tier 3 price ($58.00) applied correctly

---

## 🧪 Test 5: HVAC Pro - Sensor Purchase

### Step-by-Step:

1. **Sign in as HVAC Pro**
2. **Go to `/business/pro/catalog`**
3. **Select "AC Drain Wiz Sensor"**
4. **Select quantity: 25** (Tier 2)
5. **Verify:**
   - Price: **$45.50 per unit** (Tier 2)
   - Total: **$1,137.50** (25 × $45.50)
6. **Check Price ID:**
   - Should use: `price_1SZf1t60dq6nGBAfe36Q57Bp` (Sensor Tier 2)

**✅ Expected Result:** Sensor pricing works correctly

---

## 🧪 Test 6: HVAC Pro - Bundle Purchase

### Step-by-Step:

1. **Sign in as HVAC Pro**
2. **Select "Mini + Sensor Bundle"**
3. **Select quantity: 15** (Tier 1)
4. **Verify:**
   - Price: **$129.00 per unit** (Tier 1)
   - Total: **$1,935.00** (15 × $129.00)
5. **Check Price ID:**
   - Should use: `price_1SZf9f60dq6nGBAfmqSXnqbY` (Bundle Tier 1)

**✅ Expected Result:** Bundle pricing works, rounded prices display correctly

---

## 🧪 Test 7: Property Manager - All Products

### Step-by-Step:

1. **Sign in as Property Manager**
2. **Go to `/business/property-manager/catalog`**
3. **Test Mini:**
   - Quantity 10 → Should be **$64.50** (10% lower than HVAC Pro Tier 1: $71.67)
   - Quantity 50 → Should be **$58.50** (10% lower than HVAC Pro Tier 2: $65.00)
   - Quantity 200 → Should be **$52.20** (10% lower than HVAC Pro Tier 3: $58.00)

4. **Test Sensor:**
   - Quantity 25 → Should be **$40.95** (10% lower than HVAC Pro Tier 2: $45.50)

5. **Test Bundle:**
   - Quantity 15 → Should be **$116.10** (10% lower than HVAC Pro Tier 1: $129.00)

**✅ Expected Result:** All Property Manager prices are 10% lower than HVAC Pro

---

## 🔍 How to Verify Price IDs Are Correct

### Method 1: Browser Console

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by: `get-price-id`
4. Click on a request
5. Go to **Response** tab
6. Should show:
   ```json
   {
     "priceId": "price_1SZ...",
     "price": 71.67,
     "tier": "tier_1"
   }
   ```

### Method 2: Stripe Dashboard

1. Go to Stripe Dashboard → **Payments**
2. Find your test payment
3. Click on it
4. Check **"Price"** section
5. Should show the correct Price ID

### Method 3: Netlify Function Logs

1. Go to Netlify Dashboard → **Functions**
2. Click on `get-price-id`
3. View recent invocations
4. Check logs for Price ID being returned

---

## 🐛 Troubleshooting

### Issue: "Price ID not found" error

**Check:**
- Environment variables are set in Netlify
- Site was redeployed after updating variables
- Price IDs match exactly (no extra spaces)

**Fix:**
- Verify in Netlify Dashboard → Environment variables
- Check `netlify env:list | grep STRIPE_PRICE`
- Redeploy site

### Issue: Wrong price showing

**Check:**
- Browser console for errors
- Network request to `get-price-id` shows correct Price ID
- Pricing config file matches Stripe prices

**Fix:**
- Check `src/config/pricing.ts` has correct prices
- Verify Price ID in Stripe Dashboard matches the price

### Issue: Checkout doesn't redirect

**Check:**
- Browser console for errors
- Network request to `create-checkout` succeeds
- `STRIPE_SECRET_KEY` is correct (new account)

**Fix:**
- Check Netlify function logs
- Verify Stripe keys are from new account

---

## ✅ Quick Verification Checklist

After each test, verify:

- [ ] Correct price displays
- [ ] Correct Price ID is used (check console)
- [ ] Checkout redirects to Stripe
- [ ] Payment completes successfully
- [ ] Success page loads
- [ ] Webhook receives event (check Stripe Dashboard)

---

**Ready?** Let's start with Test 1 (Homeowner Mini) - it's the simplest!

