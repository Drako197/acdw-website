# Security Scripts

This directory contains scripts to help maintain security and manage secrets.

## Available Scripts

### 1. `scan-for-secrets.sh`
Scans the repository for potential secrets and sensitive information.

**Usage:**
```bash
./scripts/scan-for-secrets.sh
```

**What it does:**
- Scans all files for common secret patterns (API keys, private keys, etc.)
- Excludes node_modules, .git, and other build artifacts
- Reports any potential security issues

### 2. `rotate-clerk-keys.sh`
Helps rotate Clerk authentication keys and update Netlify environment variables.

**Usage:**
```bash
./scripts/rotate-clerk-keys.sh
```

**What it does:**
- Prompts for new Clerk keys
- Validates key formats
- Updates Netlify environment variables for all contexts
- Provides next steps for key rotation

**Requirements:**
- Netlify CLI installed (`npm install -g netlify-cli`)
- Netlify site linked (`netlify link`)

### 3. `clean-git-history.sh`
Removes secrets from git history using BFG Repo-Cleaner or git filter-branch.

**⚠️ WARNING: This rewrites git history!**

**Usage:**
```bash
./scripts/clean-git-history.sh
```

**What it does:**
- Creates a backup branch before cleanup
- Removes exposed secrets from entire git history
- Cleans up git references
- Provides instructions for force push

**Requirements:**
- BFG Repo-Cleaner (recommended): `brew install bfg` or download from https://rtyley.github.io/bfg-repo-cleaner/
- OR use built-in git filter-branch (slower)

**After running:**
1. Review changes: `git log`
2. Force push: `git push origin --force --all`
3. Notify team to re-clone repository

## Git Hooks

### Pre-commit Hook
A pre-commit hook has been installed at `.git/hooks/pre-commit` that:
- Automatically scans staged files for secrets before each commit
- Blocks commits if secrets are detected
- Provides helpful error messages

**The hook is automatically active** - no setup needed!

## Best Practices

1. **Never commit actual keys** - Always use placeholders
2. **Store secrets in environment variables** - Use Netlify Dashboard
3. **Run scan regularly** - Use `scan-for-secrets.sh` before major commits
4. **Rotate keys immediately** - If keys are exposed, rotate them right away
5. **Clean git history** - Use `clean-git-history.sh` if keys were committed

## Security Checklist

- [ ] All setup files use placeholders, not actual keys
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] Setup files with keys are in `.gitignore` (already done)
- [ ] Pre-commit hook is active (already installed)
- [ ] Exposed keys have been rotated
- [ ] Git history has been cleaned (if needed)

