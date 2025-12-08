#!/bin/bash

# 🧪 Bot Detection Test Script
# This script simulates various bot attack patterns to verify they're blocked

echo "🧪 Testing Bot Detection on ACDW Website"
echo "=========================================="
echo ""

PROD_URL="https://www.acdrainwiz.com/.netlify/functions/validate-form-submission"
TEST_EMAIL="bot-test@example.com"

echo "Test 1: Bot User-Agent (curl) - Should be BLOCKED"
echo "---------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "form-name=unsubscribe&email=$TEST_EMAIL&reason=too-many-emails" \
  | jq '.'
echo ""
echo "Expected: 200 OK with 'success: true' (honeypot response)"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Test 2: Bot with Python User-Agent - Should be BLOCKED"
echo "-------------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: python-requests/2.28.1" \
  -d "form-name=unsubscribe&email=$TEST_EMAIL&reason=not-relevant" \
  | jq '.'
echo ""
echo "Expected: 200 OK with 'success: true' (honeypot response)"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Test 3: Bot with No Origin Header - Should be BLOCKED"
echo "------------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -d "form-name=unsubscribe&email=$TEST_EMAIL&reason=other" \
  | jq '.'
echo ""
echo "Expected: 200 OK with 'success: true' (honeypot response)"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Test 4: Bot with Invalid Origin - Should be BLOCKED"
echo "----------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Origin: https://evil-site.com" \
  -d "form-name=unsubscribe&email=$TEST_EMAIL&reason=other" \
  | jq '.'
echo ""
echo "Expected: 200 OK with 'success: true' (honeypot response)"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Test 5: Malformed Email Pattern - Should be BLOCKED"
echo "----------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Origin: https://www.acdrainwiz.com" \
  -d "form-name=unsubscribe&email=rsummersacdrainwiz-com&reason=other" \
  | jq '.'
echo ""
echo "Expected: 400 Bad Request with validation error"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Test 6: Malformed Email in Reason Field - Should be BLOCKED"
echo "------------------------------------------------------------"
curl -s -X POST "$PROD_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Origin: https://www.acdrainwiz.com" \
  -d "form-name=unsubscribe&email=$TEST_EMAIL&reason=lucaslealbritogmail-com" \
  | jq '.'
echo ""
echo "Expected: 400 Bad Request with 'Invalid reason selected - suspicious pattern detected'"
echo "Result: Form should NOT appear in Netlify Forms"
echo ""

echo ""
echo "🎯 Testing Complete!"
echo "===================="
echo ""
echo "Next Steps:"
echo "1. Check Netlify Dashboard → Functions → validate-form-submission"
echo "2. Look for bot detection logs (🚫 Bot detected messages)"
echo "3. Verify NO test submissions appear in Netlify Forms"
echo "4. All 6 tests should be BLOCKED (not appear in Forms)"
echo ""
echo "If any tests appear in Netlify Forms, that's a security gap!"

