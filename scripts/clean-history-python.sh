#!/bin/bash

# Git History Cleanup using Python (more reliable for text replacement)

set -e

echo "🧹 Git History Cleanup with Python"
echo "==================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    exit 1
fi

echo "✅ Python 3 found"
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

echo "Creating Python replacement script..."
PYTHON_SCRIPT=$(mktemp)
cat > "$PYTHON_SCRIPT" << 'PYEOF'
import sys
import os

SECRET1 = "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq"
SECRET2 = "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA"

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        content = content.replace(SECRET1, "REMOVED_SECRET")
        content = content.replace(SECRET2, "REMOVED_SECRET")
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception:
        return False

# Process all files in current directory
changed = False
for root, dirs, files in os.walk('.'):
    # Skip .git directory
    if '.git' in root:
        continue
    
    for file in files:
        filepath = os.path.join(root, file)
        if replace_in_file(filepath):
            changed = True

sys.exit(0)
PYEOF

echo "Running git filter-branch with Python replacement..."
export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch --force --tree-filter "python3 $PYTHON_SCRIPT" --prune-empty --tag-name-filter cat -- --all

rm "$PYTHON_SCRIPT"

echo ""
echo "Cleaning up git references..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Verifying secrets are removed..."
if git log -S "$SECRET1" --all --oneline | head -1; then
    echo "⚠️  Warning: Some instances may still exist. Check manually."
else
    echo "✅ Secret 1 removed from history"
fi

if git log -S "$SECRET2" --all --oneline | head -1; then
    echo "⚠️  Warning: Some instances may still exist. Check manually."
else
    echo "✅ Secret 2 removed from history"
fi

echo ""
echo "=============================================="
echo "NEXT STEPS:"
echo "=============================================="
echo ""
echo "1. Review the changes:"
echo "   git log --oneline --all | head -20"
echo ""
echo "2. Force push to remote (⚠️  coordinate with team first!):"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""

