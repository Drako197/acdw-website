# Shipping Cost Research & Implementation Plan

**Date:** December 2025  
**Purpose:** Research accurate shipping costs and implement dynamic shipping calculation

---

## Current Implementation

### What We Have Now

1. **Fixed Shipping Rates in Stripe Checkout:**
   - US: $15.00 (hardcoded in `create-checkout.js`)
   - Canada: $20.00 (hardcoded in `create-checkout.js`)
   - These are flat rates regardless of weight, distance, or quantity

2. **ShipStation Integration:**
   - Orders are automatically created in ShipStation after payment
   - ShipStation handles actual shipping label creation
   - No weight/dimension data is currently sent to ShipStation

3. **Shipping Address Collection:**
   - Stripe collects shipping address during checkout
   - Address is passed to ShipStation for order fulfillment

---

## Research Findings

### ShipStation Shipping Rates

**Key Points:**
- ShipStation provides discounted rates through their carrier partnerships
- Rates are typically 20-40% lower than retail UPS/FedEx rates
- ShipStation charges based on:
  - Package weight (actual or dimensional weight, whichever is greater)
  - Shipping zone (distance from origin to destination)
  - Service level (Ground, 2-Day, Overnight, etc.)
  - Residential vs. Commercial delivery
  - Additional services (signature, insurance, etc.)

**Typical ShipStation Rates (Ground Service):**
- **Zone 1-2 (Local/Regional):** ~$8-12 for 1-2 lbs
- **Zone 3-4 (Mid-range):** ~$10-15 for 1-2 lbs
- **Zone 5-6 (Long distance):** ~$12-18 for 1-2 lbs
- **Zone 7-8 (Cross-country):** ~$15-22 for 1-2 lbs

**Weight-Based Pricing:**
- First pound: ~$8-12 (base rate)
- Additional pounds: ~$0.50-1.50 per pound
- Dimensional weight applies if package is large but light

**Canada Shipping:**
- Typically $15-25 for ground service
- Additional customs/duties fees apply (customer responsibility)

---

## Questions Needed for Accurate Shipping

### 1. Product Specifications

**Critical Information Needed:**

1. **AC Drain Wiz Mini:**
   - Weight (in pounds): ?
   - Dimensions (L x W x H in inches): ?
   - Packaging dimensions (if different): ?

2. **AC Drain Wiz Sensor:**
   - Weight (in pounds): ?
   - Dimensions (L x W x H in inches): ?
   - Packaging dimensions (if different): ?

3. **Mini + Sensor Bundle:**
   - Shipped together or separately?
   - Combined weight: ?
   - Combined dimensions: ?

4. **Packaging:**
   - What type of packaging? (Box, padded envelope, etc.)
   - Weight of packaging materials: ?
   - Do multiple units ship in one box or separate boxes?

### 2. Shipping Origin

**Critical Information Needed:**

1. **Origin ZIP Code:** ?
   - This determines shipping zones for all destinations
   - Typically your warehouse/fulfillment center location

2. **ShipStation Account:**
   - Do you have a ShipStation account set up?
   - What's your ShipStation warehouse location?
   - Are you using ShipStation's discounted rates?

### 3. Shipping Strategy

**Questions:**

1. **Free Shipping Threshold:**
   - Currently set at $50 - is this accurate?
   - Should free shipping apply to all orders over $50, or only certain quantities?

2. **Quantity-Based Shipping:**
   - How do you handle shipping for multiple units?
   - Do 2 units cost 2x shipping, or is there a discount?
   - At what quantity do you use larger boxes/pallets?

3. **Residential vs. Commercial:**
   - Do you charge different rates for residential vs. commercial addresses?
   - Residential typically costs $2-4 more

4. **International Shipping:**
   - Do you ship internationally beyond US/Canada?
   - If yes, what countries and what are the rates?

### 4. Service Level Options

**Questions:**

1. **Standard Ground Only?**
   - Currently only offering standard ground (5-7 days)
   - Do you want to offer expedited options (2-Day, Overnight)?
   - If yes, what are the additional costs?

2. **Delivery Timeframes:**
   - Are 5-7 business days (US) and 7-14 (Canada) accurate?
   - These depend on origin location and destination zones

---

## Implementation Options

### Option 1: Stripe Shipping Rates API (Recommended)

**How It Works:**
- Stripe can calculate shipping costs dynamically based on:
  - Shipping address (ZIP code)
  - Package weight/dimensions
  - Service level selected
- Requires integration with shipping carrier APIs (UPS/FedEx) or ShipStation API

**Pros:**
- Most accurate shipping costs
- Updates automatically based on address
- Can show multiple shipping options
- Professional customer experience

**Cons:**
- More complex implementation
- Requires API integration
- May need to cache rates for performance

**Implementation Steps:**
1. Create Netlify Function to calculate shipping rates
2. Integrate with ShipStation API or UPS/FedEx API
3. Use Stripe's `shipping_rate` API to create dynamic rates
4. Update checkout session with calculated rates

### Option 2: Zone-Based Fixed Rates

**How It Works:**
- Pre-calculate shipping costs by zone
- Create multiple shipping rate options in Stripe
- Customer selects based on their location

**Pros:**
- Simpler implementation
- No API calls needed
- Predictable costs

**Cons:**
- Less accurate (averages across zones)
- More manual maintenance
- May over/under charge customers

