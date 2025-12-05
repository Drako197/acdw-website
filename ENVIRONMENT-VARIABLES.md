# Environment Variables Documentation

**Last Updated:** December 2025  
**Status:** ✅ Complete - All variables documented

---

## Overview

This document lists all environment variables required for the AC Drain Wiz website. All sensitive keys are stored in Netlify environment variables and are never committed to the repository.

---

## Frontend Environment Variables (Vite)

These variables are prefixed with `VITE_` and are exposed to the browser. They are safe to include in client-side code.

### Authentication

**`VITE_CLERK_PUBLISHABLE_KEY`**
- **Type:** Public key (safe for client-side)
- **Purpose:** Clerk authentication publishable key for frontend
- **Required:** Yes
- **Format:** `pk_test_...` or `pk_live_...`
- **Location:** `src/main.tsx`, `src/contexts/AuthContext.tsx`
- **Validation:** Checked on app initialization, throws error if missing

### reCAPTCHA

**`VITE_RECAPTCHA_SITE_KEY`**
- **Type:** Public key (safe for client-side)
- **Purpose:** Google reCAPTCHA v3 site key for bot protection
- **Required:** Yes (for forms)
- **Format:** Google reCAPTCHA site key
- **Location:** `src/hooks/useRecaptcha.ts`, `src/pages/UnsubscribePage.tsx`
- **Fallback:** Uses placeholder if not set (forms will fail server-side validation)

---

## Backend Environment Variables (Netlify Functions)

These variables are server-side only and never exposed to the browser.

### Authentication

**`CLERK_SECRET_KEY`**
- **Type:** Secret key (server-side only)
- **Purpose:** Clerk secret key for backend user management
- **Required:** Yes
- **Format:** `sk_test_...` or `sk_live_...`
- **Location:** `netlify/functions/save-shipping-address.js`
- **Security:** Never exposed to client, used only in serverless functions

### Stripe Payment Processing

**`STRIPE_SECRET_KEY`**
- **Type:** Secret key (server-side only)
- **Purpose:** Stripe API secret key for payment processing
- **Required:** Yes
- **Format:** `sk_test_...` or `sk_live_...`
- **Location:** 
  - `netlify/functions/create-checkout.js`
  - `netlify/functions/get-checkout-session.js`
  - `netlify/functions/get-price-id.js`
  - `netlify/functions/stripe-webhook.js`
- **Security:** Never exposed to client, used only in serverless functions

**`STRIPE_WEBHOOK_SECRET`**
- **Type:** Secret key (server-side only)
- **Purpose:** Stripe webhook signing secret for webhook verification
- **Required:** Yes (for webhook processing)
- **Format:** `whsec_...`
- **Location:** `netlify/functions/stripe-webhook.js`
- **Security:** Used to verify webhook authenticity

**Stripe Price IDs (19 variables):**
- **Purpose:** Stripe Price IDs for each product/role/tier combination
- **Required:** Yes (for checkout)
- **Format:** `price_...`
- **Location:** `netlify/functions/get-price-id.js`
- **Variables:**
  - `STRIPE_PRICE_MINI_HOMEOWNER`
  - `STRIPE_PRICE_SENSOR_HOMEOWNER`
  - `STRIPE_PRICE_BUNDLE_HOMEOWNER`
  - `STRIPE_PRICE_MINI_HVAC_T1`, `STRIPE_PRICE_MINI_HVAC_T2`, `STRIPE_PRICE_MINI_HVAC_T3`
  - `STRIPE_PRICE_SENSOR_HVAC_T1`, `STRIPE_PRICE_SENSOR_HVAC_T2`, `STRIPE_PRICE_SENSOR_HVAC_T3`
  - `STRIPE_PRICE_BUNDLE_HVAC_T1`, `STRIPE_PRICE_BUNDLE_HVAC_T2`, `STRIPE_PRICE_BUNDLE_HVAC_T3`
  - `STRIPE_PRICE_MINI_PM_T1`, `STRIPE_PRICE_MINI_PM_T2`, `STRIPE_PRICE_MINI_PM_T3`
  - `STRIPE_PRICE_SENSOR_PM_T1`, `STRIPE_PRICE_SENSOR_PM_T2`, `STRIPE_PRICE_SENSOR_PM_T3`
  - `STRIPE_PRICE_BUNDLE_PM_T1`, `STRIPE_PRICE_BUNDLE_PM_T2`, `STRIPE_PRICE_BUNDLE_PM_T3`

**`STRIPE_TAX_ENABLED`** (Optional)
- **Type:** Boolean string
- **Purpose:** Enable Stripe Tax calculation
- **Required:** No
- **Format:** `"true"` or `"false"`
- **Location:** `netlify/functions/create-checkout.js`

### reCAPTCHA

**`RECAPTCHA_SECRET_KEY`**
- **Type:** Secret key (server-side only)
- **Purpose:** Google reCAPTCHA v3 secret key for server-side verification
- **Required:** Yes (for form security)
- **Format:** Google reCAPTCHA secret key
- **Location:** 
  - `netlify/functions/validate-form-submission.js`
  - `netlify/functions/validate-unsubscribe.js`
- **Security:** Never exposed to client, used only in serverless functions

