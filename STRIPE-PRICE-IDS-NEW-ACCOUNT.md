# Stripe Price IDs - New Account

**Account:** New ACDW Stripe Account (Test Mode)  
**Date:** Current Session  
**Total Price IDs:** 19

---

## Homeowner Pricing (1 Price ID)

```
STRIPE_PRICE_MINI_HOMEOWNER=price_1SZe5X60dq6nGBAfwo2hsNxK
```

**Note:** Homeowners can only purchase Mini (not Sensor or Bundle)

---

## HVAC Pro Pricing (9 Price IDs)

### Mini - HVAC Pro
```
STRIPE_PRICE_MINI_HVAC_T1=price_1SZebe60dq6nGBAfutAtD9re
STRIPE_PRICE_MINI_HVAC_T2=price_1SZeiH60dq6nGBAf2o2ypICU
STRIPE_PRICE_MINI_HVAC_T3=price_1SZekg60dq6nGBAfTQ8c630l
```

### Sensor - HVAC Pro
```
STRIPE_PRICE_SENSOR_HVAC_T1=price_1SZenc60dq6nGBAfvTu9zjFI
STRIPE_PRICE_SENSOR_HVAC_T2=price_1SZf1t60dq6nGBAfe36Q57Bp
STRIPE_PRICE_SENSOR_HVAC_T3=price_1SZf5i60dq6nGBAfa1p0ruWp
```

### Bundle - HVAC Pro
```
STRIPE_PRICE_BUNDLE_HVAC_T1=price_1SZf9f60dq6nGBAfmqSXnqbY
STRIPE_PRICE_BUNDLE_HVAC_T2=price_1SZfAh60dq6nGBAfAsho4TuM
STRIPE_PRICE_BUNDLE_HVAC_T3=price_1SZfD360dq6nGBAfwElA3YTM
```

---

## Property Manager Pricing (9 Price IDs)

### Mini - Property Manager
```
STRIPE_PRICE_MINI_PM_T1=price_1SZfHZ60dq6nGBAfVcHud4Fa
STRIPE_PRICE_MINI_PM_T2=price_1SZfJH60dq6nGBAfgPDGJLVs
STRIPE_PRICE_MINI_PM_T3=price_1SZfLW60dq6nGBAf7vNkpTVd
```

### Sensor - Property Manager
```
STRIPE_PRICE_SENSOR_PM_T1=price_1SZfMZ60dq6nGBAfglTItYiC
STRIPE_PRICE_SENSOR_PM_T2=price_1SZfNQ60dq6nGBAf3ULHuQf5
STRIPE_PRICE_SENSOR_PM_T3=price_1SZfUL60dq6nGBAfVIhk1Q4F
```

### Bundle - Property Manager
```
STRIPE_PRICE_BUNDLE_PM_T1=price_1SZfVA60dq6nGBAfPahshH8Z
STRIPE_PRICE_BUNDLE_PM_T2=price_1SZfWA60dq6nGBAf2qwsKsgi
STRIPE_PRICE_BUNDLE_PM_T3=price_1SZfWm60dq6nGBAfDDdadlnM
```

---

## Complete Environment Variable List

Copy and paste these into Netlify:

```
STRIPE_PRICE_MINI_HOMEOWNER=price_1SZe5X60dq6nGBAfwo2hsNxK

STRIPE_PRICE_MINI_HVAC_T1=price_1SZebe60dq6nGBAfutAtD9re
STRIPE_PRICE_MINI_HVAC_T2=price_1SZeiH60dq6nGBAf2o2ypICU
STRIPE_PRICE_MINI_HVAC_T3=price_1SZekg60dq6nGBAfTQ8c630l

STRIPE_PRICE_SENSOR_HVAC_T1=price_1SZenc60dq6nGBAfvTu9zjFI
STRIPE_PRICE_SENSOR_HVAC_T2=price_1SZf1t60dq6nGBAfe36Q57Bp
STRIPE_PRICE_SENSOR_HVAC_T3=price_1SZf5i60dq6nGBAfa1p0ruWp

STRIPE_PRICE_BUNDLE_HVAC_T1=price_1SZf9f60dq6nGBAfmqSXnqbY
STRIPE_PRICE_BUNDLE_HVAC_T2=price_1SZfAh60dq6nGBAfAsho4TuM
STRIPE_PRICE_BUNDLE_HVAC_T3=price_1SZfD360dq6nGBAfwElA3YTM

STRIPE_PRICE_MINI_PM_T1=price_1SZfHZ60dq6nGBAfVcHud4Fa
STRIPE_PRICE_MINI_PM_T2=price_1SZfJH60dq6nGBAfgPDGJLVs
STRIPE_PRICE_MINI_PM_T3=price_1SZfLW60dq6nGBAf7vNkpTVd

STRIPE_PRICE_SENSOR_PM_T1=price_1SZfMZ60dq6nGBAfglTItYiC
STRIPE_PRICE_SENSOR_PM_T2=price_1SZfNQ60dq6nGBAf3ULHuQf5
STRIPE_PRICE_SENSOR_PM_T3=price_1SZfUL60dq6nGBAfVIhk1Q4F

STRIPE_PRICE_BUNDLE_PM_T1=price_1SZfVA60dq6nGBAfPahshH8Z
STRIPE_PRICE_BUNDLE_PM_T2=price_1SZfWA60dq6nGBAf2qwsKsgi
STRIPE_PRICE_BUNDLE_PM_T3=price_1SZfWm60dq6nGBAfDDdadlnM
```

---

## Pricing Summary

### Homeowner
- Mini: $99.99

### HVAC Pro
- Mini: $71.67 / $65.00 / $58.00 (Tier 1/2/3)
- Sensor: $50.17 / $45.50 / $40.60 (Tier 1/2/3)
- Bundle: $129.00 / $117.00 / $104.00 (Tier 1/2/3)

### Property Manager
- Mini: $64.50 / $58.50 / $52.20 (Tier 1/2/3)
- Sensor: $45.15 / $40.95 / $36.54 (Tier 1/2/3)
- Bundle: $116.10 / $105.30 / $93.60 (Tier 1/2/3)

---

**Next Step:** Update all 19 environment variables in Netlify Dashboard

