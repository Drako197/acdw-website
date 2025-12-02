# Purchase Flow Security & Guest Checkout Rules

## Product Purchase Rules

### ✅ **ACDW Mini** - Guest Checkout Allowed
- **Who can purchase:** Anyone (homeowners, guests, contractors)
- **Guest checkout:** ✅ Enabled
- **Pricing:** MSRP ($99.99) for guests/homeowners
- **Flow:**
  1. Guest can click "Buy Now - Guest Checkout"
  2. Complete Stripe Checkout without login
  3. After purchase → Account creation offer with pre-filled email
  4. Optional: Create account for order tracking

**Why:** Mini is the homeowner product, publicly available at MSRP.

---

### 🔒 **ACDW Sensor** - Authentication Required
- **Who can purchase:** Verified HVAC Pros and Property Managers only
- **Guest checkout:** ❌ Disabled
- **Pricing:** Contractor pricing (tiered, sensitive)
- **Flow:**
  1. Must sign in/create account first
  2. Must have `hvac_pro` or `property_manager` role
  3. Access via protected catalog pages
  4. Cannot purchase as guest

**Why:** Sensitive contractor pricing must not be visible to homeowners.

---

### 🔒 **Mini + Sensor Bundle** - Authentication Required
- **Who can purchase:** Verified HVAC Pros and Property Managers only
- **Guest checkout:** ❌ Disabled
- **Pricing:** Contractor pricing (tiered, sensitive)
- **Flow:**
  1. Must sign in/create account first
  2. Must have `hvac_pro` or `property_manager` role
  3. Access via protected catalog pages
  4. Cannot purchase as guest

**Why:** Sensitive contractor pricing must not be visible to homeowners.

---

## Security Implementation

### Client-Side Protection
- `StripeCheckout` component checks `allowGuestCheckout` prop
- For Sensor/Bundle: Shows error if guest tries to checkout
- Error message: "Please sign in to purchase this product. Contractor pricing requires authentication."

### Server-Side Protection
- `get-price-id.js` validates product and role
- Rejects Sensor/Bundle requests without authentication (403 error)
- Error: "Authentication required. Sensor and Bundle products are only available to verified contractors."

### Route Protection
- `HVACProCatalogPage`: Protected with `requiredRole="hvac_pro"`
- `PropertyManagerCatalogPage`: Protected with `requiredRole="property_manager"`
- Unauthenticated users redirected to sign-in

---

## User Flows

### Homeowner/Guest Flow (Mini Only)
```
1. Visit /products/mini
2. See "Buy Now - Guest Checkout" button
3. Click → Stripe Checkout (no login)
4. Complete purchase
5. Success page → Account creation offer
6. Optional: Create account with pre-filled email
```

### Contractor Flow (All Products)
```
1. Sign in as HVAC Pro
2. Access /business/pro/catalog
3. Select product (Mini, Sensor, or Bundle)
4. Choose quantity
5. Click "Proceed to Checkout"
6. Complete Stripe Checkout
7. Success page → Order linked to account
```

---

## Testing Checklist

### ✅ Mini Guest Checkout
- [ ] Visit `/products/mini` as guest
- [ ] See "Buy Now - Guest Checkout" button
- [ ] Complete checkout without login
- [ ] See account creation offer on success page
- [ ] Email pre-filled in signup form

### 🔒 Sensor/Bundle Protection
- [ ] Try to access Sensor as guest → Redirected to sign-in
- [ ] Try to access Bundle as guest → Redirected to sign-in
- [ ] Try to checkout Sensor without login → Error shown
- [ ] Try to checkout Bundle without login → Error shown
- [ ] Server rejects Sensor/Bundle requests without role (403)

---

## Configuration

### StripeCheckout Component Usage

**Mini (Guest Allowed):**
```tsx
<StripeCheckout
  product="mini"
  quantity={quantity}
  allowGuestCheckout={true} // ✅ Allows guest checkout
/>
```

**Sensor/Bundle (Auth Required):**
```tsx
<StripeCheckout
  product="sensor" // or "bundle"
  quantity={quantity}
  allowGuestCheckout={false} // 🔒 Requires authentication
/>
```

---

## Summary

- **Mini:** Public product, guest checkout enabled, MSRP pricing
- **Sensor:** Contractor-only, authentication required, sensitive pricing
- **Bundle:** Contractor-only, authentication required, sensitive pricing

This ensures:
1. Homeowners can easily purchase Mini without barriers
2. Contractor pricing remains protected and confidential
3. Clear separation between public and professional products

