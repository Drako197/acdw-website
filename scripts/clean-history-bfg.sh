#!/bin/bash

# Git History Cleanup using BFG Repo-Cleaner
# This is the recommended method - faster and safer than filter-branch

set -e

echo "🧹 Git History Cleanup with BFG Repo-Cleaner"
echo "============================================="
echo ""

# Check if BFG is installed
if ! command -v bfg &> /dev/null; then
    echo "❌ BFG Repo-Cleaner is not installed."
    echo ""
    echo "Install it with one of these methods:"
    echo ""
    echo "Option 1: Homebrew (macOS):"
    echo "  brew install bfg"
    echo ""
    echo "Option 2: Download JAR file:"
    echo "  1. Go to: https://rtyley.github.io/bfg-repo-cleaner/"
    echo "  2. Download bfg-1.14.0.jar"
    echo "  3. Place it in this directory"
    echo ""
    echo "Option 3: Use git filter-branch instead:"
    echo "  ./scripts/clean-history-filter-branch.sh"
    echo ""
    exit 1
fi

echo "✅ BFG Repo-Cleaner found"
echo ""

# Secrets to remove
EXPOSED_SECRETS=(
    "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq"
    "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA"
)

echo "⚠️  WARNING: This will rewrite git history!"
echo ""
echo "The following secrets will be removed from ALL git history:"
for secret in "${EXPOSED_SECRETS[@]}"; do
    echo "   - ${secret:0:20}... (truncated)"
done
echo ""
echo "This will:"
echo "  1. Create a backup branch automatically"
echo "  2. Remove secrets from entire history"
echo "  3. Require force push to update remote"
echo "  4. Require team members to re-clone"
echo ""

read -p "Continue? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Creating backup branch..."
BACKUP_BRANCH="backup-before-cleanup-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "✅ Backup created: $BACKUP_BRANCH"
echo ""

# Create a file with secrets to remove
SECRETS_FILE=$(mktemp)
for secret in "${EXPOSED_SECRETS[@]}"; do
    echo "$secret==>REMOVED" >> "$SECRETS_FILE"
done

echo "Running BFG to remove secrets from history..."
echo "This may take a few minutes..."
bfg --replace-text "$SECRETS_FILE"

echo ""
echo "Cleaning up git references..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

rm "$SECRETS_FILE"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "=============================================="
echo "NEXT STEPS:"
echo "=============================================="
echo ""
echo "1. Review the changes:"
echo "   git log --all"
echo ""
echo "2. Verify secrets are removed:"
echo "   git log -S 'sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq' --all"
echo "   (Should return no results)"
echo ""
echo "3. Force push to remote (⚠️  coordinate with team first!):"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""
echo "4. Notify your team:"
echo "   - They must delete their local repository"
echo "   - Re-clone from remote"
echo "   - Do NOT try to pull/merge (will cause conflicts)"
echo ""
echo "5. Optional - Delete backup branch after verification:"
echo "   git branch -D $BACKUP_BRANCH"
echo ""

