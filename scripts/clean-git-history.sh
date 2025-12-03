#!/bin/bash

# Git History Cleanup Script
# Removes secrets from git history using BFG Repo-Cleaner or git filter-branch

set -e

echo "🧹 Git History Cleanup"
echo "====================="
echo ""
echo "This script will help remove secrets from git history."
echo ""
echo -e "\033[1;33m⚠️  WARNING: This will rewrite git history!\033[0m"
echo "Make sure you:"
echo "1. Have a backup of your repository"
echo "2. Coordinate with your team (they'll need to re-clone)"
echo "3. Force push will be required after cleanup"
echo ""

read -p "Continue? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Choose cleanup method:"
echo "1. BFG Repo-Cleaner (recommended - faster)"
echo "2. git filter-branch (built-in, slower)"
echo ""
read -p "Enter choice (1 or 2): " METHOD

# Secrets to remove (add the actual exposed keys here)
# NOTE: These are the old exposed keys - update if you have new ones to remove
EXPOSED_SECRETS=(
    "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq"
    "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA"
)

echo "⚠️  The following secrets will be removed from git history:"
for secret in "${EXPOSED_SECRETS[@]}"; do
    echo "   - ${secret:0:20}... (truncated for security)"
done
echo ""

if [ "$METHOD" = "1" ]; then
    # BFG Repo-Cleaner method
    echo ""
    echo "Using BFG Repo-Cleaner..."
    
    # Check if BFG is installed
    if ! command -v bfg &> /dev/null; then
        echo "BFG Repo-Cleaner is not installed."
        echo "Install it with: brew install bfg (macOS) or download from https://rtyley.github.io/bfg-repo-cleaner/"
        exit 1
    fi
    
    # Create a file with secrets to remove
    SECRETS_FILE=$(mktemp)
    for secret in "${EXPOSED_SECRETS[@]}"; do
        echo "$secret" >> "$SECRETS_FILE"
    done
    
    echo "Creating backup branch..."
    git branch backup-before-cleanup-$(date +%Y%m%d-%H%M%S)
    
    echo "Running BFG to remove secrets..."
    bfg --replace-text "$SECRETS_FILE"
    
    echo "Cleaning up..."
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    rm "$SECRETS_FILE"
    
    echo ""
    echo -e "\033[1;32m✅ Cleanup complete!\033[0m"
    echo ""
    echo "Next steps:"
    echo "1. Review the changes: git log"
    echo "2. Force push: git push origin --force --all"
    echo "3. Notify your team to re-clone the repository"
    
elif [ "$METHOD" = "2" ]; then
    # git filter-branch method
    echo ""
    echo "Using git filter-branch..."
    
    echo "Creating backup branch..."
    git branch backup-before-cleanup-$(date +%Y%m%d-%H%M%S)
    
    # Build filter-branch command
    FILTER_CMD="git filter-branch --force --index-filter "
    
    for secret in "${EXPOSED_SECRETS[@]}"; do
        FILTER_CMD+="'git rm --cached --ignore-unmatch -r .' "
    done
    
    FILTER_CMD+="--prune-empty --tag-name-filter cat -- --all"
    
    echo "Running filter-branch (this may take a while)..."
    eval "$FILTER_CMD"
    
    echo "Cleaning up..."
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    echo ""
    echo -e "\033[1;32m✅ Cleanup complete!\033[0m"
    echo ""
    echo "Next steps:"
    echo "1. Review the changes: git log"
    echo "2. Force push: git push origin --force --all"
    echo "3. Notify your team to re-clone the repository"
    
else
    echo "Invalid choice."
    exit 1
fi

