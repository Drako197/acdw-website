#!/bin/bash

# Git History Cleanup using git filter-branch
# This is the built-in method (slower but doesn't require BFG)

set -e

echo "🧹 Git History Cleanup with git filter-branch"
echo "=============================================="
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

# Build the filter command
FILTER_SCRIPT=$(mktemp)
cat > "$FILTER_SCRIPT" << 'EOF'
#!/bin/bash
# This script replaces secrets in file content
EXPOSED_SECRETS=(
    "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq"
    "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA"
)

# Read file content
CONTENT=$(cat)

# Replace each secret
for secret in "${EXPOSED_SECRETS[@]}"; do
    CONTENT=$(echo "$CONTENT" | sed "s|$secret|REMOVED_SECRET|g")
done

# Output modified content
echo "$CONTENT"
EOF

chmod +x "$FILTER_SCRIPT"

# Run filter-branch
git filter-branch --force --tree-filter '
    for file in $(git ls-files); do
        if [ -f "$file" ]; then
            '"$FILTER_SCRIPT"' < "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
' --prune-empty --tag-name-filter cat -- --all

rm "$FILTER_SCRIPT"

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

