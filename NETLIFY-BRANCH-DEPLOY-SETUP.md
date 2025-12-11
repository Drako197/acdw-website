# Netlify Branch Deploy Setup for Dev Branch

## Quick Setup Steps

### 1. Navigate to Netlify Dashboard
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **acdw-website** (or your site name)

### 2. Configure Branch Deploys
1. Go to: **Site configuration** → **Build & deploy** → **Continuous Deployment**
2. Scroll to **Branches and deploy contexts**
3. Click **Configure**

### 3. Enable Dev Branch Deploy
1. Under **Branch deploys**, select: **Let me add individual branches**
2. In the text field, enter: `Dev`
3. Click **Save**

### 4. Verify Setup
After saving, you should see:
- ✅ **Production branch**: `main` (deploys to production URL)
- ✅ **Branch deploys**: `Dev` (deploys to preview URL)

## Branch Deploy URLs

Once configured, each push to `Dev` will create a branch deploy:
- **Format**: `https://dev--[your-site-name].netlify.app`
- **Example**: `https://dev--acdw-website.netlify.app`

You can find the exact URL in:
- **Netlify Dashboard** → **Deploys** → Look for branch deploy with `Dev` label

## How It Works

### Automatic Deploys:
- **`main` branch** → Deploys to production URL (`https://www.acdrainwiz.com`)
- **`Dev` branch** → Deploys to preview URL (`https://dev--acdw-website.netlify.app`)

### Build Settings:
Both branches use the same build configuration from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20`

### Environment Variables:
- Branch deploys use the **same environment variables** as production
- This ensures testing matches production environment

## Testing Workflow

1. **Make changes** on `Dev` branch
2. **Push to `Dev`**: `git push origin Dev`
3. **Netlify automatically builds** and deploys to preview URL
4. **Test on preview URL** before creating PR
5. **Create PR** from `Dev` → `main` when ready
6. **Merge PR** to `main` for production deploy

## Benefits

✅ **Test before production**: Preview changes on a live URL  
✅ **Share with team**: Share preview URL for review  
✅ **Safe testing**: Test Stripe, forms, and integrations without affecting production  
✅ **Automatic**: No manual deploy needed, happens on every push  

## Troubleshooting

### Branch deploy not appearing?
- Check that `Dev` branch is listed in **Branches and deploy contexts**
- Verify you pushed to `origin/Dev` (not `origin/main`)
- Check **Deploys** tab for any build errors

### Build failing on Dev branch?
- Check build logs in Netlify Dashboard
- Verify `netlify.toml` configuration is correct
- Ensure all dependencies are in `package.json`

### Preview URL not working?
- Wait 2-3 minutes for build to complete
- Check build status in **Deploys** tab
- Verify environment variables are set correctly

## Reference

- [Netlify Branch Deploys Documentation](https://docs.netlify.com/deploy/deploy-types/branch-deploys/)
- [DEV-BRANCH-WORKFLOW.md](./DEV-BRANCH-WORKFLOW.md) - Full workflow documentation

