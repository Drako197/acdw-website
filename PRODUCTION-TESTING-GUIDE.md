# Production Testing Guide - Shipping Implementation

**Date:** December 5, 2025  
**Tester:** Follow these steps to verify shipping calculation in production

---

## Pre-Test Checklist

- [ ] Production site is deployed (check Netlify dashboard)
- [ ] All builds completed successfully
- [ ] Have access to Stripe test mode (or use live mode carefully)
- [ ] Ready to take screenshots of any issues

---

## Test Case 1: Verify Shipping Policy Page

**Objective:** Ensure the new Shipping Policy page loads and displays correctly.

### Steps:
1. Navigate to: https://www.acdrainwiz.com
2. Scroll to the footer
3. Click "Shipping Policy" link in the Legal section
4. **Verify you see:**
   - ✅ Shipping Policy header with truck icon
   - ✅ "Zone-Based Shipping Rates" table
   - ✅ All 5 zones listed (Zone 1-2, 3-4, 5-6, 7-8, Canada)
   - ✅ Pricing for 1-10 units per zone
   - ✅ Delivery estimates
   - ✅ Product weights (Mini: 1.6 lbs, Sensor: 1.6 lbs)
   - ✅ Contact information at bottom

### Expected Result:
- Page loads without errors
- All content displays correctly
- Table is readable and formatted properly
- All links work

### If Errors:
- Take screenshot
- Check browser console for errors (F12)
- Note what's missing or broken

---

## Test Case 2: Shipping Calculator - Florida (Zone 1)

**Objective:** Test local/regional shipping calculation.

### Steps:
1. Navigate to HVAC Pro Catalog: https://www.acdrainwiz.com/business/pro/catalog
   - (If not logged in, sign in as HVAC Pro)
2. Select **1 AC Drain Wiz Mini**
3. Click "Checkout"
4. **Fill in shipping address:**
   - Name: Test User
   - Address: 123 Main St
   - City: Miami
   - State: FL
   - ZIP: 33101
   - Country: US
5. **Verify shipping cost displayed:**
   - Expected: **$9.00** (Zone 1, single unit)
6. **Check shipping description:**
   - Should say: "Standard Ground Shipping" or similar
   - Delivery estimate: 3-5 business days

### Expected Result:
- Shipping cost: **$9.00**
- Delivery: 3-5 business days
- Total: Product price + $9.00 + tax

### If Different Cost:
- Note the actual cost shown
- Take screenshot of checkout page
- Check Netlify function logs (see Troubleshooting section)

---

## Test Case 3: Shipping Calculator - Texas (Zone 2)

**Objective:** Test mid-range shipping calculation.

### Steps:
1. Start new checkout with **2 AC Drain Wiz Minis**
2. **Fill in shipping address:**
   - Name: Test User
   - Address: 456 Oak Ave
   - City: Houston
   - State: TX
   - ZIP: 77001
   - Country: US
3. **Verify shipping cost:**
   - Expected: **$13.00** (Zone 2, two units)
4. **Check delivery estimate:**
   - Expected: 4-6 business days

### Expected Result:
- Shipping cost: **$13.00**
- Delivery: 4-6 business days

---

## Test Case 4: Shipping Calculator - New York (Zone 4)

**Objective:** Test cross-country shipping calculation.

### Steps:
1. Start new checkout with **1 AC Drain Wiz Mini + 1 AC Drain Wiz Sensor**
2. **Fill in shipping address:**
   - Name: Test User
   - Address: 789 Broadway
   - City: New York
   - State: NY
   - ZIP: 10001
   - Country: US
3. **Verify shipping cost:**
   - Expected: **$18.50** (Zone 4, two units/3.2 lbs)
4. **Check delivery estimate:**
   - Expected: 5-7 business days

### Expected Result:
- Shipping cost: **$18.50**
- Delivery: 5-7 business days

---

## Test Case 5: Shipping Calculator - California (Zone 4)

**Objective:** Test West Coast shipping with higher quantity.

### Steps:
1. Start new checkout with **3 AC Drain Wiz Minis**
2. **Fill in shipping address:**
   - Name: Test User
   - Address: 321 Pacific Blvd
   - City: Los Angeles
   - State: CA
   - ZIP: 90001
   - Country: US
3. **Verify shipping cost:**
   - Expected: **$20.50** (Zone 4, three units/4.8 lbs)
4. **Check delivery estimate:**
   - Expected: 5-7 business days

### Expected Result:
- Shipping cost: **$20.50**
- Delivery: 5-7 business days

---

## Test Case 6: Shipping Calculator - Canada

**Objective:** Test international (Canada) shipping.

### Steps:
1. Start new checkout with **1 AC Drain Wiz Mini**
2. **Fill in shipping address:**
   - Name: Test User
   - Address: 100 King St
   - City: Toronto
   - State/Province: ON
   - ZIP/Postal Code: M5H 2N2
   - Country: **CA** (Canada)
3. **Verify shipping cost:**
   - Expected: **$20.00** (Canada, single unit)
4. **Check delivery estimate:**
   - Expected: 7-14 business days
5. **Look for customs notice:**
   - Should mention additional duties/taxes may apply

### Expected Result:
- Shipping cost: **$20.00**
- Delivery: 7-14 business days
- Customs notice displayed

---

