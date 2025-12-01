# Stripe Account Migration Guide

**Purpose:** Switch from your current Stripe test account to the new ACDW production Stripe account

---

## 📋 Pre-Migration Checklist

### Step 1: Export Products from Current Account (Optional)

**Why:** You may want to reference product names, descriptions, and pricing when recreating in the new account.

**How to Export:**

1. **Via Stripe Dashboard:**
   - Go to Stripe Dashboard → Products
   - Manually copy product names, descriptions, and prices
   - Note the Price IDs you created (for reference)

2. **Via Stripe API (More Complete):**
   ```bash
   # Install Stripe CLI if you haven't
   # Then run:
   stripe products list --limit 100 > products-export.json
   stripe prices list --limit 100 > prices-export.json
   ```

**What to Export:**
- Product names (Mini, Sensor, Bundle)
- Product descriptions
- Price amounts for each tier
- Any product images/metadata

---

## 🔑 Information Needed from New Stripe Account

Please provide the following from the **new ACDW Stripe account**:

### 1. API Keys (CRITICAL)

**Where to find:** Stripe Dashboard → Developers → API keys

**What I need:**
- [ ] **Secret Key** (starts with `sk_live_` for production or `sk_test_` for test)
  - Location: Stripe Dashboard → Developers → API keys → Secret key
  - **IMPORTANT:** This is sensitive - share securely (password manager, encrypted message)
  
