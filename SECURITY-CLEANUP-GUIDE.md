# Git History Cleanup Guide

## ✅ Pre-commit Hook Status
**Status:** ✅ Working and tested
- Successfully blocks commits with secrets
- Scans for Stripe keys, Clerk keys, private keys, etc.

## 🔍 Found Secrets in History
The following commits contain exposed keys:
- `4a40e5f` - Remove @clerk/clerk-sdk-node
- `e7600ed` - Add checkout success/cancel pages

## 🧹 Cleanup Options

### Option 1: Use Reliable Script (Recommended)
```bash
./scripts/clean-history-reliable.sh
```

This uses `git filter-branch` with `tree-filter` which is more reliable.

**Time:** 10-30 minutes

### Option 2: Manual Cleanup
If the script doesn't work, you can manually run:

```bash
# Create backup
git branch backup-before-cleanup-$(date +%Y%m%d)

# Set warning suppression
export FILTER_BRANCH_SQUELCH_WARNING=1

# Run filter-branch
git filter-branch --force --tree-filter '
    find . -type f -not -path "./.git/*" -exec sed -i "" "s|sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq|REMOVED_SECRET|g" {} + 2>/dev/null || true
    find . -type f -not -path "./.git/*" -exec sed -i "" "s|pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA|REMOVED_SECRET|g" {} + 2>/dev/null || true
' --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Option 3: Use git-filter-repo (Best, but requires installation)
```bash
# Install git-filter-repo
pip3 install git-filter-repo

# Run cleanup
git filter-repo --replace-text <(echo "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq==>REMOVED_SECRET")
git filter-repo --replace-text <(echo "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA==>REMOVED_SECRET")
```

## ⚠️ Important Notes

1. **Coordinate with team** - Everyone must re-clone after cleanup
2. **Force push required** - `git push origin --force --all`
3. **Backup created** - Script automatically creates backup branch
4. **Keys already rotated** - Old keys are inactive, cleanup is optional

## Current Status

- ✅ Pre-commit hook: Working
- ✅ Keys rotated: Done
- ✅ Files protected: Done
- ⏳ Git history: Ready to clean (optional since keys are rotated)

**Recommendation:** Since keys are already rotated and inactive, cleaning git history is optional but recommended for best practices.

