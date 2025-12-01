# Stripe Migration - Quick Reference

**Quick checklist of what to provide and what to do**

---

## 🔑 What I Need From You (New Stripe Account)

### 1. API Keys (Required)
```
Secret Key: sk_xxxxx
Publishable Key: pk_xxxxx
```

**Where to find:**
- Stripe Dashboard → Developers → API keys

### 2. Webhook Secret (Required)
```
Webhook Secret: whsec_xxxxx
```

**Where to find:**
- Stripe Dashboard → Developers → Webhooks
- If no webhook exists: We'll create one together

### 3. Account Type
- [ ] Live mode (`sk_live_` / `pk_live_`)
- [ ] Test mode (`sk_test_` / `pk_test_`)

---

## 🛍️ Products: Two Options

### Option A: Create New Products (Recommended)
**Do this if:** New account is empty or you want a clean slate

**Steps:**
1. Create 3 products: Mini, Sensor, Bundle
2. Create 21 Price IDs (see pricing structure below)
3. Send me all 21 Price IDs

### Option B: Use Existing Products
**Do this if:** Products already exist in new account

**Steps:**
1. Check if products exist
2. Verify pricing matches
3. Send me the existing Price IDs

---

## 💰 Pricing Structure Reference

You need **21 Price IDs total:**

### Homeowner (3 Price IDs)
- Mini: $XX.XX
- Sensor: $XX.XX
- Bundle: $XX.XX

### HVAC Pro (9 Price IDs)
- **Tier 1 (1-20 units):**
  - Mini: $XX.XX
  - Sensor: $XX.XX
  - Bundle: $XX.XX

- **Tier 2 (21-100 units):**
  - Mini: $XX.XX
  - Sensor: $XX.XX
  - Bundle: $XX.XX

- **Tier 3 (101-500 units):**
  - Mini: $XX.XX
  - Sensor: $XX.XX
  - Bundle: $XX.XX

### Property Manager (9 Price IDs)
- Same structure as HVAC Pro (3 tiers × 3 products)

---

## 📋 What to Send Me

Copy this template and fill it out:

```
=== NEW STRIPE ACCOUNT DETAILS ===

Secret Key: [share securely - sk_xxxxx]
Publishable Key: pk_xxxxx
Webhook Secret: whsec_xxxxx (or "needs creation")
Account Type: Live / Test

=== PRODUCT STATUS ===

[ ] Creating new products - I'll send Price IDs after creation
[ ] Using existing products - Here are the Price IDs:

=== PRICE IDs (21 total) ===

HOMEOWNER:
- STRIPE_PRICE_MINI_HOMEOWNER=price_xxxxx
- STRIPE_PRICE_SENSOR_HOMEOWNER=price_xxxxx
- STRIPE_PRICE_BUNDLE_HOMEOWNER=price_xxxxx

HVAC PRO TIER 1:
- STRIPE_PRICE_MINI_HVAC_T1=price_xxxxx
- STRIPE_PRICE_SENSOR_HVAC_T1=price_xxxxx
- STRIPE_PRICE_BUNDLE_HVAC_T1=price_xxxxx

HVAC PRO TIER 2:
- STRIPE_PRICE_MINI_HVAC_T2=price_xxxxx
- STRIPE_PRICE_SENSOR_HVAC_T2=price_xxxxx
- STRIPE_PRICE_BUNDLE_HVAC_T2=price_xxxxx

HVAC PRO TIER 3:
- STRIPE_PRICE_MINI_HVAC_T3=price_xxxxx
- STRIPE_PRICE_SENSOR_HVAC_T3=price_xxxxx
- STRIPE_PRICE_BUNDLE_HVAC_T3=price_xxxxx

PROPERTY MANAGER TIER 1:
- STRIPE_PRICE_MINI_PM_T1=price_xxxxx
- STRIPE_PRICE_SENSOR_PM_T1=price_xxxxx
- STRIPE_PRICE_BUNDLE_PM_T1=price_xxxxx

PROPERTY MANAGER TIER 2:
- STRIPE_PRICE_MINI_PM_T2=price_xxxxx
- STRIPE_PRICE_SENSOR_PM_T2=price_xxxxx
- STRIPE_PRICE_BUNDLE_PM_T2=price_xxxxx

PROPERTY MANAGER TIER 3:
- STRIPE_PRICE_MINI_PM_T3=price_xxxxx
- STRIPE_PRICE_SENSOR_PM_T3=price_xxxxx
- STRIPE_PRICE_BUNDLE_PM_T3=price_xxxxx
```

---

## 🗑️ Old Account Recommendation

**My Recommendation:** Keep the old account for 30-60 days, then decide

**Why:**
- Can reference old setup if needed
- Backup/test environment
- No cost to keep (test accounts are free)
- Easy to close later if everything works

**After 30-60 days:**
- If everything works: Close or archive the old account
- If issues arise: Keep it longer for reference

---

## ⚡ Quick Steps

1. **You:** Get API keys from new Stripe account
2. **You:** Create products (or confirm existing ones)
3. **You:** Create 21 Price IDs
4. **You:** Send me all the details (use template above)
5. **Me:** Update Netlify environment variables
6. **Me:** Test payment flow
7. **You:** Test on your end
8. **Together:** Verify everything works

---

## 📚 Full Guide

See `STRIPE-ACCOUNT-MIGRATION-GUIDE.md` for detailed instructions.

---

**Ready?** Start by getting the API keys from the new Stripe account!

