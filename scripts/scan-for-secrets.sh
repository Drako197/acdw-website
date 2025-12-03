#!/bin/bash

# Security Scan Script
# Scans the repository for potential secrets and sensitive information

set -e

echo "🔍 Scanning repository for secrets and sensitive information..."
echo "=============================================================="
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

FOUND_ISSUES=0

# Patterns to search for
PATTERNS=(
    "sk_test_[a-zA-Z0-9]{32,}"
    "sk_live_[a-zA-Z0-9]{32,}"
    "pk_test_[a-zA-Z0-9]{32,}"
    "pk_live_[a-zA-Z0-9]{32,}"
    "rk_test_[a-zA-Z0-9]{32,}"
    "rk_live_[a-zA-Z0-9]{32,}"
    "whsec_[a-zA-Z0-9]{32,}"
    "AIza[0-9A-Za-z_-]{35}"
    "AKIA[0-9A-Z]{16}"
    "amzn\.mws\.[0-9a-f]{32}"
    "ya29\.[0-9A-Za-z_-]+"
    "AIza[0-9A-Za-z_-]{35}"
    "-----BEGIN.*PRIVATE KEY-----"
    "-----BEGIN RSA PRIVATE KEY-----"
    "-----BEGIN DSA PRIVATE KEY-----"
    "-----BEGIN EC PRIVATE KEY-----"
    "-----BEGIN PGP PRIVATE KEY BLOCK-----"
    "password\s*=\s*['\"][^'\"]+['\"]"
    "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    "secret[_-]?key\s*=\s*['\"][^'\"]+['\"]"
    "access[_-]?token\s*=\s*['\"][^'\"]+['\"]"
)

# Files to exclude from scan
EXCLUDE_PATTERNS=(
    "node_modules"
    ".git"
    "dist"
    ".netlify"
    "*.log"
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
)

# Build exclude string for grep
EXCLUDE_STRING=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    EXCLUDE_STRING="$EXCLUDE_STRING --exclude-dir=$pattern --exclude=$pattern"
done

echo "Scanning for secret patterns..."
echo ""

for pattern in "${PATTERNS[@]}"; do
    echo -n "Checking pattern: $pattern ... "
    
    # Use grep to search (case insensitive, exclude common directories)
    RESULTS=$(grep -r -i -E "$pattern" . $EXCLUDE_STRING 2>/dev/null || true)
    
    if [ -n "$RESULTS" ]; then
        echo -e "${RED}⚠️  FOUND${NC}"
        echo "$RESULTS" | while IFS= read -r line; do
            echo -e "  ${YELLOW}→${NC} $line"
            FOUND_ISSUES=$((FOUND_ISSUES + 1))
        done
        echo ""
    else
        echo -e "${GREEN}✓${NC}"
    fi
done

echo ""
echo "=============================================================="
if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No secrets found in tracked files${NC}"
else
    echo -e "${RED}⚠️  Found $FOUND_ISSUES potential security issues${NC}"
    echo ""
    echo "Please review the findings above and:"
    echo "1. Remove any actual secrets from files"
    echo "2. Replace with placeholders"
    echo "3. Add files to .gitignore if needed"
    echo "4. Rotate any exposed keys"
fi
echo ""

