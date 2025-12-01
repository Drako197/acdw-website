# Stripe Webhook Setup - Step-by-Step Guide

**Current Step:** Selecting events in Stripe Dashboard

---

## Step 1: Account Selection ✅

**What you see:** Two cards - "Your account" and "Connected and v2 accounts"

**What to choose:**
- ✅ **"Your account"** (already selected - this is correct!)
- ❌ Don't select "Connected and v2 accounts" (unless you're using Stripe Connect)

**Why:** We're receiving events from your main Stripe account, not connected accounts.

---

## Step 2: API Version

**What you see:** Dropdown showing "2023-10-16"

**What to do:**
- ✅ **Keep the default** (2023-10-16 or latest available)
- The API version is fine - Stripe will use a compatible version

**Note:** You can leave this as-is. Stripe will handle compatibility.

---

## Step 3: Select Events (IMPORTANT)

**What you see:** 
- Two tabs: "All events" (active) and "Selected events" (0)
- Search bar: "Find event by name or description..."
- Event list with categories

**What to do:**

### Option A: Search for Specific Events (RECOMMENDED)

1. **Click in the search bar** (magnifying glass icon)
2. **Search for each event one by one:**

   **Event 1:**
   - Type: `checkout.session.completed`
   - Click on it when it appears
   - ✅ It will move to "Selected events" tab

   **Event 2:**
   - Type: `payment_intent.succeeded`
   - Click on it when it appears
   - ✅ It will move to "Selected events" tab

   **Event 3:**
   - Type: `payment_intent.payment_failed`
   - Click on it when it appears
   - ✅ It will move to "Selected events" tab

3. **Verify:** Click the "Selected events" tab
   - You should see 3 events selected
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### Option B: Browse Categories

1. **Expand the "Checkout Session" category:**
   - Look for "Checkout Session" in the list
   - Click the arrow to expand
   - Find `checkout.session.completed`
   - ✅ Check the box next to it

2. **Expand the "Payment Intent" category:**
   - Look for "Payment Intent" in the list
   - Click the arrow to expand
   - Find `payment_intent.succeeded`
   - ✅ Check the box next to it
   - Find `payment_intent.payment_failed`
   - ✅ Check the box next to it

3. **Verify:** Click the "Selected events" tab
   - You should see 3 events selected

---

## Step 4: Continue

**What you see:** "Continue →" button at the bottom right

**What to do:**
- ✅ **Click "Continue →"** once you have 3 events selected
- This will take you to the next step (destination configuration)

---

## Step 5: Configure Destination (Next Screen)

After clicking "Continue", you'll see a new screen. Here's what to do:

### Destination Type:
- ✅ Select **"API endpoint"** or **"Webhook endpoint"**
- This is the standard webhook option

### Endpoint URL:
- Enter: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
- ✅ Make sure it's exactly this URL (no trailing slash)

### Description (Optional):
- You can add: "ACDW Website - Payment Webhooks"

### Click "Add endpoint" or "Create"

---

## Step 6: Get Webhook Secret

After creating the webhook:

1. **You'll see the webhook in the list**
2. **Click on the webhook** to view details
3. **Find "Signing secret"** section
4. **Click "Reveal"** or **"Click to reveal"**
5. **Copy the secret** (starts with `whsec_`)
   - Example: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**⚠️ IMPORTANT:** Save this secret - you'll need it for Netlify!

---

## Step 7: Add Webhook Secret to Netlify

Once you have the webhook secret:

### Option A: Netlify Dashboard
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add/Update: `STRIPE_WEBHOOK_SECRET`
5. Value: `whsec_xxxxx` (paste your secret)

### Option B: Netlify CLI
```bash
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_xxxxx"
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Webhook created in Stripe Dashboard
- [ ] Endpoint URL is correct: `https://www.acdrainwiz.com/.netlify/functions/stripe-webhook`
- [ ] 3 events are selected:
  - [ ] `checkout.session.completed`
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Webhook secret copied (`whsec_xxxxx`)
- [ ] Webhook secret added to Netlify environment variables
- [ ] Site redeployed (to pick up new environment variable)

---

## 🧪 Testing the Webhook

After setup, you can test:

1. **Make a test purchase** on your site
2. **Go to Stripe Dashboard** → **Developers** → **Webhooks**
3. **Click on your webhook**
4. **View "Recent deliveries"**
5. **You should see events** when payments are made

---

## ❓ Troubleshooting

**Webhook not receiving events?**
- Check endpoint URL is correct
- Verify webhook secret is set in Netlify
- Check Netlify function logs
- Make sure site is deployed

**Events not showing up?**
- Verify events are selected in webhook settings
- Check webhook is enabled (not disabled)
- Test with a new payment

---

## 📝 Summary

**Events to select:**
1. `checkout.session.completed` - When checkout is completed
2. `payment_intent.succeeded` - When payment succeeds
3. `payment_intent.payment_failed` - When payment fails

**Endpoint URL:**
```
https://www.acdrainwiz.com/.netlify/functions/stripe-webhook
```

**Next:** After creating webhook, get the signing secret and add it to Netlify!

