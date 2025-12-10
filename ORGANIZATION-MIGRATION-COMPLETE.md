# Organization Migration - Configuration Update Guide

**Date:** January 2025  
**Status:** ✅ Repository transferred to organization  
**New URL:** https://github.com/acdrainwiz/acdw-website

---

## ✅ What's Been Updated

### 1. Git Remote URL ✅

**Updated:**
- **Old:** `https://github.com/Drako197/acdw-website.git`
- **New:** `https://github.com/acdrainwiz/acdw-website.git`

**Verification:**
```bash
git remote -v
# Should show: origin https://github.com/acdrainwiz/acdw-website.git
```

---

## 🔧 What You Need to Update

### 1. Netlify Repository Connection (REQUIRED)

**Why:** Netlify needs to reconnect to the new organization repository

**Steps:**

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com
   - Select your site

2. **Update Repository:**
   - Go to **Site Settings** → **Build & Deploy** → **Continuous Deployment**
   - Click **Link to a different repository** (or **Edit settings**)
   - Click **Change repository**
   - Search for: `acdrainwiz/acdw-website`
   - Select the repository
   - Click **Save**

3. **Re-authorize (if needed):**
   - If prompted, authorize Netlify to access the `acdrainwiz` organization
   - Grant necessary permissions
   - Confirm connection

4. **Verify Settings:**
   - **Production branch:** `main` (should be unchanged)
   - **Build command:** `npm run build` (should be unchanged)
   - **Publish directory:** `dist` (should be unchanged)

5. **Test Deployment:**
   - Make a small change (or trigger rebuild)
   - Verify deployment works
   - Check build logs for any errors

---

### 2. GitHub Actions (If Using)

**Check:**
- Go to repository: https://github.com/acdrainwiz/acdw-website
- Click **Actions** tab
- Verify workflows still work (if any exist)

**Usually:** Works automatically, but verify after first push

---

### 3. Other Integrations (If Any)

**Check these services:**
- ✅ **Zapier** - Update repository URL if using GitHub integration
- ✅ **Code Climate** - Update repository connection
- ✅ **Coverage services** - Update repository URL
- ✅ **CI/CD services** - Update repository connection
- ✅ **Monitoring tools** - Update repository URL

**How to find integrations:**
- Check GitHub repository → **Settings** → **Integrations**
- Check each service's dashboard for repository connections

---

## 🧪 Testing Checklist

### Test 1: Git Push ✅

```bash
# Test push (dry run first)
git push origin main --dry-run

# If successful, do actual push
git push origin main
```

**Expected:** Push succeeds without errors

---

### Test 2: Netlify Deployment ✅

1. Make a small change (e.g., update README)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test: Verify organization migration"
   git push origin main
   ```
3. Check Netlify Dashboard:
   - Should trigger new deployment
   - Should build successfully
   - Should deploy to production

**Expected:** Deployment triggers and completes successfully

---

### Test 3: Verify Repository Access ✅

1. Go to: https://github.com/acdrainwiz/acdw-website
2. Verify you can:
   - ✅ View code
   - ✅ Edit files (if needed)
   - ✅ See commit history
   - ✅ Access settings

**Expected:** Full access as organization admin

---

## 📋 Complete Update Checklist

### Git Configuration
- [x] Update git remote URL
- [ ] Test git push (verify access)
- [ ] Verify all branches are accessible

### Netlify Configuration
- [ ] Update repository connection in Netlify Dashboard
- [ ] Re-authorize Netlify to access organization
- [ ] Verify build settings (unchanged)
- [ ] Test deployment (trigger rebuild)
- [ ] Verify environment variables (should be unchanged)

### GitHub Organization
- [x] Repository transferred
- [x] You're admin of organization
- [ ] Verify team members have access (if any)
- [ ] Check organization settings

### Other Integrations
- [ ] Update Zapier (if using GitHub integration)
- [ ] Update any CI/CD services
- [ ] Update monitoring tools
- [ ] Update code quality tools

### Documentation
- [ ] Update any internal docs with new URL
- [ ] Update README if it references old URL
- [ ] Update team documentation

---

## 🔍 Verification Commands

### Check Git Remote
```bash
git remote -v
# Should show: origin https://github.com/acdrainwiz/acdw-website.git
```

### Test Push Access
```bash
git push origin main --dry-run
# Should show: "Everything up-to-date" or list files to push
```

### Check Repository Status
```bash
git status
# Should show clean working tree or current changes
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Permission Denied on Push

**Symptoms:**
```
error: Permission denied (publickey)
or
error: Authentication failed
```

**Solution:**
1. **Check organization permissions:**
   - Go to https://github.com/acdrainwiz
   - Settings → Members
   - Verify you're listed as Owner/Admin

2. **Verify authentication:**
   - If using SSH: Check key is added to your GitHub account
   - If using HTTPS: Check Personal Access Token has `repo` scope

3. **Re-authenticate if needed:**
   ```bash
   # For HTTPS
   git remote set-url origin https://github.com/acdrainwiz/acdw-website.git
   # Will prompt for credentials/token
   ```

---

### Issue 2: Netlify Can't Access Repository

**Symptoms:**
- Netlify shows "Repository not found"
- Build fails with authentication error

**Solution:**
1. **Reconnect repository:**
   - Netlify Dashboard → Site Settings → Build & Deploy
   - Click "Link to a different repository"
   - Select `acdrainwiz/acdw-website`

2. **Authorize organization:**
   - When prompted, authorize Netlify to access `acdrainwiz` organization
   - Grant necessary permissions

3. **Verify connection:**
   - Check repository shows correctly in Netlify
   - Trigger test deployment

---

### Issue 3: Environment Variables Missing

**Symptoms:**
- Build fails with "Environment variable not found"
- Functions can't access env vars

**Solution:**
1. **Check Netlify environment variables:**
   - Site Settings → Environment Variables
   - All variables should still be there (they persist through transfer)

2. **Verify scope:**
   - Check if variables are set for correct environment (Production/Deploy Preview)

3. **Re-add if missing:**
   - Add any missing variables
   - Redeploy

**Note:** Environment variables should persist, but verify they're all there!

---

## 📊 Current Status

### ✅ Completed
- [x] Repository transferred to organization
- [x] Git remote URL updated locally
- [x] You're admin of organization

### ⏳ Pending
- [ ] Netlify repository reconnection
- [ ] Test deployment
- [ ] Verify all integrations

---

## 🎯 Next Steps

1. **Update Netlify** (5 minutes)
   - Reconnect repository
   - Re-authorize organization access
   - Test deployment

2. **Test Git Push** (1 minute)
   ```bash
   git push origin main
   ```

3. **Verify Everything Works** (5 minutes)
   - Check Netlify deployment
   - Verify site is live
   - Test a form submission

---

## 📝 Summary

**What Changed:**
- Repository URL: `github.com/Drako197/acdw-website` → `github.com/acdrainwiz/acdw-website`
- Git remote updated locally ✅
- Repository ownership: Personal → Organization

**What Needs Updating:**
- Netlify repository connection (required)
- Any other integrations (if applicable)

**What Stays the Same:**
- All code and history
- All branches
- Environment variables (should persist)
- Build settings
- Deployment configuration

---

**Ready to update Netlify?** Follow the steps in section 1 above, then test deployment!

