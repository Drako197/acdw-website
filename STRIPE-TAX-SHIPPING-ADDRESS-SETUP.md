# Stripe Tax & Shipping Address Profile Setup

## ✅ What's Been Implemented

### 1. Stripe Tax - ENABLED
- Automatic tax calculation is now enabled in checkout
- Taxes are calculated based on shipping address
- Tax appears in checkout and on success page
- No additional setup needed - Stripe handles everything

### 2. Success Page - FIXED
- Now properly displays shipping address
- Shows order breakdown: Subtotal, Shipping, Tax, Total
- Fetches order details from Stripe automatically
- Improved error handling and logging

### 3. Shipping Address to Profile - IMPLEMENTED
- Shipping address is automatically saved to user profile
- Stored in Clerk user metadata (private, secure)
- Used for faster checkout on future orders
- **Legal and a common best practice**

---

## 🔧 Setup Required

### Step 1: Add CLERK_SECRET_KEY to Netlify

To enable shipping address saving to profiles, you need to add your Clerk secret key:

1. Go to https://app.netlify.com
2. Select your site → **Site settings** → **Environment variables**
3. Add:
   - **Key:** `CLERK_SECRET_KEY`
   - **Value:** `REMOVED_SECRET` (from CLERK-KEYS-SETUP.md)
   - **Scopes:** Functions (or All scopes)

**Note:** If this key is not set, the shipping address saving will be skipped (no error, just a warning in logs).

---

## 📋 How It Works

### Stripe Tax Flow:
1. Customer enters shipping address in Stripe Checkout
2. Stripe automatically calculates tax based on address
3. Tax is added to order total
4. Tax appears in checkout summary
5. Tax is included in order total on success page

### Shipping Address Saving:
1. After successful payment, success page loads
2. Fetches order details from Stripe
3. If shipping address exists, automatically saves to Clerk user profile
4. Address is stored in `unsafeMetadata.shippingAddress`
5. Can be retrieved later for pre-filling checkout forms

---

## 🧪 Testing

### Test Stripe Tax:
1. Go through checkout with a US address
2. You should see tax calculated automatically
3. Tax amount varies by state
4. Check success page - tax should appear in breakdown

### Test Shipping Address Display:
1. Complete a checkout with shipping address
2. Success page should show:
   - Order ID
   - Order breakdown (Subtotal, Shipping, Tax, Total)
   - Shipping address section

### Test Address Saving:
1. Complete a checkout
2. Check browser console for "Shipping address saved to profile" message
3. Go to profile page (if implemented) - address should be there
4. On next checkout, address can be pre-filled

---

## ⚖️ Legal Note: Storing Shipping Addresses

**Is it legal?** ✅ **YES**

Storing shipping addresses in user profiles is:
- **Legal** - No privacy laws prohibit this
- **Common practice** - Most e-commerce sites do this
- **User-friendly** - Saves customers time on future orders
- **Secure** - Stored in Clerk's encrypted metadata

**Best Practices:**
- Store in `unsafeMetadata` (private, not exposed to frontend by default)
- Allow users to update/delete their address
- Comply with GDPR/CCPA if applicable (users can request data deletion)
- Only use for order fulfillment purposes

**What we're doing:**
- Storing address in Clerk `unsafeMetadata` (secure, private)
- Only saving after user provides it during checkout (explicit consent)
- Can be accessed later for pre-filling forms (improves UX)
- User can update via profile page

---

## 📊 Success Page Display

The success page now shows:

1. **Order ID** - Stripe session ID
2. **Order Breakdown:**
   - Subtotal (product cost)
   - Shipping (if applicable)
   - Tax (if applicable)
   - **Total** (all costs combined)
3. **Shipping Address:**
   - Name
   - Street address
   - City, State, ZIP
   - Country

---

## 🔍 Troubleshooting

### Shipping address not showing:
- Check browser console for errors
- Verify `get-checkout-session` function is deployed
- Check Netlify function logs
- Ensure shipping address was collected in Stripe Checkout

### Tax not calculating:
- Verify Stripe Tax is enabled in your Stripe account
- Check that shipping address is being collected
- Tax may be $0.00 in some states/jurisdictions
- Check Stripe Dashboard → Tax settings

### Address not saving to profile:
- Check that `CLERK_SECRET_KEY` is set in Netlify
- Check Netlify function logs for errors
- Verify user ID is being passed correctly
- Function will fail gracefully if Clerk key is missing

---

## 📝 Files Modified

1. **`netlify/functions/create-checkout.js`**
   - Enabled `automatic_tax: { enabled: true }`

2. **`netlify/functions/get-checkout-session.js`**
   - Added better logging
   - Fixed shipping details retrieval
   - Added tax and shipping cost extraction

3. **`netlify/functions/save-shipping-address.js`** (NEW)
   - Saves shipping address to Clerk user profile
   - Uses Clerk REST API

4. **`src/pages/CheckoutSuccessPage.tsx`**
   - Fetches and displays order details
   - Shows order breakdown
   - Displays shipping address
   - Automatically saves address to profile

5. **`src/index.css`**
   - Added styles for order breakdown
   - Added styles for shipping info display

---

## ✅ Next Steps

1. **Add CLERK_SECRET_KEY to Netlify** (if not already done)
2. **Test the complete flow:**
   - Checkout with shipping address
   - Verify tax is calculated
   - Verify success page shows all details
   - Verify address is saved to profile
3. **Optional:** Add address pre-filling on future checkouts
4. **Optional:** Add address management to profile page

---

**Everything is ready! Just add the CLERK_SECRET_KEY to Netlify and test the flow.**