- [ ] **Publishable Key** (starts with `pk_live_` or `pk_test_`)
  - Location: Stripe Dashboard → Developers → API keys → Publishable key
  - This can be shared publicly (it's safe)

### 2. Webhook Secret (CRITICAL)

**Where to find:** Stripe Dashboard → Developers → Webhooks

**What I need:**
- [ ] **Webhook Signing Secret** (starts with `whsec_`)
  - Location: Stripe Dashboard → Developers → Webhooks → Click on your webhook → Signing secret
  - **Note:** If no webhook exists yet, we'll create one and get the secret

### 3. Account Details (For Reference)

- [ ] Account name/ID
- [ ] Is this a **Live** or **Test** account?
- [ ] Your role/permissions in the account (Admin, Developer, etc.)

---

## 🛍️ Product Recreation Strategy

### Option A: Create New Products (RECOMMENDED)

**Why:** Clean slate, ensures consistency, avoids any conflicts

**Steps:**
1. Create 3 products in new Stripe account:
   - **AC Drain Wiz Mini**
   - **AC Drain Wiz Sensor**
   - **AC Drain Wiz Mini + Sensor Bundle**

2. Create 21 Price IDs (same structure as before):
   - 3 for Homeowner (MSRP)
   - 9 for HVAC Pro (3 tiers × 3 products)
   - 9 for Property Manager (3 tiers × 3 products)

3. Use the same pricing structure:
   - Reference your current Price IDs document (`STRIPE-ENV-VARIABLES.md`)
   - Match the pricing amounts exactly

### Option B: Use Existing Products (If They Exist)

**If the new account already has products:**
- [ ] Check if products already exist
- [ ] Verify product names match (Mini, Sensor, Bundle)
- [ ] Check if prices match your pricing tiers
- [ ] If they match, we can use existing Price IDs
- [ ] If they don't match, create new products (Option A)

---

## 📝 Product Creation Checklist

Use this checklist when creating products in the new Stripe account:

### Product 1: AC Drain Wiz Mini
- [ ] Product name: "AC Drain Wiz Mini"
- [ ] Description: (your product description)
- [ ] Create 7 Price IDs:
  - [ ] Homeowner (MSRP)
  - [ ] HVAC Pro Tier 1 (1-20 units)
  - [ ] HVAC Pro Tier 2 (21-100 units)
  - [ ] HVAC Pro Tier 3 (101-500 units)
  - [ ] Property Manager Tier 1 (1-20 units)
  - [ ] Property Manager Tier 2 (21-100 units)
  - [ ] Property Manager Tier 3 (101-500 units)

### Product 2: AC Drain Wiz Sensor
- [ ] Product name: "AC Drain Wiz Sensor"
- [ ] Description: (your product description)
- [ ] Create 7 Price IDs (same tier structure)

### Product 3: AC Drain Wiz Mini + Sensor Bundle
- [ ] Product name: "AC Drain Wiz Mini + Sensor Bundle"
- [ ] Description: (your product description)
- [ ] Create 7 Price IDs (same tier structure)

**Total:** 3 products, 21 Price IDs

---

## 🔄 Migration Steps

### Phase 1: Gather Information
1. [ ] Export products from old account (optional, for reference)
2. [ ] Get API keys from new account
3. [ ] Get webhook secret (or create webhook)
4. [ ] Verify account type (Live vs Test)

### Phase 2: Create Products in New Account
1. [ ] Create 3 products in new Stripe account
2. [ ] Create 21 Price IDs
3. [ ] Document all Price IDs (create new `STRIPE-ENV-VARIABLES.md`)

### Phase 3: Update Environment Variables
1. [ ] Update `STRIPE_SECRET_KEY` in Netlify
2. [ ] Update `STRIPE_PUBLISHABLE_KEY` in Netlify (if used)
3. [ ] Update `STRIPE_WEBHOOK_SECRET` in Netlify
4. [ ] Update all 21 Price ID environment variables
5. [ ] Verify all variables are set correctly

### Phase 4: Test
1. [ ] Test Price ID lookup
2. [ ] Test checkout session creation
3. [ ] Test webhook handling
4. [ ] Test end-to-end payment flow

### Phase 5: Cleanup (Optional)
1. [ ] Decide on old account (see recommendations below)
2. [ ] Archive or close old account if desired

---

## 📧 What to Send Me

Once you have the information, please provide:

```
NEW STRIPE ACCOUNT DETAILS:
===========================

1. Secret Key: sk_xxxxx (share securely!)
2. Publishable Key: pk_xxxxx
3. Webhook Secret: whsec_xxxxx (or "needs to be created")
4. Account Type: Live / Test
5. Account Name: [account name]

PRODUCT STATUS:
==============

Option A: Creating new products
- [ ] Products need to be created
- [ ] I'll create them and send you the Price IDs

Option B: Using existing products
- [ ] Products already exist
- [ ] Here are the existing Price IDs: [list them]

PRICING REFERENCE:
==================

Please confirm pricing amounts match:
- Homeowner MSRP: $XX.XX
- HVAC Pro Tier 1: $XX.XX
- HVAC Pro Tier 2: $XX.XX
- HVAC Pro Tier 3: $XX.XX
- Property Manager Tier 1: $XX.XX
- Property Manager Tier 2: $XX.XX
- Property Manager Tier 3: $XX.XX
```

---

## 🗑️ Old Account Management Recommendations

### Option 1: Keep Old Account (RECOMMENDED for now)
**Pros:**
- Can reference old Price IDs if needed
- Backup/test environment
- Historical data preserved

**Cons:**
- May cause confusion
- Costs nothing to keep (test accounts are free)

**Recommendation:** Keep it for 30-60 days, then archive/close if everything works

### Option 2: Close Old Account
**Pros:**
- Clean, no confusion
- Forces you to use new account only

**Cons:**
- Lose access to old Price IDs
- Can't reference old setup
- Harder to troubleshoot if issues arise

**Recommendation:** Only close after confirming new account works perfectly (wait 30 days)

### Option 3: Archive/Rename
**Pros:**
- Keep for reference
- Clearly marked as old

**Cons:**
- Still visible in Stripe dashboard

**How to Archive:**
- Rename account to "ACDW - OLD (Archived)"
- Add note: "Migrated to new account on [date]"

---

## ⚠️ Important Notes

1. **Test vs Live:** Make sure you know if the new account is Test or Live mode
   - Test mode: Keys start with `sk_test_` and `pk_test_`
   - Live mode: Keys start with `sk_live_` and `pk_live_`

2. **Webhook Setup:** We'll need to create/configure webhooks in the new account
   - Webhook URL: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
   - Events needed: `checkout.session.completed`, `payment_intent.succeeded`

3. **Environment Variables:** All updates will be in Netlify Dashboard
   - Production environment
   - Deploy previews (if needed)
   - Branch deploys (if needed)

4. **Security:** Never commit API keys to git
   - All keys stay in Netlify environment variables only

---

## 🚀 Next Steps

1. **You:** Gather the information requested above
2. **You:** Create products in new account (or confirm existing ones)
3. **You:** Send me the details
4. **Me:** Update environment variables in Netlify
5. **Me:** Update code if needed
6. **Together:** Test the payment flow
7. **You:** Decide on old account (keep/close/archive)

---

## 📚 Reference Documents

- `STRIPE-ENV-VARIABLES.md` - Current Price ID list
- `STRIPE-PRICE-ID-SETUP.md` - How to create Price IDs
- `PAYMENT-FLOW-TEST-GUIDE.md` - Testing guide

---

**Questions?** Let me know if you need clarification on any step!

