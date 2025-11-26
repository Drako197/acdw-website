#!/bin/bash

# Payment Flow Test Script
# Tests the get-price-id and create-checkout functions

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (change if testing production)
BASE_URL="${1:-http://localhost:8888}"

echo "🧪 Testing Payment Flow Functions"
echo "Base URL: $BASE_URL"
echo ""

# Test counter
PASSED=0
FAILED=0

# Function to test Price ID lookup
test_price_id() {
  local product=$1
  local quantity=$2
  local role=$3
  local expected_tier=$4
  local test_name=$5
  
  echo -n "Testing: $test_name... "
  
  response=$(curl -s -X POST "$BASE_URL/.netlify/functions/get-price-id" \
    -H "Content-Type: application/json" \
    -d "{\"product\":\"$product\",\"quantity\":$quantity,\"role\":\"$role\"}")
  
  if echo "$response" | grep -q "error"; then
    echo -e "${RED}FAILED${NC}"
    echo "  Error: $(echo "$response" | grep -o '"error":"[^"]*"')"
    ((FAILED++))
    return 1
  fi
  
  price_id=$(echo "$response" | grep -o '"priceId":"[^"]*"' | cut -d'"' -f4)
  tier=$(echo "$response" | grep -o '"tier":"[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$price_id" ]; then
    echo -e "${RED}FAILED${NC} - No Price ID returned"
    echo "  Response: $response"
    ((FAILED++))
    return 1
  fi
  
  if [ "$tier" != "$expected_tier" ]; then
    echo -e "${YELLOW}WARNING${NC} - Tier mismatch (expected: $expected_tier, got: $tier)"
  fi
  
  echo -e "${GREEN}PASSED${NC}"
  echo "  Price ID: $price_id"
  echo "  Tier: $tier"
  ((PASSED++))
  return 0
}

# Function to test checkout creation
test_checkout() {
  local price_id=$1
  local quantity=$2
  local product=$3
  local test_name=$4
  
  echo -n "Testing: $test_name... "
  
  response=$(curl -s -X POST "$BASE_URL/.netlify/functions/create-checkout" \
    -H "Content-Type: application/json" \
    -d "{\"priceId\":\"$price_id\",\"quantity\":$quantity,\"product\":\"$product\",\"userEmail\":\"test@example.com\",\"userId\":\"test_user\"}")
  
  if echo "$response" | grep -q "error"; then
    echo -e "${RED}FAILED${NC}"
    echo "  Error: $(echo "$response" | grep -o '"error":"[^"]*"')"
    ((FAILED++))
    return 1
  fi
  
  checkout_url=$(echo "$response" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  
  if [ -z "$checkout_url" ]; then
    echo -e "${RED}FAILED${NC} - No checkout URL returned"
    echo "  Response: $response"
    ((FAILED++))
    return 1
  fi
  
  echo -e "${GREEN}PASSED${NC}"
  echo "  Checkout URL: $checkout_url"
  ((PASSED++))
  return 0
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Testing Price ID Lookup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Homeowner tests
echo "Homeowner Tests:"
test_price_id "mini" 1 "homeowner" "msrp" "Homeowner - Mini"
test_price_id "sensor" 1 "homeowner" "msrp" "Homeowner - Sensor"
test_price_id "bundle" 1 "homeowner" "msrp" "Homeowner - Bundle"
echo ""

# HVAC Pro tests
echo "HVAC Pro Tests:"
test_price_id "mini" 10 "hvac_pro" "tier_1" "HVAC Pro - Mini Tier 1 (10 units)"
test_price_id "mini" 50 "hvac_pro" "tier_2" "HVAC Pro - Mini Tier 2 (50 units)"
test_price_id "mini" 200 "hvac_pro" "tier_3" "HVAC Pro - Mini Tier 3 (200 units)"
test_price_id "sensor" 5 "hvac_pro" "tier_1" "HVAC Pro - Sensor Tier 1 (5 units)"
test_price_id "sensor" 75 "hvac_pro" "tier_2" "HVAC Pro - Sensor Tier 2 (75 units)"
test_price_id "sensor" 300 "hvac_pro" "tier_3" "HVAC Pro - Sensor Tier 3 (300 units)"
test_price_id "bundle" 15 "hvac_pro" "tier_1" "HVAC Pro - Bundle Tier 1 (15 units)"
test_price_id "bundle" 80 "hvac_pro" "tier_2" "HVAC Pro - Bundle Tier 2 (80 units)"
test_price_id "bundle" 400 "hvac_pro" "tier_3" "HVAC Pro - Bundle Tier 3 (400 units)"
echo ""

# Property Manager tests
echo "Property Manager Tests:"
test_price_id "mini" 8 "property_manager" "tier_1" "Property Manager - Mini Tier 1 (8 units)"
test_price_id "mini" 60 "property_manager" "tier_2" "Property Manager - Mini Tier 2 (60 units)"
test_price_id "mini" 250 "property_manager" "tier_3" "Property Manager - Mini Tier 3 (250 units)"
echo ""

# Edge cases
echo "Edge Cases:"
echo -n "Testing: Invalid quantity (0)... "
response=$(curl -s -X POST "$BASE_URL/.netlify/functions/get-price-id" \
  -H "Content-Type: application/json" \
  -d '{"product":"mini","quantity":0,"role":"hvac_pro"}')
if echo "$response" | grep -q "error"; then
  echo -e "${GREEN}PASSED${NC}"
  ((PASSED++))
else
  echo -e "${RED}FAILED${NC} - Should reject quantity 0"
  ((FAILED++))
fi

echo -n "Testing: Quantity > 500... "
response=$(curl -s -X POST "$BASE_URL/.netlify/functions/get-price-id" \
  -H "Content-Type: application/json" \
  -d '{"product":"mini","quantity":600,"role":"hvac_pro"}')
if echo "$response" | grep -q "requiresContact\|error"; then
  echo -e "${GREEN}PASSED${NC}"
  ((PASSED++))
else
  echo -e "${RED}FAILED${NC} - Should reject quantity > 500"
  ((FAILED++))
fi

echo -n "Testing: Invalid product... "
response=$(curl -s -X POST "$BASE_URL/.netlify/functions/get-price-id" \
  -H "Content-Type: application/json" \
  -d '{"product":"invalid","quantity":10,"role":"hvac_pro"}')
if echo "$response" | grep -q "error"; then
  echo -e "${GREEN}PASSED${NC}"
  ((PASSED++))
else
  echo -e "${RED}FAILED${NC} - Should reject invalid product"
  ((FAILED++))
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Testing Checkout Session Creation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get a valid Price ID first
echo "Getting a valid Price ID for testing..."
price_response=$(curl -s -X POST "$BASE_URL/.netlify/functions/get-price-id" \
  -H "Content-Type: application/json" \
  -d '{"product":"mini","quantity":10,"role":"hvac_pro"}')

price_id=$(echo "$price_response" | grep -o '"priceId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$price_id" ]; then
  echo -e "${RED}ERROR: Could not get Price ID. Cannot test checkout creation.${NC}"
  echo "Price ID response: $price_response"
else
  echo "Using Price ID: $price_id"
  echo ""
  
  test_checkout "$price_id" 10 "mini" "Create checkout session"
  
  # Test invalid Price ID
  echo -n "Testing: Invalid Price ID... "
  response=$(curl -s -X POST "$BASE_URL/.netlify/functions/create-checkout" \
    -H "Content-Type: application/json" \
    -d '{"priceId":"price_invalid","quantity":10,"product":"mini","userEmail":"test@example.com","userId":"test"}')
  if echo "$response" | grep -q "error"; then
    echo -e "${GREEN}PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}FAILED${NC} - Should reject invalid Price ID"
    ((FAILED++))
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
  exit 1
fi

