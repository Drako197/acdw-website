# Stripe Price ID Environment Variables

**IMPORTANT:** Add these to your Netlify environment variables in the Netlify Dashboard.

## Instructions

1. Go to your Netlify Dashboard: https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each variable below
5. Copy the variable name and value exactly as shown

---

## Environment Variables

### Homeowner Pricing (3 variables)

```
STRIPE_PRICE_MINI_HOMEOWNER=price_1SXaIMD0VZDEkpOxWaGoZgKt
STRIPE_PRICE_SENSOR_HOMEOWNER=price_1SXaKjD0VZDEkpOxhx9lXdd1
STRIPE_PRICE_BUNDLE_HOMEOWNER=price_1SXaLkD0VZDEkpOxIsUspzny
```

### HVAC Pro Pricing (9 variables)

```
STRIPE_PRICE_MINI_HVAC_T1=price_1SXaPlD0VZDEkpOxuZ4Ee3Ev
STRIPE_PRICE_MINI_HVAC_T2=price_1SXaQWD0VZDEkpOxOT2rRpMG
STRIPE_PRICE_MINI_HVAC_T3=price_1SXaQxD0VZDEkpOxHAL1nDVp
STRIPE_PRICE_SENSOR_HVAC_T1=price_1SXaaGD0VZDEkpOxh24aucsH
STRIPE_PRICE_SENSOR_HVAC_T2=price_1SXaalD0VZDEkpOxoMjYQnjh
STRIPE_PRICE_SENSOR_HVAC_T3=price_1SXaavD0VZDEkpOxzcGJzQF0
STRIPE_PRICE_BUNDLE_HVAC_T1=price_1SXad9D0VZDEkpOx4pilEBSj
STRIPE_PRICE_BUNDLE_HVAC_T2=price_1SXadXD0VZDEkpOxu4f1RoCv
STRIPE_PRICE_BUNDLE_HVAC_T3=price_1SXae6D0VZDEkpOxVBirLB2x
```

### Property Manager Pricing (9 variables)

```
STRIPE_PRICE_MINI_PM_T1=price_1SXaRbD0VZDEkpOxYGJpvTnr
STRIPE_PRICE_MINI_PM_T2=price_1SXaRwD0VZDEkpOxJQMCeQxi
STRIPE_PRICE_MINI_PM_T3=price_1SXaVoD0VZDEkpOx8CHJhCng
STRIPE_PRICE_SENSOR_PM_T1=price_1SXabUD0VZDEkpOxO8HNVXnc
STRIPE_PRICE_SENSOR_PM_T2=price_1SXabyD0VZDEkpOxsLLkc0uT
STRIPE_PRICE_SENSOR_PM_T3=price_1SXacMD0VZDEkpOxd6SEemH9
STRIPE_PRICE_BUNDLE_PM_T1=price_1SXaeTD0VZDEkpOxXzbG8ZcU
STRIPE_PRICE_BUNDLE_PM_T2=price_1SXaelD0VZDEkpOxLWOlPIZ3
STRIPE_PRICE_BUNDLE_PM_T3=price_1SXafDD0VZDEkpOxlxQnrbyw
```

---

## Verification Checklist

After adding all variables, verify:

- [ ] All 21 variables are added
- [ ] Variable names match exactly (case-sensitive)
- [ ] Price IDs start with `price_`
- [ ] No extra spaces or quotes around values
- [ ] Variables are set for the correct environment (Production, Deploy previews, Branch deploys)

---

## Testing

After adding the variables:

1. Redeploy your site (or trigger a new deploy)
2. Test the checkout flow with different roles and quantities
3. Verify the correct Price IDs are being used in the `get-price-id` function

---

**Note:** Make sure you also have these Stripe environment variables set:
- `STRIPE_SECRET_KEY` (your Stripe secret key)
- `STRIPE_PUBLISHABLE_KEY` (if used in frontend)

