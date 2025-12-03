# Git History Cleanup Instructions

## Status
✅ Pre-commit hook tested and working
✅ Found old keys in git history (commits: 4a40e5f, e7600ed)

## Option 1: BFG Repo-Cleaner (Recommended - Faster)

### Install BFG
```bash
# macOS
brew install bfg

# Or download JAR from:
# https://rtyley.github.io/bfg-repo-cleaner/
```

### Run Cleanup
```bash
./scripts/clean-history-bfg.sh
```

**Time:** ~2-5 minutes

---

## Option 2: git filter-branch (Built-in - Slower)

### Run Cleanup
```bash
./scripts/clean-history-filter-branch.sh
```

**Time:** ~10-30 minutes (depending on repo size)

---

## After Cleanup

### 1. Verify Secrets Are Removed
```bash
# Should return no results
git log -S "sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq" --all
git log -S "pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA" --all
```

### 2. Review Changes
```bash
git log --oneline --all | head -20
```

### 3. Force Push (⚠️ Coordinate with team first!)
```bash
git push origin --force --all
git push origin --force --tags
```

### 4. Notify Team
- Everyone must delete their local repository
- Re-clone from remote: `git clone <repo-url>`
- **DO NOT** try to pull/merge (will cause conflicts)

---

## Current Status

- ✅ Pre-commit hook: Working
- ✅ Keys rotated: Done
- ⏳ Git history: Ready to clean (choose method above)

