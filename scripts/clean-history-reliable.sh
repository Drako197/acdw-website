#!/bin/bash

# Reliable Git History Cleanup using git filter-branch with tree-filter
# This method is more reliable than index-filter

set -e

echo "🧹 Git History Cleanup"
echo "====================="
echo ""

# Secrets to remove
SECRET1="sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq"
SECRET2="pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA"

echo "⚠️  WARNING: This will rewrite git history!"
echo ""
echo "The following secrets will be removed from ALL git history:"
echo "   - ${SECRET1:0:20}... (truncated)"
echo "   - ${SECRET2:0:20}... (truncated)"
echo ""
echo "This will:"
echo "  1. Create a backup branch automatically"
echo "  2. Remove secrets from entire history (this may take 10-30 minutes)"
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

echo "Running git filter-branch to remove secrets..."
echo "⚠️  This may take 10-30 minutes depending on repository size..."
echo ""

# Set environment variable to suppress warning
export FILTER_BRANCH_SQUELCH_WARNING=1

# Use tree-filter which is more reliable
git filter-branch --force --tree-filter '
    find . -type f -not -path "./.git/*" -exec sed -i "" "s|sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq|REMOVED_SECRET|g" {} + 2>/dev/null || true
    find . -type f -not -path "./.git/*" -exec sed -i "" "s|pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA|REMOVED_SECRET|g" {} + 2>/dev/null || true
' --prune-empty --tag-name-filter cat -- --all

echo ""
echo "Cleaning up git references..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "=============================================="
echo "NEXT STEPS:"
echo "=============================================="
echo ""
echo "1. Verify secrets are removed:"
echo "   git log -S 'sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq' --all"
echo "   (Should return no results)"
echo ""
echo "2. Review the changes:"
echo "   git log --oneline --all | head -20"
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

