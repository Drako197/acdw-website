# Shipping Address Collection & Zone-Based Shipping Setup

This guide explains how shipping address collection and zone-based shipping costs are implemented in the checkout flow.

---

## How It Works

### 1. Shipping Address Collection

**In Code (`create-checkout.js`):**
```javascript
shipping_address_collection: {
  allowed_countries: ['US', 'CA'], // US and Canada only
}
```

**What This Does:**
- Stripe Checkout automatically shows a shipping address form
- Customer must provide their shipping address before completing payment
- Only US and Canada addresses are accepted
- Address is validated by Stripe

**No Dashboard Configuration Needed:**
- This is enabled entirely in code
- No setup required in Stripe Dashboard
- Works automatically when checkout session is created

---

### 2. Zone-Based Shipping Costs

**Current Implementation:**
- Two shipping options are provided:
  - **US Shipping:** $15.00 (5-7 business days)
  - **Canada Shipping:** $20.00 (7-14 business days)

**How It Works:**
- Both options are shown to the customer
- Customer selects the appropriate option based on their address
- Stripe automatically calculates the total including shipping
- Shipping cost is added to the order total

**Location in Code:**
- `netlify/functions/create-checkout.js` - `shipping_options` array
- Rates are defined inline (no Dashboard setup needed)

---

## Shipping Rates Configuration

### Current Rates (in `create-checkout.js`):

```javascript
shipping_options: [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 1500, // $15.00 in cents for US
        currency: 'usd',
      },
      display_name: 'Standard Shipping (US)',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 5 },
        maximum: { unit: 'business_day', value: 7 },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 2000, // $20.00 in cents for Canada
        currency: 'usd',
      },
      display_name: 'Standard Shipping (Canada)',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 7 },
        maximum: { unit: 'business_day', value: 14 },
      },
    },
  },
]
```

### To Change Shipping Rates:

1. Edit `netlify/functions/create-checkout.js`
2. Update the `amount` values (in cents):
   - US: `1500` = $15.00
   - Canada: `2000` = $20.00
3. Update delivery estimates if needed
4. Redeploy your site

---

## Success Page Display

The checkout success page now displays:
- Order ID
- Total amount (including shipping)
- Shipping address (if provided)

**New Function:** `get-checkout-session.js`
- Retrieves checkout session details from Stripe
- Includes shipping address and order totals
- Called automatically on success page load

---

## Testing

### Test Shipping Address Collection:

1. Go through checkout flow
2. You should see a "Shipping address" section in Stripe Checkout
3. Enter a US or Canada address
4. Select shipping option
5. Complete payment
6. Verify shipping address appears on success page

### Test Different Zones:

**US Address:**
- Use a US address (e.g., 123 Main St, New York, NY 10001)
- Should see "Standard Shipping (US)" option at $15.00

**Canada Address:**
- Use a Canada address (e.g., 123 Main St, Toronto, ON M5H 2N2)
- Should see "Standard Shipping (Canada)" option at $20.00

---

## Future Enhancements

### Option 1: Automatic Zone Selection
- Create shipping rates in Stripe Dashboard with country restrictions
- Stripe will automatically show only the relevant option
- Requires creating shipping rates in Dashboard first

### Option 2: Weight-Based Shipping
- Calculate shipping based on product weight × quantity
- More accurate for larger orders
- Requires product weight data (already in `src/config/products.ts`)

### Option 3: Free Shipping Threshold
- Offer free shipping for orders over a certain amount
- Can be added as conditional logic in checkout

---

## Files Modified

1. **`netlify/functions/create-checkout.js`**
   - Added `shipping_address_collection`
   - Added `shipping_options` with zone-based rates

2. **`netlify/functions/get-checkout-session.js`** (NEW)
   - Retrieves checkout session details
   - Includes shipping address

3. **`src/pages/CheckoutSuccessPage.tsx`**
   - Fetches and displays order details
   - Shows shipping address

4. **`src/config/shipping.ts`** (NEW)
   - Shipping rate configuration
   - Zone definitions

5. **`src/config/products.ts`** (NEW)
   - Product weight data
   - For future weight-based shipping

6. **`src/index.css`**
   - Styles for shipping info display

---

## Next Steps: Adding Stripe Tax

Once shipping is tested and working, we can enable automatic tax calculation:

1. Uncomment in `create-checkout.js`:
   ```javascript
   automatic_tax: { enabled: true },
   ```

2. Stripe Tax will automatically:
   - Calculate taxes based on shipping address
   - Add tax to order total
   - Handle tax-exempt scenarios (if configured)

3. Tax will appear in checkout and on success page automatically

---

**Shipping address collection is now enabled and ready to test!**

