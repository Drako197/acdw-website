# Dev Branch Workflow

## Overview

This project uses a **two-branch workflow**:
- **`main`**: Production branch (protected, only human admins can merge)
- **`Dev`**: Development branch (all development work happens here)

## Workflow Rules

### ✅ What AI Can Do:
- Always work on the `Dev` branch
- Push to `origin/Dev` only
- Create commits with clear, descriptive messages
- Create todos and track work as normal

### ❌ What AI Cannot Do:
- **Never push to `origin/main`**
- **Never merge to `main`**
- **Never work directly on `main` branch**

### 🔄 Human Admin Process:
1. AI completes work on `Dev` branch
2. Human admin reviews changes
3. Human admin creates Pull Request (PR) from `Dev` → `main`
4. Human admin reviews and merges PR to `main`
5. `main` branch deploys to production

## Branch Setup

### Current Branch:
```bash
git branch --show-current
# Should show: Dev
```

### Switching to Dev Branch:
```bash
git checkout Dev
# or if branch doesn't exist locally:
git checkout -b Dev origin/Dev
```

### Pushing to Dev:
```bash
git push origin Dev
```

## Netlify Branch Deploys

The `Dev` branch is configured for branch deploys in Netlify, allowing you to:
- Test changes before merging to `main`
- Preview the development site
- Share preview URLs with team members

### Branch Deploy URL:
- Format: `https://dev--acdw-website.netlify.app` (or similar)
- Check Netlify Dashboard → Deploys → Branch deploys

### Setting Up Branch Deploys (One-Time Setup):

1. Go to **Netlify Dashboard** → Your Site
2. Navigate to: **Site configuration** → **Build & deploy** → **Continuous Deployment** → **Branches and deploy contexts**
3. Click **Configure**
4. Under **Branch deploys**, select:
   - **Let me add individual branches**
   - Enter: `Dev`
   - Click **Save**

### Branch Deploy Settings:
- **Build command**: `npm run build` (from `netlify.toml`)
- **Publish directory**: `dist` (from `netlify.toml`)
- **Environment variables**: Same as production (shared across all branches)

## Commit Message Guidelines

Use clear, descriptive commit messages:
- ✅ `✅ Add email collection to checkout form`
- ✅ `🔧 Fix spacebar input issue in checkout form`
- ✅ `📋 Update Stripe Tax implementation`
- ❌ `fix` (too vague)
- ❌ `update` (not descriptive)

## Verification Checklist

Before starting work, verify:
- [ ] Currently on `Dev` branch (`git branch --show-current`)
- [ ] Local `Dev` is up to date (`git pull origin Dev`)
- [ ] No uncommitted changes (`git status`)

Before pushing, verify:
- [ ] Still on `Dev` branch
- [ ] Pushing to `origin/Dev` (not `origin/main`)
- [ ] Commit message is clear and descriptive

## Troubleshooting

### "I'm on the wrong branch"
```bash
git checkout Dev
```

### "I accidentally pushed to main"
- **STOP immediately**
- Inform human admin
- Do not attempt to fix (human admin will handle)

### "Dev branch is behind main"
```bash
git checkout Dev
git pull origin Dev
# If needed, human admin will merge main → Dev
```

## Notes

- All development work happens on `Dev`
- Production deploys only from `main`
- Branch deploys allow testing before production
- Human admins control all merges to `main`

