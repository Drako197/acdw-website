#!/bin/bash

# Script to add all 19 Stripe Price ID environment variables to Netlify
# Run this after you have all the Price IDs

echo "🔧 Adding all Stripe Price IDs to Netlify environment variables..."
echo ""

# Homeowner (1)
netlify env:set STRIPE_PRICE_MINI_HOMEOWNER "price_1SZe5X60dq6nGBAfwo2hsNxK"

# HVAC Pro - Mini (3)
netlify env:set STRIPE_PRICE_MINI_HVAC_T1 "price_1SZebe60dq6nGBAfutAtD9re"
netlify env:set STRIPE_PRICE_MINI_HVAC_T2 "price_1SZeiH60dq6nGBAf2o2ypICU"
netlify env:set STRIPE_PRICE_MINI_HVAC_T3 "price_1SZekg60dq6nGBAfTQ8c630l"

# HVAC Pro - Sensor (3)
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T1 "price_1SZenc60dq6nGBAfvTu9zjFI"
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T2 "price_1SZf1t60dq6nGBAfe36Q57Bp"
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T3 "price_1SZf5i60dq6nGBAfa1p0ruWp"

# HVAC Pro - Bundle (3)
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T1 "price_1SZf9f60dq6nGBAfmqSXnqbY"
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T2 "price_1SZfAh60dq6nGBAfAsho4TuM"
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T3 "price_1SZfD360dq6nGBAfwElA3YTM"

# Property Manager - Mini (3)
netlify env:set STRIPE_PRICE_MINI_PM_T1 "price_1SZfHZ60dq6nGBAfVcHud4Fa"
netlify env:set STRIPE_PRICE_MINI_PM_T2 "price_1SZfJH60dq6nGBAfgPDGJLVs"
netlify env:set STRIPE_PRICE_MINI_PM_T3 "price_1SZfLW60dq6nGBAf7vNkpTVd"

# Property Manager - Sensor (3)
netlify env:set STRIPE_PRICE_SENSOR_PM_T1 "price_1SZfMZ60dq6nGBAfglTItYiC"
netlify env:set STRIPE_PRICE_SENSOR_PM_T2 "price_1SZfNQ60dq6nGBAf3ULHuQf5"
netlify env:set STRIPE_PRICE_SENSOR_PM_T3 "price_1SZfUL60dq6nGBAfVIhk1Q4F"

# Property Manager - Bundle (3)
netlify env:set STRIPE_PRICE_BUNDLE_PM_T1 "price_1SZfVA60dq6nGBAfPahshH8Z"
netlify env:set STRIPE_PRICE_BUNDLE_PM_T2 "price_1SZfWA60dq6nGBAf2qwsKsgi"
netlify env:set STRIPE_PRICE_BUNDLE_PM_T3 "price_1SZfWm60dq6nGBAfDDdadlnM"

echo ""
echo "✅ All 19 Price ID environment variables added!"
echo ""
echo "⚠️  NEXT STEPS:"
echo "1. Redeploy your site to load the new environment variables"
echo "2. Test the payment flow with different products and roles"
echo "3. Verify Price IDs are being used correctly"
echo ""

