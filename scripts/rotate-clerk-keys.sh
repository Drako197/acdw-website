#!/bin/bash

# Clerk Keys Rotation Script
# This script helps you rotate Clerk keys and update environment variables

set -e

echo "🔐 Clerk Keys Rotation Helper"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI is not installed.${NC}"
    echo "Install it with: npm install -g netlify-cli"
    exit 1
fi

echo -e "${GREEN}✅ Netlify CLI found${NC}"
echo ""

# Prompt for new keys
echo "Enter your NEW Clerk keys from the Clerk Dashboard:"
echo ""
read -p "Publishable Key (pk_test_...): " NEW_PUBLISHABLE_KEY
read -p "Secret Key (sk_test_...): " NEW_SECRET_KEY

# Validate key formats
if [[ ! $NEW_PUBLISHABLE_KEY =~ ^pk_test_ ]] && [[ ! $NEW_PUBLISHABLE_KEY =~ ^pk_live_ ]]; then
    echo -e "${RED}❌ Invalid publishable key format. Should start with pk_test_ or pk_live_${NC}"
    exit 1
fi

if [[ ! $NEW_SECRET_KEY =~ ^sk_test_ ]] && [[ ! $NEW_SECRET_KEY =~ ^sk_live_ ]]; then
    echo -e "${RED}❌ Invalid secret key format. Should start with sk_test_ or sk_live_${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  WARNING: You are about to update Netlify environment variables.${NC}"
read -p "Continue? (y/N): " CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Updating Netlify environment variables..."

# Update publishable key
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "$NEW_PUBLISHABLE_KEY" --context production
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "$NEW_PUBLISHABLE_KEY" --context deploy-preview
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "$NEW_PUBLISHABLE_KEY" --context branch-deploy

# Update secret key
netlify env:set CLERK_SECRET_KEY "$NEW_SECRET_KEY" --context production
netlify env:set CLERK_SECRET_KEY "$NEW_SECRET_KEY" --context deploy-preview
netlify env:set CLERK_SECRET_KEY "$NEW_SECRET_KEY" --context branch-deploy

echo ""
echo -e "${GREEN}✅ Environment variables updated successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Revoke the old keys in Clerk Dashboard"
echo "2. Redeploy your site on Netlify"
echo "3. Test authentication to verify new keys work"
echo ""

