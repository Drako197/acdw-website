#!/bin/bash

# Script to update Stripe keys in Netlify environment variables
# Run this after you have the new Stripe account keys

echo "🔑 Updating Stripe keys in Netlify..."
echo ""

# New Stripe Keys (from new account)
# IMPORTANT: Replace these with your actual keys from the new Stripe account
STRIPE_SECRET_KEY="sk_test_xxxxx"  # Replace with your actual secret key
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"  # Replace with your actual publishable key

# Update Secret Key
echo "Updating STRIPE_SECRET_KEY..."
netlify env:set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"

# Update Publishable Key (if needed)
echo "Updating STRIPE_PUBLISHABLE_KEY..."
netlify env:set STRIPE_PUBLISHABLE_KEY "$STRIPE_PUBLISHABLE_KEY"

echo ""
echo "✅ Stripe keys updated!"
echo ""
echo "⚠️  NEXT STEPS:"
echo "1. Set up webhook in Stripe Dashboard"
echo "2. Get webhook secret and run: netlify env:set STRIPE_WEBHOOK_SECRET 'whsec_xxxxx'"
echo "3. Create products and Price IDs in new Stripe account"
echo "4. Update all 21 Price ID environment variables"
echo "5. Redeploy site to apply changes"
echo ""

