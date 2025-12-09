# 🧪 Testing the Init Blobs Stores Function

**Purpose:** Test that all Blobs stores are created successfully

---

## ⏱️ Step 1: Wait for Deployment

After pushing to GitHub, wait 2-3 minutes for Netlify to:
1. ✅ Detect the push
2. ✅ Build the site
3. ✅ Deploy functions
4. ✅ Make functions available

**Check deployment status:**
- Go to Netlify Dashboard → Deploys
- Look for the latest deploy (should show "Published" when ready)

---

## 🧪 Step 2: Test the Init Function

### Option A: Via Browser (Easiest)

1. Open your browser
2. Navigate to:
   ```
   https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
   ```
3. You should see JSON response with store creation status

### Option B: Via cURL (Command Line)

```bash
curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
```

### Option C: Via Netlify CLI

```bash
netlify functions:invoke init-blobs-stores --live
```

---

## ✅ Step 3: Expected Response

### Success Response (All Stores Created)

```json
{
  "success": true,
  "message": "All 3 stores initialized successfully",
  "stores": {
    "csrf-tokens": {
      "status": "created",
      "purpose": "CSRF token storage",
      "ttl": "15 minutes per token"
    },
    "bot-blacklist": {
      "status": "created",
      "purpose": "IP blacklist storage",
      "ttl": "24 hours per IP"
    },
    "behavioral-patterns": {
      "status": "created",
      "purpose": "Behavioral pattern tracking",
      "ttl": "1 hour per pattern"
    }
  },
  "nextSteps": [
    "1. Verify stores in Netlify Dashboard → Data & Storage → Blobs",
    "2. Stores will now appear in the UI and can be browsed/managed",
    "3. Your bot defense functions will now use persistent storage"
  ]
}
```

### Partial Success Response

```json
{
  "success": false,
  "message": "2/3 stores initialized successfully",
  "stores": {
    "csrf-tokens": { "status": "created", ... },
    "bot-blacklist": { "status": "error", "error": "..." },
    "behavioral-patterns": { "status": "created", ... }
  },
  "errors": [
    { "store": "bot-blacklist", "error": "..." }
  ]
}
```

### Error Response

```json
{
  "error": "Internal server error",
  "message": "...",
  "stack": "..." // Only in development
}
```

---

## 🔍 Step 4: Verify in Netlify Dashboard

1. **Go to Netlify Dashboard**
   - Navigate to your site
   - Click **Data & Storage** in left sidebar
   - Click **Blobs**

2. **Check for Stores**
   - You should see 3 stores:
     - `csrf-tokens`
     - `bot-blacklist`
     - `behavioral-patterns`

3. **Browse a Store** (Optional)
   - Click on a store name
   - You should see an empty list (init entries were deleted)
   - This confirms the store exists and is accessible

---

## 🐛 Troubleshooting

### Issue 1: Function Not Found (404)

**Problem:** `404 Not Found` when calling the function

**Solutions:**
1. Wait a few more minutes for deployment to complete
2. Check Netlify Dashboard → Deploys → Latest deploy status
3. Verify function exists: Netlify Dashboard → Functions → `init-blobs-stores`
4. Try again after deployment completes

### Issue 2: Package Not Found Error

**Problem:** `Cannot find module '@netlify/blobs'`

**Solutions:**
1. Check `package.json` includes `@netlify/blobs`
2. Verify Netlify build logs show package installation
3. Redeploy if package wasn't installed

### Issue 3: Store Creation Failed

**Problem:** One or more stores show `"status": "error"`

**Solutions:**
1. Check Netlify function logs for detailed error
2. Verify `@netlify/blobs` package is installed
3. Check if Blobs feature is enabled for your plan
4. Try running init function again

### Issue 4: Stores Not Appearing in Dashboard

**Problem:** Function succeeds but stores don't show in UI

**Solutions:**
1. Refresh the Blobs page
2. Wait 30-60 seconds (UI may take time to update)
3. Check Netlify function logs to confirm writes succeeded
4. Try running init function again

---

## ✅ Success Checklist

- [ ] Deployment completed successfully
- [ ] Init function returns `"success": true`
- [ ] All 3 stores show `"status": "created"`
- [ ] Stores appear in Netlify Dashboard → Data & Storage → Blobs
- [ ] Can browse stores in Dashboard (even if empty)

---

## 🎯 Next Steps After Success

1. ✅ **Stores are ready** - Bot defense functions can now use persistent storage
2. ✅ **Test CSRF tokens** - Try generating a token via `generate-csrf-token` function
3. ✅ **Test form submissions** - Forms will now use Blobs for storage
4. ✅ **Monitor logs** - Watch Netlify logs for Blobs access

---

## 📊 What Happens Next

Once stores are created:
- ✅ CSRF tokens will be stored in `csrf-tokens` store
- ✅ Blocked IPs will be stored in `bot-blacklist` store
- ✅ Behavioral patterns will be stored in `behavioral-patterns` store
- ✅ All data persists across deployments and cold starts
- ✅ Data automatically expires based on TTL settings

---

**Ready to test!** 🚀

