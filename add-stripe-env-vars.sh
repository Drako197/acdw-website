#!/bin/bash

# Script to add all Stripe Price ID environment variables to Netlify
# Make sure you've run `netlify link` first!

echo "🚀 Adding Stripe Price ID environment variables to Netlify"
echo ""

# Homeowner Pricing (3 variables)
echo "Adding Homeowner pricing variables..."
netlify env:set STRIPE_PRICE_MINI_HOMEOWNER "price_1SXaIMD0VZDEkpOxWaGoZgKt"
netlify env:set STRIPE_PRICE_SENSOR_HOMEOWNER "price_1SXaKjD0VZDEkpOxhx9lXdd1"
netlify env:set STRIPE_PRICE_BUNDLE_HOMEOWNER "price_1SXaLkD0VZDEkpOxIsUspzny"

# HVAC Pro Pricing (9 variables)
echo "Adding HVAC Pro pricing variables..."
netlify env:set STRIPE_PRICE_MINI_HVAC_T1 "price_1SXaPlD0VZDEkpOxuZ4Ee3Ev"
netlify env:set STRIPE_PRICE_MINI_HVAC_T2 "price_1SXaQWD0VZDEkpOxOT2rRpMG"
netlify env:set STRIPE_PRICE_MINI_HVAC_T3 "price_1SXaQxD0VZDEkpOxHAL1nDVp"
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T1 "price_1SXaaGD0VZDEkpOxh24aucsH"
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T2 "price_1SXaalD0VZDEkpOxoMjYQnjh"
netlify env:set STRIPE_PRICE_SENSOR_HVAC_T3 "price_1SXaavD0VZDEkpOxzcGJzQF0"
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T1 "price_1SXad9D0VZDEkpOx4pilEBSj"
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T2 "price_1SXadXD0VZDEkpOxu4f1RoCv"
netlify env:set STRIPE_PRICE_BUNDLE_HVAC_T3 "price_1SXae6D0VZDEkpOxVBirLB2x"

# Property Manager Pricing (9 variables)
echo "Adding Property Manager pricing variables..."
netlify env:set STRIPE_PRICE_MINI_PM_T1 "price_1SXaRbD0VZDEkpOxYGJpvTnr"
netlify env:set STRIPE_PRICE_MINI_PM_T2 "price_1SXaRwD0VZDEkpOxJQMCeQxi"
netlify env:set STRIPE_PRICE_MINI_PM_T3 "price_1SXaVoD0VZDEkpOx8CHJhCng"
netlify env:set STRIPE_PRICE_SENSOR_PM_T1 "price_1SXabUD0VZDEkpOxO8HNVXnc"
netlify env:set STRIPE_PRICE_SENSOR_PM_T2 "price_1SXabyD0VZDEkpOxsLLkc0uT"
netlify env:set STRIPE_PRICE_SENSOR_PM_T3 "price_1SXacMD0VZDEkpOxd6SEemH9"
netlify env:set STRIPE_PRICE_BUNDLE_PM_T1 "price_1SXaeTD0VZDEkpOxXzbG8ZcU"
netlify env:set STRIPE_PRICE_BUNDLE_PM_T2 "price_1SXaelD0VZDEkpOxLWOlPIZ3"
netlify env:set STRIPE_PRICE_BUNDLE_PM_T3 "price_1SXafDD0VZDEkpOxlxQnrbyw"

echo ""
echo "✅ All 21 environment variables have been added!"
echo ""
echo "Next steps:"
echo "1. Verify the variables in Netlify Dashboard: Site settings → Environment variables"
echo "2. Redeploy your site to make the new variables available"
echo "3. Test the checkout flow to verify Price IDs are working"

