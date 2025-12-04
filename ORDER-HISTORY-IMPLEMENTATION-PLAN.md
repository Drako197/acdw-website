# Order History Implementation Plan

## Current State

### What Exists:
- ✅ Order history UI in dashboard (empty state and populated state designs)
- ✅ Stripe checkout sessions include `userId` in metadata when user is logged in
- ✅ Stripe webhook receives `checkout.session.completed` events
- ✅ Order data is available in webhook (session ID, items, total, shipping, etc.)

### What's Missing:
- ❌ Orders are not saved to customer accounts
- ❌ No function to fetch orders for a user
- ❌ Dashboard shows empty state (no live data)
- ❌ Guest orders are not linked to accounts

---

## Implementation Approach

### Option 1: Store Orders in Clerk Metadata (Recommended for MVP)

**Pros:**
- No additional database needed
- Simple implementation
- Works with existing Clerk setup
- Fast to implement

**Cons:**
- Clerk metadata has size limits (may need pagination for many orders)
- Less flexible for complex queries
- May need migration to database later

**Implementation:**
1. When payment succeeds (webhook), save order to Clerk user's `unsafeMetadata.orders` array
2. Create Netlify function to fetch orders for a user
3. Display orders in dashboard

### Option 2: External Database (Recommended for Scale)

**Pros:**
- No size limits
- Better for complex queries
- Can handle analytics
- More flexible

**Cons:**
- Requires database setup (Supabase, MongoDB, etc.)
- More complex implementation
- Additional cost

**Implementation:**
1. Set up database (Supabase recommended - free tier available)
2. Create orders table
3. Save orders to database in webhook
4. Create Netlify function to fetch orders
5. Display orders in dashboard

### Option 3: Hybrid (Stripe as Source of Truth)

**Pros:**
- No additional storage needed
- Stripe already has all order data
- Always up-to-date

**Cons:**
- Requires Stripe API calls (rate limits)
- Slower than local storage
- More complex queries

**Implementation:**
1. Store Stripe customer ID in Clerk metadata
2. Fetch orders from Stripe API when dashboard loads
3. Cache results if needed

---

## Recommended Approach: Option 1 (Clerk Metadata) for MVP

### Step 1: Update Stripe Webhook to Save Orders

**File:** `netlify/functions/stripe-webhook.js`

When `checkout.session.completed`:
1. Extract `userId` from session metadata
2. If `userId` exists (authenticated user):
   - Fetch user from Clerk
   - Add order to `unsafeMetadata.orders` array
   - Update Clerk user metadata
3. If no `userId` (guest):
   - Store order with email for later linking
   - When user creates account, link orders by email

**Order Data Structure:**
```javascript
{
  orderId: session.id,
  orderNumber: session.id.substring(0, 20), // Shortened for display
  date: new Date().toISOString(),
  items: [
    {
      name: 'AC Drain Wiz Mini',
      quantity: 1,
      price: 99.99,
      sku: 'ACDW-MINI-HOMEOWNER'
    }
  ],
  subtotal: 99.99,
  tax: 0,
  shipping: 15.00,
  total: 114.99,
  status: 'awaiting_shipment', // or 'shipped', 'delivered'
  shippingAddress: { ... },
  trackingNumber: null // Updated when shipped
}
```

### Step 2: Create Function to Fetch Orders

**File:** `netlify/functions/get-user-orders.js`

- Receives Clerk user ID
- Fetches user from Clerk
- Returns `unsafeMetadata.orders` array
- Sorts by date (newest first)

### Step 3: Update Dashboard to Display Orders

**File:** `src/pages/DashboardPage.tsx`

- Fetch orders on component mount
- Replace `HAS_ORDERS` flag with actual data
- Display orders in order history section
- Show empty state if no orders

### Step 4: Handle Guest Order Linking

**File:** `netlify/functions/link-guest-orders.js` (or in signup flow)

When user creates account:
1. Check if email has any guest orders
2. Link those orders to new account
3. Update Clerk metadata

---

## Implementation Details

### Clerk Metadata Structure

```typescript
unsafeMetadata: {
  role: 'homeowner' | 'hvac_pro' | 'property_manager',
  company: string,
  verification: { ... },
  orders: [
    {
      orderId: string,
      orderNumber: string,
      date: string,
      items: Array<{ name, quantity, price, sku }>,
      subtotal: number,
      tax: number,
      shipping: number,
      total: number,
      status: 'awaiting_shipment' | 'shipped' | 'delivered' | 'cancelled',
      shippingAddress: { ... },
      trackingNumber: string | null
    }
  ]
}
```

### Guest Order Storage

**Option A:** Store in temporary storage (Netlify Functions KV or similar)
**Option B:** Store in Clerk metadata with email as key (if Clerk supports this)
**Option C:** Store in database with email lookup

**Recommended:** Option C (database) for guest orders, but for MVP we can skip guest linking and add it later.

---

## Testing Checklist

- [ ] Test order saved when logged-in user makes purchase
- [ ] Test order appears in dashboard after purchase
- [ ] Test multiple orders display correctly
- [ ] Test order details (items, total, date) are accurate
- [ ] Test empty state when no orders
- [ ] Test guest purchase (should not appear until account created)
- [ ] Test order status updates (when shipped, add tracking)

---

## Future Enhancements

1. **Order Status Updates:**
   - ShipStation webhook → Update order status in Clerk metadata
   - Add tracking number when order ships

2. **Invoice Downloads:**
   - Generate PDF invoices from order data
   - Link to download in dashboard

3. **Reorder Functionality:**
   - "Reorder" button that adds items to cart
   - Pre-fills quantity and product

4. **Order Filtering/Search:**
   - Filter by date range
   - Search by order number
   - Filter by status

5. **Guest Order Linking:**
   - Automatic linking when account created
   - Manual linking via email verification

---

## Next Steps

1. **Decide on approach** (recommend Option 1 for MVP)
2. **Update webhook** to save orders to Clerk metadata
3. **Create get-user-orders function**
4. **Update dashboard** to fetch and display orders
5. **Test with real purchases**
6. **Add order status updates** (when shipped)

---

## Questions to Consider

1. **How many orders per user?** (Clerk metadata limit considerations)
2. **Do we need guest order linking immediately?** (Can add later)
3. **How to handle order status updates?** (ShipStation webhook → update Clerk)
4. **Do we need invoice generation?** (Can add later)
5. **Do we need order search/filter?** (Can add later)

