# Implementation Guide
## Secure E-Commerce System for AC Drain Wiz

This guide provides step-by-step instructions for implementing the secure, role-based e-commerce system.

---

## PHASE 1: SETUP & CONFIGURATION

### Step 1.1: Enable Netlify Identity

1. **In Netlify Dashboard:**
   - Go to your site → **Identity** → **Enable Identity**
   - Enable **Email** as the only signup method
   - Configure email templates (optional)

2. **Configure User Roles:**
   - Go to **Identity** → **Settings** → **User metadata**
   - Add custom field: `role` (string)
   - Add custom field: `company` (string, optional)

3. **Enable External Providers (Optional):**
   - If you want Google/GitHub login, enable them here
   - For MVP, email-only is recommended

### Step 1.2: Add Netlify Identity Widget to Site

Add to `index.html` (before closing `</body>`):

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

### Step 1.3: Set Up Stripe Account

1. **Create Stripe Account:**
   - Go to https://stripe.com
   - Complete account setup
   - Get your API keys (Publishable Key and Secret Key)

2. **Create Price IDs:**
   - For each product/role/tier combination, create a Price in Stripe
   - Use the pricing table from `pricing.ts`
   - Note down each Price ID (starts with `price_`)

3. **Set Up Webhook:**
   - In Stripe Dashboard → **Developers** → **Webhooks**
   - Add endpoint: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret

### Step 1.4: Configure Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**, add:

```
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx (or sk_test_xxxxx for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx (or pk_test_xxxxx for testing)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (replace with your actual Price IDs)
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

---

## PHASE 2: INSTALL DEPENDENCIES

### Step 2.1: Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### Step 2.2: Install Netlify Functions Dependencies

Create `netlify/functions/package.json`:

```json
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

---

## PHASE 3: IMPLEMENT AUTHENTICATION

### Step 3.1: Update App.tsx to Include AuthProvider

```typescript
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </AuthProvider>
  )
}
```

### Step 3.2: Create Login/Signup Pages

See existing `SignInPage.tsx` and `SignUpPage.tsx` - update them to use `useAuth()` hook.

### Step 3.3: Create Role-Based Dashboard Redirect

```typescript
// src/pages/DashboardPage.tsx
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on role
  if (user.role === 'hvac_pro') {
    return <Navigate to="/business/pro/catalog" replace />
  }

  if (user.role === 'property_manager') {
    return <Navigate to="/business/pm/catalog" replace />
  }

  // Homeowner dashboard
  return <Navigate to="/product/mini" replace />
}
```

---

## PHASE 4: CREATE PRICING PAGES

### Step 4.1: HVAC Pro Catalog Page

Create `src/pages/HVACProCatalogPage.tsx`:

```typescript
import { useAuth } from '../contexts/AuthContext'
import { getProductPricingTable, calculateTier } from '../config/pricing'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export function HVACProCatalogPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute requiredRole="hvac_pro">
      <div className="container py-16">
        <h1>HVAC Pro Catalog</h1>
        <p>Logged in as: {user?.email}</p>
        
        {/* Product cards with pricing tables */}
        {/* Use getProductPricingTable() to display prices */}
      </div>
    </ProtectedRoute>
  )
}
```

### Step 4.2: Property Manager Catalog Page

Similar structure but with PM pricing and "Request Demo" CTA.

---

## PHASE 5: STRIPE CHECKOUT INTEGRATION

### Step 5.1: Create Checkout Component

```typescript
// src/components/checkout/StripeCheckout.tsx
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../../contexts/AuthContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export function StripeCheckout({ product, quantity }: { product: string, quantity: number }) {
  const { user } = useAuth()

  const handleCheckout = async () => {
    // 1. Get Price ID from server
    const priceResponse = await fetch('/.netlify/functions/get-price-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        quantity,
        role: user?.role,
      }),
    })

    const { priceId } = await priceResponse.json()

    // 2. Create Checkout Session
    const checkoutResponse = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        quantity,
        product,
        userEmail: user?.email,
        userId: user?.id,
      }),
    })

    const { url } = await checkoutResponse.json()

    // 3. Redirect to Stripe Checkout
    window.location.href = url
  }

  return (
    <button onClick={handleCheckout}>
      Checkout
    </button>
  )
}
```

---

## PHASE 6: SECURITY HARDENING

### Step 6.1: Update netlify.toml

Add security headers (already partially done, enhance):

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.netlify.app"
```

### Step 6.2: Add Rate Limiting

Use Netlify's built-in rate limiting or add to functions.

---

## PHASE 7: TESTING

### Test Checklist:

- [ ] User can sign up with role
- [ ] User can login
- [ ] Protected routes redirect if not authenticated
- [ ] Role-based access works (Pro can't see PM pages)
- [ ] Pricing displays correctly per role
- [ ] Quantity tier calculation works
- [ ] Stripe Price ID lookup works
- [ ] Checkout session creation works
- [ ] Payment flow completes
- [ ] Webhook receives events
- [ ] Security headers are present
- [ ] No price manipulation possible

---

## NEXT STEPS

1. Review this guide
2. Set up Netlify Identity
3. Create Stripe Price IDs
4. Configure environment variables
5. Begin Phase 1 implementation
6. Test each phase before moving to next

---

**Questions or issues? Refer to SECURITY-ARCHITECTURE.md for detailed security considerations.**

