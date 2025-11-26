# Stripe Price ID Setup Guide

This guide helps you create all necessary Price IDs in Stripe for the multi-tier, multi-role pricing system.

---

## PRICING STRUCTURE OVERVIEW

You need to create **27 Price IDs** total:
- 3 products (Mini, Sensor, Bundle)
- 3 roles (Homeowner, HVAC Pro, Property Manager)
- 3 tiers per B2B role (Tier 1, Tier 2, Tier 3)
- Homeowner only has MSRP (no tiers)

---

## STEP-BY-STEP: CREATE PRICE IDs IN STRIPE

### Step 1: Access Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test mode** for development
3. Navigate to **Products** → **Add product**

### Step 2: Create Products First (if not already created)

Create 3 products:
- **AC Drain Wiz Mini**
- **AC Drain Wiz Sensor**
- **AC Drain Wiz Mini + Sensor Bundle**

### Step 3: Create Prices for Each Product/Role/Tier

For each combination, create a Price:

---

## HOMEOWNER PRICING (MSRP Only)

### Mini - Homeowner
- **Product:** AC Drain Wiz Mini
- **Price:** $99.99
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_homeowner`

### Sensor - Homeowner
- **Product:** AC Drain Wiz Sensor
- **Price:** $69.99
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_homeowner`

### Bundle - Homeowner
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $179.99
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_homeowner`

---

## HVAC PRO PRICING

### Mini - HVAC Pro - Tier 1
- **Product:** AC Drain Wiz Mini
- **Price:** $71.67
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_hvac_t1`

### Mini - HVAC Pro - Tier 2
- **Product:** AC Drain Wiz Mini
- **Price:** $65.00
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_hvac_t2`

### Mini - HVAC Pro - Tier 3
- **Product:** AC Drain Wiz Mini
- **Price:** $58.00
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_hvac_t3`

### Sensor - HVAC Pro - Tier 1
- **Product:** AC Drain Wiz Sensor
- **Price:** $50.17
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_hvac_t1`

### Sensor - HVAC Pro - Tier 2
- **Product:** AC Drain Wiz Sensor
- **Price:** $45.50
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_hvac_t2`

### Sensor - HVAC Pro - Tier 3
- **Product:** AC Drain Wiz Sensor
- **Price:** $40.60
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_hvac_t3`

### Bundle - HVAC Pro - Tier 1
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $129.01
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_hvac_t1`

### Bundle - HVAC Pro - Tier 2
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $117.01
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_hvac_t2`

### Bundle - HVAC Pro - Tier 3
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $104.41
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_hvac_t3`

---

## PROPERTY MANAGER PRICING

### Mini - Property Manager - Tier 1
- **Product:** AC Drain Wiz Mini
- **Price:** $64.50
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_pm_t1`

### Mini - Property Manager - Tier 2
- **Product:** AC Drain Wiz Mini
- **Price:** $58.50
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_pm_t2`

### Mini - Property Manager - Tier 3
- **Product:** AC Drain Wiz Mini
- **Price:** $52.20
- **Billing:** One-time
- **Price ID:** Copy this → `price_mini_pm_t3`

### Sensor - Property Manager - Tier 1
- **Product:** AC Drain Wiz Sensor
- **Price:** $45.15
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_pm_t1`

### Sensor - Property Manager - Tier 2
- **Product:** AC Drain Wiz Sensor
- **Price:** $40.95
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_pm_t2`

### Sensor - Property Manager - Tier 3
- **Product:** AC Drain Wiz Sensor
- **Price:** $36.54
- **Billing:** One-time
- **Price ID:** Copy this → `price_sensor_pm_t3`

### Bundle - Property Manager - Tier 1
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $116.11
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_pm_t1`

### Bundle - Property Manager - Tier 2
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $105.31
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_pm_t2`

### Bundle - Property Manager - Tier 3
- **Product:** AC Drain Wiz Mini + Sensor Bundle
- **Price:** $93.97
- **Billing:** One-time
- **Price ID:** Copy this → `price_bundle_pm_t3`

---

## PRICE ID CHECKLIST

Use this checklist to track which Price IDs you've created:

### Homeowner (3 prices)
- [ ] `price_mini_homeowner` = $99.99
- [ ] `price_sensor_homeowner` = $69.99
- [ ] `price_bundle_homeowner` = $179.99

### HVAC Pro (9 prices)
- [ ] `price_mini_hvac_t1` = $71.67
- [ ] `price_mini_hvac_t2` = $65.00
- [ ] `price_mini_hvac_t3` = $58.00
- [ ] `price_sensor_hvac_t1` = $50.17
- [ ] `price_sensor_hvac_t2` = $45.50
- [ ] `price_sensor_hvac_t3` = $40.60
- [ ] `price_bundle_hvac_t1` = $129.01
- [ ] `price_bundle_hvac_t2` = $117.01
- [ ] `price_bundle_hvac_t3` = $104.41

### Property Manager (9 prices)
- [ ] `price_mini_pm_t1` = $64.50
- [ ] `price_mini_pm_t2` = $58.50
- [ ] `price_mini_pm_t3` = $52.20
- [ ] `price_sensor_pm_t1` = $45.15
- [ ] `price_sensor_pm_t2` = $40.95
- [ ] `price_sensor_pm_t3` = $36.54
- [ ] `price_bundle_pm_t1` = $116.11
- [ ] `price_bundle_pm_t2` = $105.31
- [ ] `price_bundle_pm_t3` = $93.97

**Total: 21 Price IDs**

---

## ADD PRICE IDs TO ENVIRONMENT VARIABLES

After creating all Price IDs, add them to Netlify environment variables:

```
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

## TIPS

1. **Use Test Mode First:** Create all prices in test mode, test thoroughly, then create in live mode
2. **Name Your Prices:** In Stripe, you can add a description to each price for easy identification
3. **Verify Prices:** Double-check each price matches the pricing table exactly
4. **Document:** Keep a spreadsheet of Price IDs for reference

---

## VERIFICATION

After creating all Price IDs:

1. Test the `get-price-id` function with each product/role/quantity combination
2. Verify the correct Price ID is returned
3. Test checkout flow with each Price ID
4. Confirm payments process correctly

---

**Once all Price IDs are created and added to environment variables, the pricing system will be fully functional.**

