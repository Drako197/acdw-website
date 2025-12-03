#!/bin/bash

# Simplified Git History Cleanup
# Uses git filter-repo (if available) or git filter-branch

set -e

echo "🧹 Git History Cleanup"
echo "====================="
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

echo "Running git filter-branch to remove secrets..."
echo "⚠️  This may take 10-30 minutes depending on repository size..."
echo ""

# Use git filter-branch with sed to replace secrets
git filter-branch --force --index-filter '
    git ls-files -s | sed "s/\t.*//" | 
    git update-index --index-info &&
    git ls-files | xargs -I {} sh -c "
        if [ -f \"{}\" ]; then
            sed -i.bak \"s|sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq|REMOVED_SECRET|g\" \"{}\" &&
            sed -i.bak \"s|pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA|REMOVED_SECRET|g\" \"{}\" &&
            rm -f \"{}.bak\" 2>/dev/null || true
        fi
    "
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

