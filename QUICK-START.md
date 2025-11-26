# Quick Start Guide
## Secure E-Commerce Implementation

This is a condensed guide to get you started quickly. For detailed information, see the other documentation files.

---

## 🚀 GET STARTED IN 5 STEPS

### Step 1: Install Dependencies

```bash
npm install @stripe/stripe-js
cd netlify/functions
npm install stripe
cd ../..
```

### Step 2: Enable Netlify Identity

1. Netlify Dashboard → Your Site → **Identity** → **Enable Identity**
2. Go to **Settings** → **User metadata**
3. Add field: `role` (string)
4. Add field: `company` (string, optional)

### Step 3: Create Stripe Price IDs

1. Go to Stripe Dashboard → **Products**
2. Create 21 Price IDs (see `STRIPE-PRICE-ID-SETUP.md` for exact prices)
3. Copy each Price ID

### Step 4: Set Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**, add:

```
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
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

Also add to your local `.env` file:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Step 5: Add Netlify Identity Widget

Add to `index.html` (before `</body>`):

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/dashboard";
        });
      }
    });
  }
</script>
```

---

## 📁 FILES CREATED

### Core Files
- ✅ `src/config/pricing.ts` - Pricing configuration
- ✅ `src/types/auth.ts` - Auth types
- ✅ `src/contexts/AuthContext.tsx` - Auth context
- ✅ `src/components/auth/ProtectedRoute.tsx` - Route protection
- ✅ `src/components/checkout/StripeCheckout.tsx` - Checkout component
- ✅ `src/pages/HVACProCatalogPage.tsx` - Example pricing page

### Netlify Functions
- ✅ `netlify/functions/get-price-id.js` - Price validation
- ✅ `netlify/functions/create-checkout.js` - Checkout creation
- ✅ `netlify/functions/stripe-webhook.js` - Webhook handler

### Documentation
- ✅ `SECURITY-ARCHITECTURE.md` - Complete security architecture
- ✅ `IMPLEMENTATION-GUIDE.md` - Step-by-step guide
- ✅ `STRIPE-PRICE-ID-SETUP.md` - Price ID creation guide
- ✅ `SECURITY-IMPLEMENTATION-SUMMARY.md` - Summary
- ✅ `QUICK-START.md` - This file

---

## 🔧 NEXT STEPS

1. **Update App.tsx** to wrap with `AuthProvider`
2. **Create routes** for protected pages
3. **Build pricing pages** for each role
4. **Test authentication** flow
5. **Test payment** flow

See `IMPLEMENTATION-GUIDE.md` for detailed steps.

---

## ⚠️ CRITICAL SECURITY NOTES

1. **Never calculate prices on client** - Always use server-side validation
2. **Use Stripe Price IDs** - Never send price amounts
3. **Validate roles server-side** - Don't trust client role claims
4. **Test thoroughly** - Before going to production

---

## 📚 DOCUMENTATION INDEX

1. **QUICK-START.md** - Get started quickly (this file)
2. **SECURITY-ARCHITECTURE.md** - Complete security architecture
3. **IMPLEMENTATION-GUIDE.md** - Detailed implementation steps
4. **STRIPE-PRICE-ID-SETUP.md** - Create all Price IDs
5. **SECURITY-IMPLEMENTATION-SUMMARY.md** - Overview

---

**Ready to implement? Start with Step 1 above, then follow IMPLEMENTATION-GUIDE.md for detailed instructions.**

