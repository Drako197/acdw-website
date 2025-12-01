# Environment Variable Migration Plan

**Goal:** Safely update all Stripe Price ID environment variables from old account to new account

---

## 📋 Current Situation

- You have existing Price ID variables from the old Stripe account
- You need to update them with new Price IDs from the new account
- Variable names are the same, just the values (Price IDs) change

---

## 🎯 Recommended Approach: Update in Place

**Why:** Variable names are identical, so we can update them directly. This is safer than deleting and recreating.

### Option A: Netlify CLI (Recommended - Fastest)

**Advantages:**
- Fast (can do all at once)
- Scripted (less error-prone)
- Can verify each update

**Steps:**

1. **First, let's check what you currently have:**
   ```bash
   netlify env:list
   ```
   This shows all current environment variables.

2. **Update all Price IDs using the script:**
   ```bash
   ./add-all-price-ids.sh
   ```
   This will update all 19 Price ID variables.

3. **Verify the updates:**
   ```bash
   netlify env:list | grep STRIPE_PRICE
   ```
   This shows all Stripe Price variables to verify they're updated.

### Option B: Netlify Dashboard (Visual - Safer for Verification)

**Advantages:**
- Visual confirmation
- Can see old vs new values
- Can update one at a time

**Steps:**

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com
   - Select your site
   - Site settings → Environment variables

2. **For each variable:**
   - Find the old Price ID variable (e.g., `STRIPE_PRICE_MINI_HOMEOWNER`)
   - Click "Edit" or the variable name
   - Replace the old Price ID with the new one
   - Click "Save"
   - Repeat for all 19 variables

3. **Reference:** Use `STRIPE-PRICE-IDS-NEW-ACCOUNT.md` for the new values

---

## ⚠️ Important Considerations

### 1. Don't Delete Old Variables First

**Why:** If you delete them before adding new ones, the site will break during the gap.

**Better:** Update them in place (same variable name, new value).

### 2. Update All at Once

**Why:** Price IDs work together. If some are old and some are new, you'll get mismatches.

**Better:** Update all 19 Price ID variables, then redeploy.

### 3. Keep Other Stripe Variables

**Don't touch:**
- `STRIPE_SECRET_KEY` (already updated)
- `STRIPE_PUBLISHABLE_KEY` (already updated)
- `STRIPE_WEBHOOK_SECRET` (already updated)

**Only update:**
- All `STRIPE_PRICE_*` variables (19 total)

---

## 📝 Step-by-Step: Netlify CLI Method

### Step 1: Check Current Variables

```bash
netlify env:list
```

**What to look for:**
- Count how many `STRIPE_PRICE_*` variables you have
- Note any that might be missing
- Verify you have the 3 main Stripe keys

### Step 2: Run the Update Script

```bash
./add-all-price-ids.sh
```

**What it does:**
- Updates all 19 Price ID variables
- Uses `netlify env:set` which updates if exists, creates if not

### Step 3: Verify Updates

```bash
netlify env:list | grep STRIPE_PRICE
```

**What to check:**
- All 19 variables are listed
- Values start with `price_1SZ...` (new account format)
- No old Price IDs remain

### Step 4: Redeploy

- Go to Netlify Dashboard
- Trigger a new deploy
- Or: Make a small commit and push

---

## 📝 Step-by-Step: Netlify Dashboard Method

### Step 1: Open Environment Variables

1. Go to https://app.netlify.com
2. Select your site
3. Click **Site settings**
4. Click **Environment variables** (in left sidebar)

### Step 2: Update Each Variable

**For each of the 19 Price ID variables:**

1. Find the variable (e.g., `STRIPE_PRICE_MINI_HOMEOWNER`)
2. Click on it (or click "Edit")
3. Replace the old Price ID with the new one
4. Click "Save" or "Update"
5. Move to the next variable

**Reference list (from `STRIPE-PRICE-IDS-NEW-ACCOUNT.md`):**