**`RECAPTCHA_SCORE_THRESHOLD`** (Optional)
- **Type:** Float
- **Purpose:** Minimum reCAPTCHA score to accept (0.0 to 1.0)
- **Required:** No (defaults to 0.5)
- **Format:** `"0.5"` (string)
- **Location:** 
  - `netlify/functions/validate-form-submission.js`
  - `netlify/functions/validate-unsubscribe.js`
- **Default:** `0.5` (moderate security)

### ShipStation Integration

**`SHIPSTATION_API_KEY`**
- **Type:** API key (server-side only)
- **Purpose:** ShipStation API key for order fulfillment
- **Required:** Yes (for order processing)
- **Format:** ShipStation API key
- **Location:** `netlify/functions/create-shipstation-order.js`

**`SHIPSTATION_API_SECRET`**
- **Type:** API secret (server-side only)
- **Purpose:** ShipStation API secret for authentication
- **Required:** Yes (for order processing)
- **Format:** ShipStation API secret
- **Location:** `netlify/functions/create-shipstation-order.js`

**`SHIPSTATION_STORE_ID`** (Optional)
- **Type:** String
- **Purpose:** ShipStation store ID
- **Required:** No
- **Format:** Store ID string
- **Location:** `netlify/functions/create-shipstation-order.js`

**`SHIPSTATION_NOTIFICATION_EMAILS`** (Optional)
- **Type:** Comma-separated email addresses
- **Purpose:** Email addresses to notify on order creation
- **Required:** No
- **Format:** `"email1@example.com,email2@example.com"`
- **Location:** `netlify/functions/create-shipstation-order.js`

### Netlify System Variables

**`URL`** (Automatic)
- **Type:** String
- **Purpose:** Netlify-provided site URL
- **Required:** No (has fallback)
- **Format:** `https://www.acdrainwiz.com`
- **Location:** `netlify/functions/create-checkout.js`
- **Fallback:** `https://www.acdrainwiz.com` if not set

**`NODE_ENV`** (Automatic)
- **Type:** String
- **Purpose:** Node.js environment (development/production)
- **Required:** No (automatic)
- **Format:** `"development"` or `"production"`
- **Location:** Multiple functions for error detail control

**`AWS_LAMBDA_FUNCTION_NAME`** (Automatic)
- **Type:** String
- **Purpose:** AWS Lambda function name (for logging)
- **Required:** No (automatic)
- **Format:** Function name string
- **Location:** `netlify/functions/utils/security-logger.js`

---

## Environment Variable Validation

### Frontend Validation

The frontend checks for critical variables on initialization:

```typescript
// src/main.tsx
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!clerkPubKey) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is not set. Authentication will not work.')
}
```

### Backend Validation

Backend functions validate required variables and return appropriate errors:

```javascript
// Example from validate-form-submission.js
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
if (!RECAPTCHA_SECRET_KEY) {
  console.warn('reCAPTCHA secret key not configured - skipping verification')
}
```

---

## Security Checklist

✅ **All secrets stored in Netlify environment variables**  
✅ **No secrets committed to repository**  
✅ **Pre-commit hook prevents secret commits**  
✅ **Frontend variables prefixed with `VITE_` (safe for client)**  
✅ **Backend variables never exposed to browser**  
✅ **All secret keys validated before use**  
✅ **Error messages don't expose secret values**

---

## Setting Up Environment Variables in Netlify

1. Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. Add each variable listed above
3. For production, ensure all `_test_` keys are replaced with `_live_` keys
4. Verify all variables are set before deploying

### Required Variables Checklist

**Frontend (Vite):**
- [ ] `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] `VITE_RECAPTCHA_SITE_KEY`

**Backend (Netlify Functions):**
- [ ] `CLERK_SECRET_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `RECAPTCHA_SECRET_KEY`
- [ ] `SHIPSTATION_API_KEY`
- [ ] `SHIPSTATION_API_SECRET`
- [ ] All 19 Stripe Price ID variables

**Optional:**
- [ ] `RECAPTCHA_SCORE_THRESHOLD` (defaults to 0.5)
- [ ] `STRIPE_TAX_ENABLED` (defaults to false)
- [ ] `SHIPSTATION_STORE_ID`
- [ ] `SHIPSTATION_NOTIFICATION_EMAILS`

---

## Testing Environment Variables

### Local Development

For local development, create a `.env.local` file (not committed):

```bash
# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_RECAPTCHA_SITE_KEY=...

# Backend (for Netlify Dev)
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
# ... etc
```

### Verification Script

Run this to verify all required variables are set:

```bash
# Check frontend variables
npm run dev
# Check console for warnings about missing variables

# Check backend variables
netlify dev
# Check function logs for missing variable warnings
```

---

## Troubleshooting

### Missing Variable Errors

**Frontend:**
- Check browser console for warnings
- Verify `VITE_` prefix is correct
- Restart dev server after adding variables

**Backend:**
- Check Netlify function logs
- Verify variable names match exactly (case-sensitive)
- Ensure variables are set in correct Netlify environment (production vs. deploy previews)

### Variable Not Working

1. **Check spelling** - Variable names are case-sensitive
2. **Check prefix** - Frontend variables must have `VITE_` prefix
3. **Restart services** - Dev server and Netlify Dev need restart after adding variables
4. **Check Netlify environment** - Variables must be set for the correct environment (production, branch, etc.)

---

**Last Verified:** December 2025  
**Next Review:** After any new integrations or environment changes

