# Shipping Cost Implementation Plan

**Date:** December 2025  
**Status:** Ready for Implementation  
**Origin ZIP:** 33486 (Boca Raton, Florida)

---

## Product Specifications

### AC Drain Wiz Mini
- **Product Weight:** 1.5 lbs (includes 4 attachments)
- **Packaging Weight:** ~0.088 lbs
- **Total Weight:** ~1.588 lbs (round to 1.6 lbs for shipping)
- **Dimensions:** 8" x 7" (height estimated at 2-3" for blister pack)
- **Packaging Type:** Blister packaging
- **Shipping:** Single unit per package

### AC Drain Wiz Sensor
- **Product Weight:** 1.5 lbs (includes battery and instructions)
- **Packaging Weight:** ~0.055 lbs
- **Total Weight:** ~1.555 lbs (round to 1.6 lbs for shipping)
- **Dimensions:** 7" x 6" (height estimated at 2-3" for blister pack)
- **Packaging Type:** Blister packaging
- **Shipping:** Single unit per package

### Mini + Sensor Bundle
- **Total Weight:** ~3.2 lbs (1.6 + 1.6)
- **Shipping:** Together or separately? (Need confirmation)
- **Dimensions:** Larger box if shipped together

**Note:** All weights/dimensions are approximations and can be updated when actual production products are available.

---

## Shipping Origin

- **Origin ZIP Code:** 33486 (Boca Raton, Florida)
- **ShipStation Account:** Bronze tier (500 shipments/month, unlimited channels)
- **Carriers:** UPS or FedEx (via ShipStation)

---

## Shipping Strategy

- **Free Shipping:** None
- **Quantity Discounts:** None (each unit ships at full rate)
- **Residential vs. Commercial:** Same rate (no difference)
- **International:** Canada only (for now)
- **Service Level:** Standard Ground only (no expedited)

---

## Shipping Cost Calculation

### From ZIP 33486 (Boca Raton, FL)

**Shipping Zones from Florida:**
- **Zone 1-2:** Florida, Georgia, South Carolina, Alabama
- **Zone 3-4:** North Carolina, Tennessee, Mississippi, Louisiana, Texas (parts)
- **Zone 5-6:** Mid-Atlantic, Midwest states
- **Zone 7-8:** West Coast, Pacific Northwest, Northeast

### Estimated Shipping Costs (1.6 lbs, Ground Service)

**Based on ShipStation discounted rates from ZIP 33486:**

#### Single Unit (Mini or Sensor - 1.6 lbs)
- **Zone 1-2 (Local/Regional):** ~$8-10
- **Zone 3-4 (Mid-range):** ~$10-12
- **Zone 5-6 (Long distance):** ~$12-15
- **Zone 7-8 (Cross-country):** ~$15-18
- **Canada:** ~$18-22

#### Two Units (3.2 lbs)
- **Zone 1-2:** ~$10-12
- **Zone 3-4:** ~$12-14
- **Zone 5-6:** ~$14-17
- **Zone 7-8:** ~$17-20
- **Canada:** ~$22-26

#### Three Units (4.8 lbs)
- **Zone 1-2:** ~$12-14
- **Zone 3-4:** ~$14-16
- **Zone 5-6:** ~$16-19
- **Zone 7-8:** ~$19-22
- **Canada:** ~$26-30

**Note:** These are estimates. Actual costs will vary based on exact destination and carrier selection.

---

## Implementation Options Analysis

### Option 1: UPS/FedEx API Integration

#### Cost Analysis

**UPS API:**
- **Cost:** FREE (no subscription fees)
- **Rate Calculation:** Free API calls for rate quotes
- **Requirements:** 
  - UPS Developer Account (free)
  - API credentials
  - Integration development time

**FedEx API:**
- **Cost:** FREE (no subscription fees)
- **Rate Calculation:** Free API calls for rate quotes
- **Requirements:**
  - FedEx Developer Account (free)
  - API credentials
  - Integration development time

**ShipStation API:**
- **Cost:** Included with your Bronze subscription
- **Rate Calculation:** Free API calls
- **Requirements:**
  - ShipStation API credentials (already have account)
  - Integration development time

#### Risk Assessment

**Risks of API Integration:**

1. **API Downtime:**
   - **Risk:** Medium
   - **Impact:** If API is down, can't calculate shipping costs
   - **Mitigation:** Fallback to fixed rates, cache rates

2. **Rate Calculation Errors:**
   - **Risk:** Low
   - **Impact:** Incorrect shipping costs shown to customers
   - **Mitigation:** Test thoroughly, validate responses

3. **Performance:**
   - **Risk:** Low-Medium
   - **Impact:** API calls add latency to checkout
   - **Mitigation:** Cache rates, use async loading

4. **Breaking Checkout:**
   - **Risk:** Low (if implemented correctly)
   - **Impact:** Checkout fails if API integration breaks
   - **Mitigation:**
     - Implement fallback to fixed rates
     - Error handling and logging
     - Test thoroughly before production
     - Gradual rollout (test mode first)

5. **Cost Overruns:**
   - **Risk:** Very Low
   - **Impact:** APIs are free, but if usage spikes unexpectedly
   - **Mitigation:** Monitor API usage, set rate limits

#### Implementation Complexity

**Time Required:** 2-3 days
- API integration: 1-2 days
- Testing: 1 day
- Fallback implementation: 0.5 day

**Pros:**
- ✅ Most accurate shipping costs
- ✅ Automatic updates
- ✅ Professional customer experience
- ✅ No manual maintenance

**Cons:**
- ⚠️ More complex implementation
- ⚠️ Requires API error handling
- ⚠️ Need fallback mechanism
- ⚠️ Slight performance impact

---

### Option 2: Zone-Based Rate Table (Recommended for Start)

#### Cost Analysis

**Cost:** FREE (no API fees, no subscriptions)

#### Risk Assessment

**Risks:**

1. **Rate Accuracy:**
   - **Risk:** Low-Medium
   - **Impact:** May over/under charge by $1-3
   - **Mitigation:** Use conservative estimates, update quarterly

2. **Breaking Checkout:**
   - **Risk:** Very Low
   - **Impact:** Simple calculation, less can go wrong
   - **Mitigation:** Test thoroughly, use fixed rate fallback

3. **Manual Maintenance:**
   - **Risk:** Low
   - **Impact:** Need to update rates if carriers change pricing
   - **Mitigation:** Review quarterly, update as needed

#### Implementation Complexity

**Time Required:** 1 day
- Rate table creation: 0.5 day
- Checkout integration: 0.5 day
- Testing: Included

**Pros:**
- ✅ Simple implementation
- ✅ No API dependencies
- ✅ Fast and reliable
- ✅ Easy to maintain
- ✅ No risk of API downtime

**Cons:**
- ⚠️ Less accurate than API (but still good)
- ⚠️ Requires manual rate updates

---

## Recommended Approach

### Phase 1: Zone-Based Rate Table (Immediate)

**Why Start Here:**
1. **Low Risk:** Won't break checkout
2. **Fast Implementation:** 1 day vs. 2-3 days
3. **Reliable:** No API dependencies
4. **Good Enough:** Accurate within $1-3
5. **Easy to Upgrade:** Can add API later

**Implementation:**
1. Create shipping rate table by zone and weight
2. Calculate rates based on destination ZIP code
3. Update Stripe checkout with calculated rates
4. Update Shipping Policy with accurate narrative

### Phase 2: API Integration (Post-Launch, Optional)

**When to Upgrade:**
- After launch and initial sales
- If rate accuracy becomes critical
- If you want to offer multiple carriers
- If you want real-time rate updates

**Which API:**
- **ShipStation API** (Recommended) - You already have account
- **UPS API** (Alternative) - Direct integration
- **FedEx API** (Alternative) - Direct integration

---

## Shipping Rate Table (Draft)

Based on ZIP 33486 origin and product weights:

### Single Unit (1.6 lbs) - Mini or Sensor

| Zone | Description | Estimated Cost |
|------|-------------|----------------|
| 1-2 | FL, GA, SC, AL | $9.00 |
| 3-4 | NC, TN, MS, LA, TX (parts) | $11.00 |
| 5-6 | Mid-Atlantic, Midwest | $13.50 |
| 7-8 | West Coast, Northeast | $16.50 |
| Canada | All provinces | $20.00 |

### Two Units (3.2 lbs) - Mini + Sensor or 2x Mini

| Zone | Description | Estimated Cost |
|------|-------------|----------------|
| 1-2 | FL, GA, SC, AL | $11.00 |
| 3-4 | NC, TN, MS, LA, TX (parts) | $13.00 |
| 5-6 | Mid-Atlantic, Midwest | $15.50 |
| 7-8 | West Coast, Northeast | $18.50 |
| Canada | All provinces | $24.00 |

### Three Units (4.8 lbs)

| Zone | Description | Estimated Cost |
|------|-------------|----------------|
| 1-2 | FL, GA, SC, AL | $13.00 |
| 3-4 | NC, TN, MS, LA, TX (parts) | $15.00 |
| 5-6 | Mid-Atlantic, Midwest | $17.50 |
| 7-8 | West Coast, Northeast | $20.50 |
| Canada | All provinces | $28.00 |

**Note:** These are estimates. Actual costs may vary by $1-2. We'll use these as base rates and can adjust based on actual ShipStation costs.

---

## Updated Shipping Policy Narrative

### "How Shipping Costs Are Calculated"

**Our shipping costs are calculated based on package weight and shipping distance to ensure you pay a fair price:**

1. **Package Weight:** 
   - AC Drain Wiz Mini: ~1.6 lbs (including packaging)
   - AC Drain Wiz Sensor: ~1.6 lbs (including packaging)
   - Multiple units increase total weight and shipping cost proportionally

2. **Shipping Distance (Zones):**
   - We ship from Boca Raton, Florida (ZIP 33486)
   - Shipping costs vary based on distance to your delivery address:
     - **Zones 1-2 (Local/Regional):** Florida, Georgia, South Carolina, Alabama - Lowest costs
     - **Zones 3-4 (Mid-range):** North Carolina, Tennessee, Mississippi, Louisiana, Texas - Moderate costs
     - **Zones 5-6 (Long distance):** Mid-Atlantic and Midwest states - Higher costs
     - **Zones 7-8 (Cross-country):** West Coast, Pacific Northwest, Northeast - Highest costs

3. **Carrier Selection:** 
   - We ship via UPS or FedEx Ground (via ShipStation)
   - The carrier is selected automatically based on best rate for your location

4. **No Additional Fees:**
   - Same rate for residential and commercial addresses
   - No quantity discounts (each unit ships at full rate)
   - Standard ground service only (no expedited options)

**Example Shipping Costs (Estimated):**
- **1 AC Drain Wiz Mini** (Zone 3-4): ~$11.00
- **2 AC Drain Wiz Minis** (Zone 3-4): ~$13.00
- **1 AC Drain Wiz Sensor** (Zone 3-4): ~$11.00
- **Mini + Sensor Bundle** (Zone 3-4): ~$13.00

*Note: Actual shipping costs are calculated at checkout based on your exact shipping address. Costs may vary by $1-2 from estimates.*

**International Shipping (Canada):**
- Shipping to Canada: ~$20-28 (depending on quantity)
- Additional customs duties and taxes may apply (customer responsibility)
- Delivery time: 7-14 business days

---

## API Integration Cost & Risk Summary

### Costs

**✅ ALL APIs are FREE:**
- UPS API: Free (no subscription fees)
- FedEx API: Free (no subscription fees)
- ShipStation API: Free (included with your Bronze subscription)

**No ongoing costs** - Only development time required.

### Risks

**Risk Level: LOW-MEDIUM**

**Potential Issues:**
1. **API Downtime:** Low risk, can use fallback rates
2. **Breaking Checkout:** Low risk if implemented with fallbacks
3. **Performance:** Low risk, can cache rates
4. **Rate Errors:** Low risk with proper validation

**Mitigation Strategies:**
- ✅ Implement fallback to fixed rates if API fails
- ✅ Cache shipping rates for performance
- ✅ Test thoroughly before production
- ✅ Monitor API usage and errors
- ✅ Gradual rollout (test mode first)

**Recommendation:** Start with zone-based rate table (safer, faster), then upgrade to API integration later if needed.

---

## Next Steps

### Immediate (Zone-Based Implementation)

1. **Create Shipping Rate Calculator Function**
   - Input: Destination ZIP, product, quantity
   - Output: Shipping cost
   - Use zone-based rate table

2. **Update Shipping Policy**
   - Add "How Shipping Costs Are Calculated" section
   - Include zone explanations
   - Add example costs

3. **Update Stripe Checkout**
   - Calculate shipping based on address
   - Show accurate costs to customers
   - Update `create-checkout.js`

4. **Test Thoroughly**
   - Test with various ZIP codes
   - Test with different quantities
   - Verify costs are reasonable

### Future (API Integration - Optional)

1. **Integrate ShipStation API** (when ready)
2. **Add real-time rate calculation**
3. **Remove zone-based table**

---

## Questions for Clarification

1. **Mini + Sensor Bundle:**
   - Do they ship together in one box, or separately?
   - If together, what are combined dimensions?

2. **Multiple Units:**
   - If customer orders 2 Minis, do they ship in one box or two?
   - If one box, what are the combined dimensions?

3. **Rate Table Accuracy:**
   - Should I use the estimated rates above, or do you want to verify with ShipStation first?

4. **Implementation Timeline:**
   - Do you want zone-based now, or wait for API integration?

---

**Status:** Ready to implement zone-based shipping calculation

**Estimated Time:** 1 day for zone-based, 2-3 days for API integration

**Recommendation:** Start with zone-based (safer, faster), upgrade to API later