```
STRIPE_PRICE_MINI_HOMEOWNER → price_1SZe5X60dq6nGBAfwo2hsNxK

STRIPE_PRICE_MINI_HVAC_T1 → price_1SZebe60dq6nGBAfutAtD9re
STRIPE_PRICE_MINI_HVAC_T2 → price_1SZeiH60dq6nGBAf2o2ypICU
STRIPE_PRICE_MINI_HVAC_T3 → price_1SZekg60dq6nGBAfTQ8c630l

STRIPE_PRICE_SENSOR_HVAC_T1 → price_1SZenc60dq6nGBAfvTu9zjFI
STRIPE_PRICE_SENSOR_HVAC_T2 → price_1SZf1t60dq6nGBAfe36Q57Bp
STRIPE_PRICE_SENSOR_HVAC_T3 → price_1SZf5i60dq6nGBAfa1p0ruWp

STRIPE_PRICE_BUNDLE_HVAC_T1 → price_1SZf9f60dq6nGBAfmqSXnqbY
STRIPE_PRICE_BUNDLE_HVAC_T2 → price_1SZfAh60dq6nGBAfAsho4TuM
STRIPE_PRICE_BUNDLE_HVAC_T3 → price_1SZfD360dq6nGBAfwElA3YTM

STRIPE_PRICE_MINI_PM_T1 → price_1SZfHZ60dq6nGBAfVcHud4Fa
STRIPE_PRICE_MINI_PM_T2 → price_1SZfJH60dq6nGBAfgPDGJLVs
STRIPE_PRICE_MINI_PM_T3 → price_1SZfLW60dq6nGBAf7vNkpTVd

STRIPE_PRICE_SENSOR_PM_T1 → price_1SZfMZ60dq6nGBAfglTItYiC
STRIPE_PRICE_SENSOR_PM_T2 → price_1SZfNQ60dq6nGBAf3ULHuQf5
STRIPE_PRICE_SENSOR_PM_T3 → price_1SZfUL60dq6nGBAfVIhk1Q4F

STRIPE_PRICE_BUNDLE_PM_T1 → price_1SZfVA60dq6nGBAfPahshH8Z
STRIPE_PRICE_BUNDLE_PM_T2 → price_1SZfWA60dq6nGBAf2qwsKsgi
STRIPE_PRICE_BUNDLE_PM_T3 → price_1SZfWm60dq6nGBAfDDdadlnM
```

### Step 3: Verify All Updated

- Scroll through the list
- Check that all 19 Price ID variables have new values
- Verify no old Price IDs remain

### Step 4: Redeploy

- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**
- Wait for deployment to complete

---

## 🔍 Verification Checklist

After updating, verify:

- [ ] All 19 Price ID variables are updated
- [ ] All new Price IDs start with `price_1SZ...` (new account)
- [ ] No old Price IDs remain (old ones started with `price_1SXa...`)
- [ ] Other Stripe variables unchanged (`STRIPE_SECRET_KEY`, etc.)
- [ ] Site redeployed successfully
- [ ] No errors in Netlify function logs

---

## 🚨 If Something Goes Wrong

### Rollback Plan

If you need to revert:

1. **Via Netlify Dashboard:**
   - Go to Environment variables
   - Edit each variable back to old Price ID
   - Redeploy

2. **Via Netlify CLI:**
   - Use the old Price IDs from `STRIPE-ENV-VARIABLES.md`
   - Run `netlify env:set` for each

### Test Before Going Live

- Test in a deploy preview first (if possible)
- Or test on production with test cards only
- Verify webhook receives events correctly

---

## 💡 My Recommendation

**Use Option A (Netlify CLI) because:**
1. ✅ Fastest (all 19 variables in one script)
2. ✅ Less error-prone (script handles it)
3. ✅ Can verify with `netlify env:list`
4. ✅ Easy to rollback if needed

**Steps:**
1. Run `netlify env:list` to see current state
2. Run `./add-all-price-ids.sh` to update all
3. Run `netlify env:list | grep STRIPE_PRICE` to verify
4. Redeploy site
5. Test payment flow

---

**Ready?** Let's start by checking what you currently have!

