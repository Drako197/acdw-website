# Stripe Price ID Setup - Step-by-Step Walkthrough

**Goal:** Create 21 Price IDs in Stripe and configure them in your Netlify environment variables.

---

## 📋 PREPARATION

### What You'll Need:
1. Stripe account (https://dashboard.stripe.com)
2. Access to Netlify Dashboard (for environment variables)
3. Pricing reference from `src/config/pricing.ts`

### Time Estimate:
- Creating Price IDs: ~30-45 minutes
- Adding to environment variables: ~10 minutes
- Testing: ~15 minutes
- **Total: ~1 hour**

---

## 🎯 STEP 1: Access Stripe Dashboard

1. Go to **https://dashboard.stripe.com**
2. **Important:** Toggle to **Test mode** (top right) - we'll do test mode first
3. Navigate to **Products** in the left sidebar

---

## 🎯 STEP 2: Create Products (If Not Already Created)

You need 3 products. If they don't exist, create them:

### Product 1: AC Drain Wiz Mini
1. Click **"+ Add product"**
2. **Name:** `AC Drain Wiz Mini`
3. **Description:** `Flagship compact maintenance manifold with bayonet port`
4. Click **"Save product"**

### Product 2: AC Drain Wiz Sensor
1. Click **"+ Add product"**
2. **Name:** `AC Drain Wiz Sensor`
3. **Description:** `No-contact capacitive water-level sensor`
4. Click **"Save product"**

### Product 3: AC Drain Wiz Mini + Sensor Bundle
1. Click **"+ Add product"**
2. **Name:** `AC Drain Wiz Mini + Sensor Bundle`
3. **Description:** `Complete protection system combining Mini and Sensor`
4. Click **"Save product"**

---

## 🎯 STEP 3: Create Prices - Homeowner (MSRP)

**3 prices total** - One per product at MSRP

### Price 1: Mini - Homeowner
1. Open **AC Drain Wiz Mini** product
2. Click **"+ Add price"**
3. **Price:** `99.99`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** (starts with `price_`) - Save this!
8. **Label it:** `STRIPE_PRICE_MINI_HOMEOWNER`

### Price 2: Sensor - Homeowner
1. Open **AC Drain Wiz Sensor** product
2. Click **"+ Add price"**
3. **Price:** `69.99`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** - Save this!
8. **Label it:** `STRIPE_PRICE_SENSOR_HOMEOWNER`

### Price 3: Bundle - Homeowner
1. Open **AC Drain Wiz Mini + Sensor Bundle** product
2. Click **"+ Add price"**
3. **Price:** `179.99`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** - Save this!
8. **Label it:** `STRIPE_PRICE_BUNDLE_HOMEOWNER`

---

## 🎯 STEP 4: Create Prices - HVAC Pro (Tier 1, 2, 3)

**9 prices total** - 3 tiers × 3 products

### Mini - HVAC Pro Tier 1
1. Open **AC Drain Wiz Mini** product
2. Click **"+ Add price"**
3. **Price:** `71.67`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** - Save this!
8. **Label it:** `STRIPE_PRICE_MINI_HVAC_T1`

### Mini - HVAC Pro Tier 2
1. Still in **AC Drain Wiz Mini** product
2. Click **"+ Add price"**
3. **Price:** `65.00`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** - Save this!
8. **Label it:** `STRIPE_PRICE_MINI_HVAC_T2`

### Mini - HVAC Pro Tier 3
1. Still in **AC Drain Wiz Mini** product
2. Click **"+ Add price"**
3. **Price:** `58.00`
4. **Currency:** `USD`
5. **Billing:** Select **"One time"**
6. Click **"Add price"**
7. **Copy the Price ID** - Save this!
8. **Label it:** `STRIPE_PRICE_MINI_HVAC_T3`

### Sensor - HVAC Pro (Tier 1, 2, 3)
Repeat the same process for **AC Drain Wiz Sensor**:
- **Tier 1:** `50.17` → `STRIPE_PRICE_SENSOR_HVAC_T1`
- **Tier 2:** `45.50` → `STRIPE_PRICE_SENSOR_HVAC_T2`
- **Tier 3:** `40.60` → `STRIPE_PRICE_SENSOR_HVAC_T3`

### Bundle - HVAC Pro (Tier 1, 2, 3)
Repeat the same process for **AC Drain Wiz Mini + Sensor Bundle**:
- **Tier 1:** `129.01` → `STRIPE_PRICE_BUNDLE_HVAC_T1`
- **Tier 2:** `117.01` → `STRIPE_PRICE_BUNDLE_HVAC_T2`
- **Tier 3:** `104.41` → `STRIPE_PRICE_BUNDLE_HVAC_T3`

---

## 🎯 STEP 5: Create Prices - Property Manager (Tier 1, 2, 3)

**9 prices total** - 3 tiers × 3 products

### Mini - Property Manager (Tier 1, 2, 3)
For **AC Drain Wiz Mini**:
- **Tier 1:** `64.50` → `STRIPE_PRICE_MINI_PM_T1`
- **Tier 2:** `58.50` → `STRIPE_PRICE_MINI_PM_T2`
- **Tier 3:** `52.20` → `STRIPE_PRICE_MINI_PM_T3`

### Sensor - Property Manager (Tier 1, 2, 3)
For **AC Drain Wiz Sensor**:
- **Tier 1:** `45.15` → `STRIPE_PRICE_SENSOR_PM_T1`
- **Tier 2:** `40.95` → `STRIPE_PRICE_SENSOR_PM_T2`
- **Tier 3:** `36.54` → `STRIPE_PRICE_SENSOR_PM_T3`

### Bundle - Property Manager (Tier 1, 2, 3)
For **AC Drain Wiz Mini + Sensor Bundle**:
- **Tier 1:** `116.11` → `STRIPE_PRICE_BUNDLE_PM_T1`
- **Tier 2:** `105.31` → `STRIPE_PRICE_BUNDLE_PM_T2`
- **Tier 3:** `93.97` → `STRIPE_PRICE_BUNDLE_PM_T3`

---

## 🎯 STEP 6: Add Price IDs to Netlify Environment Variables

1. Go to **Netlify Dashboard** → Your site
2. Navigate to **Site settings** → **Environment variables**
3. Click **"Add a variable"** for each Price ID

### Add These Variables:

```
STRIPE_PRICE_MINI_HOMEOWNER=price_xxxxx
STRIPE_PRICE_SENSOR_HOMEOWNER=price_xxxxx
STRIPE_PRICE_BUNDLE_HOMEOWNER=price_xxxxx

STRIPE_PRICE_MINI_HVAC_T1=price_xxxxx
STRIPE_PRICE_MINI_HVAC_T2=price_xxxxx
STRIPE_PRICE_MINI_HVAC_T3=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T1=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T2=price_xxxxx
STRIPE_PRICE_SENSOR_HVAC_T3=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T1=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T2=price_xxxxx
STRIPE_PRICE_BUNDLE_HVAC_T3=price_xxxxx

STRIPE_PRICE_MINI_PM_T1=price_xxxxx
STRIPE_PRICE_MINI_PM_T2=price_xxxxx
STRIPE_PRICE_MINI_PM_T3=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T1=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T2=price_xxxxx
STRIPE_PRICE_SENSOR_PM_T3=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T1=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T2=price_xxxxx
STRIPE_PRICE_BUNDLE_PM_T3=price_xxxxx
```

**Replace `price_xxxxx` with your actual Price IDs from Stripe**

---

## 🎯 STEP 7: Verify Price IDs Are Loaded

The `get-price-id.js` function already reads from environment variables, so once you add them to Netlify, they should work automatically.

**To verify:**
1. Redeploy your site (or wait for auto-deploy)
2. Test the Price ID lookup function

---

## 📝 QUICK REFERENCE: PRICE MATRIX

| Product | Role | Tier | Price | Env Variable |
|---------|------|------|-------|--------------|
| Mini | Homeowner | MSRP | $99.99 | `STRIPE_PRICE_MINI_HOMEOWNER` |
| Mini | HVAC Pro | Tier 1 | $71.67 | `STRIPE_PRICE_MINI_HVAC_T1` |
| Mini | HVAC Pro | Tier 2 | $65.00 | `STRIPE_PRICE_MINI_HVAC_T2` |
| Mini | HVAC Pro | Tier 3 | $58.00 | `STRIPE_PRICE_MINI_HVAC_T3` |
| Mini | Property Manager | Tier 1 | $64.50 | `STRIPE_PRICE_MINI_PM_T1` |
| Mini | Property Manager | Tier 2 | $58.50 | `STRIPE_PRICE_MINI_PM_T2` |
| Mini | Property Manager | Tier 3 | $52.20 | `STRIPE_PRICE_MINI_PM_T3` |
| Sensor | Homeowner | MSRP | $69.99 | `STRIPE_PRICE_SENSOR_HOMEOWNER` |
| Sensor | HVAC Pro | Tier 1 | $50.17 | `STRIPE_PRICE_SENSOR_HVAC_T1` |
| Sensor | HVAC Pro | Tier 2 | $45.50 | `STRIPE_PRICE_SENSOR_HVAC_T2` |
| Sensor | HVAC Pro | Tier 3 | $40.60 | `STRIPE_PRICE_SENSOR_HVAC_T3` |
| Sensor | Property Manager | Tier 1 | $45.15 | `STRIPE_PRICE_SENSOR_PM_T1` |
| Sensor | Property Manager | Tier 2 | $40.95 | `STRIPE_PRICE_SENSOR_PM_T2` |
| Sensor | Property Manager | Tier 3 | $36.54 | `STRIPE_PRICE_SENSOR_PM_T3` |
| Bundle | Homeowner | MSRP | $179.99 | `STRIPE_PRICE_BUNDLE_HOMEOWNER` |
| Bundle | HVAC Pro | Tier 1 | $129.01 | `STRIPE_PRICE_BUNDLE_HVAC_T1` |
| Bundle | HVAC Pro | Tier 2 | $117.01 | `STRIPE_PRICE_BUNDLE_HVAC_T2` |
| Bundle | HVAC Pro | Tier 3 | $104.41 | `STRIPE_PRICE_BUNDLE_HVAC_T3` |
| Bundle | Property Manager | Tier 1 | $116.11 | `STRIPE_PRICE_BUNDLE_PM_T1` |
| Bundle | Property Manager | Tier 2 | $105.31 | `STRIPE_PRICE_BUNDLE_PM_T2` |
| Bundle | Property Manager | Tier 3 | $93.97 | `STRIPE_PRICE_BUNDLE_PM_T3` |

---

## ✅ CHECKLIST

Use this to track your progress:

### Homeowner (3 prices)
- [ ] Mini - $99.99
- [ ] Sensor - $69.99
- [ ] Bundle - $179.99

### HVAC Pro (9 prices)
- [ ] Mini Tier 1 - $71.67
- [ ] Mini Tier 2 - $65.00
- [ ] Mini Tier 3 - $58.00
- [ ] Sensor Tier 1 - $50.17
- [ ] Sensor Tier 2 - $45.50
- [ ] Sensor Tier 3 - $40.60
- [ ] Bundle Tier 1 - $129.01
- [ ] Bundle Tier 2 - $117.01
- [ ] Bundle Tier 3 - $104.41

### Property Manager (9 prices)
- [ ] Mini Tier 1 - $64.50
- [ ] Mini Tier 2 - $58.50
- [ ] Mini Tier 3 - $52.20
- [ ] Sensor Tier 1 - $45.15
- [ ] Sensor Tier 2 - $40.95
- [ ] Sensor Tier 3 - $36.54
- [ ] Bundle Tier 1 - $116.11
- [ ] Bundle Tier 2 - $105.31
- [ ] Bundle Tier 3 - $93.97

### Environment Variables
- [ ] All 21 Price IDs added to Netlify
- [ ] Site redeployed (or auto-deploy triggered)

---

## 🧪 TESTING

After setup, test these scenarios:

1. **Homeowner checkout:**
   - Product: Mini, Quantity: 1
   - Should return: `STRIPE_PRICE_MINI_HOMEOWNER`

2. **HVAC Pro - Tier 1:**
   - Product: Mini, Quantity: 10
   - Should return: `STRIPE_PRICE_MINI_HVAC_T1`

3. **HVAC Pro - Tier 2:**
   - Product: Mini, Quantity: 50
   - Should return: `STRIPE_PRICE_MINI_HVAC_T2`

4. **HVAC Pro - Tier 3:**
   - Product: Mini, Quantity: 200
   - Should return: `STRIPE_PRICE_MINI_HVAC_T3`

---

## 💡 TIPS

1. **Use Test Mode First:** Create all prices in test mode, test thoroughly, then duplicate to live mode
2. **Keep a Spreadsheet:** Document each Price ID as you create it
3. **Double-Check Prices:** Verify each price matches the pricing table exactly
4. **Name Your Prices:** In Stripe, you can add descriptions to prices for easy identification later

---

## 🚨 COMMON ISSUES

**Issue:** Price ID not found error
- **Solution:** Check that environment variable name matches exactly (case-sensitive)

**Issue:** Wrong price returned
- **Solution:** Verify the Price ID in Stripe matches the price amount

**Issue:** Function not finding Price ID
- **Solution:** Make sure you redeployed after adding environment variables

---

**Ready to start? Begin with Step 1 and work through each step systematically!**