## Test Case 7: Larger Quantity (5 units)

**Objective:** Test shipping for larger orders.

### Steps:
1. Start new checkout with **5 AC Drain Wiz Minis**
2. **Fill in shipping address:**
   - Use any state (e.g., Georgia - Zone 1)
3. **Verify shipping cost increases appropriately:**
   - Weight: 8.0 lbs
   - Should be higher than 3-unit rate
   - Expected: ~$15-17 for Zone 1

### Expected Result:
- Shipping cost scales with weight
- Cost is reasonable for 8 lbs package

---

## Test Case 8: Mixed Products

**Objective:** Test shipping with different product types.

### Steps:
1. Start new checkout with:
   - **2 AC Drain Wiz Minis**
   - **1 AC Drain Wiz Sensor**
2. **Fill in shipping address:**
   - Any US state
3. **Verify shipping cost:**
   - Total weight: 4.8 lbs (3 units)
   - Should match triple-unit rate for zone

### Expected Result:
- System correctly calculates total weight
- Shipping cost matches 3-unit tier

---

## Test Case 9: Complete Full Checkout (Optional)

**Objective:** Test end-to-end checkout flow.

⚠️ **Note:** Only do this if you're comfortable making a test purchase. Use Stripe test mode if available.

### Steps:
1. Select a product
2. Enter shipping address
3. Verify shipping cost
4. **Enter payment:**
   - **Test Card:** 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete checkout
6. **Verify:**
   - Success page loads
   - Confirmation email received
   - Order appears in Stripe dashboard
   - Shipping cost is correct in order details

### Expected Result:
- Checkout completes successfully
- All order details are correct
- Shipping cost matches expected amount

---

## Monitoring & Logs

### Check Netlify Function Logs

1. Go to: https://app.netlify.com
2. Select your site
3. Click **Functions** tab
4. Click **create-checkout** function
5. Check **Function log**
6. **Look for:**
   - "Calculating shipping for address:"
   - "Shipping calculation result:"
   - "Method: api" or "Method: zone"
   - "Cost: $XX.XX"

### What to Look For:
- ✅ No error messages
- ✅ Shipping calculations logged
- ✅ Method shows "zone" (or "api" if ShipStation configured)
- ✅ Costs match expected amounts

---

## Troubleshooting

### Issue: Shipping cost is $0.00
**Possible Cause:** Shipping calculator not working  
**Fix:** Check function logs, verify deployment completed

### Issue: Old shipping rates ($15/$20)
**Possible Cause:** Old code still deployed  
**Fix:** 
1. Clear Netlify cache
2. Trigger manual redeploy
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### Issue: "Shipping calculation failed"
**Possible Cause:** Function error  
**Fix:** 
1. Check Netlify function logs
2. Look for error messages
3. Verify `shipping-calculator.cjs` deployed correctly

### Issue: Wrong zone assignment
**Possible Cause:** State not mapped correctly  
**Fix:** 
1. Note which state and what zone it should be
2. Check `shipping-calculator.cjs` STATE_ZONES mapping
3. Update if needed and redeploy

### Issue: Canada shipping not working
**Possible Cause:** Country code issue  
**Fix:**
1. Verify country is set to "CA" or "CANADA"
2. Check function logs for country detection
3. Verify Stripe allows CA in shipping_address_collection

---

## Test Results Template

Copy this for your testing notes:

```
## Test Results - [Date/Time]

### Test Case 1: Shipping Policy Page
- Status: [ ] Pass / [ ] Fail
- Notes: 

### Test Case 2: Florida (Zone 1)
- Status: [ ] Pass / [ ] Fail
- Expected: $9.00
- Actual: $____
- Notes: 

### Test Case 3: Texas (Zone 2)
- Status: [ ] Pass / [ ] Fail
- Expected: $13.00
- Actual: $____
- Notes: 

### Test Case 4: New York (Zone 4)
- Status: [ ] Pass / [ ] Fail
- Expected: $18.50
- Actual: $____
- Notes: 

### Test Case 5: California (Zone 4)
- Status: [ ] Pass / [ ] Fail
- Expected: $20.50
- Actual: $____
- Notes: 

### Test Case 6: Canada
- Status: [ ] Pass / [ ] Fail
- Expected: $20.00
- Actual: $____
- Notes: 

### Test Case 7: 5 Units
- Status: [ ] Pass / [ ] Fail
- Notes: 

### Test Case 8: Mixed Products
- Status: [ ] Pass / [ ] Fail
- Notes: 

### Overall Status
- [ ] All tests passed
- [ ] Some tests failed (see notes above)
- [ ] Ready for production use
- [ ] Needs fixes

### Issues Found:
1. 
2. 
3. 

### Screenshots:
- [ ] Attached
```

---

## Quick Test (30 seconds)

If you only have time for a quick verification:

1. Go to Shipping Policy page → Verify it loads ✅
2. Start checkout with 1 Mini → Florida address → Verify shipping ~$9 ✅
3. Check Netlify function logs → Verify "Calculating shipping" appears ✅

If all 3 pass, system is working! 🎉

---

**Ready to test?** Start with Test Case 1 and work through each one. Take your time and document any issues.

**Questions?** Check the Troubleshooting section or Netlify function logs for clues.

---

*Happy Testing!* 🚀