**Implementation Steps:**
1. Calculate average shipping costs by zone
2. Create multiple shipping rate options in Stripe Dashboard
3. Update checkout to show zone-appropriate rates

### Option 3: Weight-Based Calculation

**How It Works:**
- Calculate shipping based on total order weight
- Use weight brackets (e.g., 1-2 lbs, 3-5 lbs, 6-10 lbs)
- Apply fixed rates per weight bracket

**Pros:**
- Accounts for quantity/weight
- Relatively simple
- More accurate than flat rate

**Cons:**
- Doesn't account for distance
- Still requires manual rate tables
- May not match actual ShipStation costs

**Implementation Steps:**
1. Create weight-based rate table
2. Calculate total order weight
3. Apply appropriate rate based on weight bracket
4. Update Stripe checkout with calculated rate

### Option 4: Hybrid Approach (Recommended for Start)

**How It Works:**
- Use weight-based calculation with zone adjustments
- Start with simple implementation
- Upgrade to full API integration later

**Pros:**
- Good balance of accuracy and simplicity
- Can be improved incrementally
- Better than flat rate

**Cons:**
- Still requires manual rate table maintenance
- Not as accurate as full API integration

---

## Recommended Approach

### Phase 1: Immediate (Before Launch)

**Use Zone-Based Weight Calculation:**

1. **Gather Product Specs:**
   - Get exact weights and dimensions for Mini and Sensor
   - Determine packaging weight

2. **Create Rate Table:**
   - Calculate shipping costs by zone and weight
   - Use ShipStation's rate calculator or actual rates from your account
   - Create brackets: 1 unit, 2-5 units, 6-10 units, etc.

3. **Update Shipping Policy:**
   - Add narrative explaining how shipping is calculated
   - Show example costs by zone
   - Explain weight-based pricing

4. **Update Checkout:**
   - Implement weight-based calculation
   - Show estimated shipping before address entry
   - Update to exact cost after address entry

### Phase 2: Post-Launch (Improvement)

**Upgrade to API Integration:**
- Integrate with ShipStation API for real-time rates
- Or integrate with UPS/FedEx API directly
- Provide most accurate shipping costs

---

## Shipping Policy Narrative (Draft)

Based on research, here's a draft narrative for the Shipping Policy:

### "How Shipping Costs Are Calculated"

**Our shipping costs are calculated based on several factors to ensure you pay a fair price:**

1. **Package Weight:** Shipping costs increase with the total weight of your order. Each AC Drain Wiz product has a specific weight, and multiple units increase the total shipping cost.

2. **Shipping Distance:** The distance from our fulfillment center to your delivery address affects shipping costs. We use shipping zones to determine this:
   - **Zones 1-2 (Local/Regional):** Closest to our warehouse - lowest shipping costs
   - **Zones 3-4 (Mid-range):** Moderate distance - moderate shipping costs
   - **Zones 5-6 (Long distance):** Further away - higher shipping costs
   - **Zones 7-8 (Cross-country):** Farthest destinations - highest shipping costs

3. **Delivery Address Type:** Residential addresses may incur a small additional fee ($2-4) compared to commercial addresses, as carriers charge more for residential delivery.

4. **Carrier Selection:** We ship via UPS or FedEx Ground, whichever provides the best rate for your location.

**Example Shipping Costs:**
- **1 AC Drain Wiz Mini** (Zone 3-4): ~$10-12
- **2 AC Drain Wiz Minis** (Zone 3-4): ~$12-15
- **1 AC Drain Wiz Sensor** (Zone 3-4): ~$10-12
- **Mini + Sensor Bundle** (Zone 3-4): ~$12-15

*Note: Actual costs will be calculated at checkout based on your exact shipping address.*

**Free Shipping:**
Orders over $50.00 (before tax) qualify for free standard shipping within the continental United States.

---

## Next Steps

### Information Needed from You:

1. **Product Specifications:**
   - [ ] AC Drain Wiz Mini weight and dimensions
   - [ ] AC Drain Wiz Sensor weight and dimensions
   - [ ] Packaging weight and dimensions
   - [ ] How multiple units are packaged

2. **Shipping Origin:**
   - [ ] Origin ZIP code (warehouse location)
   - [ ] ShipStation account status
   - [ ] ShipStation warehouse location

3. **Shipping Strategy:**
   - [ ] Free shipping threshold confirmation ($50?)
   - [ ] Quantity-based shipping approach
   - [ ] Residential vs. commercial pricing
   - [ ] International shipping (beyond US/Canada?)

4. **Service Levels:**
   - [ ] Standard ground only, or offer expedited?
   - [ ] If expedited, what are the costs?

### Once We Have This Information:

1. I'll create a shipping rate calculation function
2. Update the Shipping Policy with accurate narrative
3. Implement dynamic shipping costs in checkout
4. Update product pages with shipping estimates
5. Test with various addresses and quantities

---

## Resources

- **ShipStation Rate Calculator:** https://www.shipstation.com/shipping-calculator/
- **UPS Rate Calculator:** https://www.ups.com/rate-calculator
- **FedEx Rate Calculator:** https://www.fedex.com/ratefinder/
- **Stripe Shipping Rates API:** https://stripe.com/docs/payments/checkout/shipping

---

**Status:** Awaiting product specifications and shipping origin information

