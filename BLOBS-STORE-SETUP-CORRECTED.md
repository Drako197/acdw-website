# 🗄️ Netlify Blobs Store Setup (Corrected Instructions)

**Date:** December 8, 2025  
**Status:** ✅ Corrected based on official Netlify documentation

---

## ⚠️ Important Correction

**You CANNOT create Blobs stores via the Netlify Dashboard UI.**

Stores are created automatically when you first write to them using code. The UI is only for:
- ✅ Browsing existing stores
- ✅ Viewing keys and values
- ✅ Downloading blobs
- ✅ Deleting entries or stores
- ❌ **NOT for creating stores**

---

## ✅ Correct Setup Process

### Step 1: Deploy Your Code

Deploy the bot defense code to Netlify. The stores will be created automatically when the functions first write to them.

### Step 2: Initialize Stores (One-Time)

After deployment, run the initialization function to create all stores at once:

**Option A: Via Browser**
```
https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
```

**Option B: Via cURL**
```bash
curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
```

**Option C: Via Netlify CLI**
```bash
netlify functions:invoke init-blobs-stores
```

### Step 3: Verify in Dashboard

1. Go to **Netlify Dashboard** → Your Site
2. Navigate to **Data & Storage** → **Blobs**
3. You should see your stores listed:
   - `csrf-tokens`
   - `bot-blacklist`
   - `behavioral-patterns`

### Step 4: Browse Stores (Optional)

Click on any store name to:
- View all keys in that store
- Download blob values
- Delete individual entries
- Delete the entire store

---

## 🔧 How It Works

### Automatic Store Creation

When your code calls:
```javascript
const store = getStore('csrf-tokens')
await store.set('some-key', 'some-value')
```

Netlify automatically:
1. ✅ Creates the `csrf-tokens` store (if it doesn't exist)
2. ✅ Stores the key-value pair
3. ✅ Makes the store visible in the Dashboard UI

### What the Init Function Does

The `init-blobs-stores.js` function:
1. Creates each store by writing a temporary `__init__` entry
2. Immediately deletes the init entry
3. Returns success/error status for each store

This ensures all stores exist before your bot defense functions need them.

---

## 📋 Stores Created

### 1. `csrf-tokens` (Required)
- **Purpose:** CSRF token storage
- **Created by:** `init-blobs-stores.js` or first CSRF token generation
- **TTL:** 15 minutes per token
- **Usage:** Phase 5 (CSRF Token Protection)

### 2. `bot-blacklist` (Optional)
- **Purpose:** Persistent IP blacklist
- **Created by:** `init-blobs-stores.js` or first IP blacklist entry
- **TTL:** 24 hours per IP
- **Usage:** Phase 2 (IP Reputation & Blacklist)

### 3. `behavioral-patterns` (Optional)
- **Purpose:** Submission pattern tracking
- **Created by:** `init-blobs-stores.js` or first pattern entry
- **TTL:** 1 hour per pattern
- **Usage:** Phase 3 (Behavioral Analysis)

---

## 🧪 Testing Store Creation

### Test the Init Function

```bash
# Test locally (if using netlify dev)
curl http://localhost:8888/.netlify/functions/init-blobs-stores

# Test in production
curl https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
```

**Expected Response:**
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

### Verify in Dashboard

1. Go to **Netlify Dashboard** → Your Site
2. Click **Data & Storage** → **Blobs**
3. You should see all three stores listed
4. Click on a store to browse its contents

---

## 🔍 Understanding the UI

### What You Can Do in the UI

✅ **Browse Stores:**
- See all stores for your site
- Click a store to view its keys

✅ **View Entries:**
- See all key-value pairs in a store
- View metadata (size, created date)

✅ **Download Blobs:**
- Download individual blob values
- Useful for debugging/inspection

✅ **Delete Entries:**
- Delete individual keys
- Delete entire stores

❌ **What You CANNOT Do:**
- Create new stores (must be done via code)
- Edit blob values (must be done via code)
- Create new entries (must be done via code)

---

## 🚀 Deployment Checklist

- [ ] Code deployed to Netlify
- [ ] `@netlify/blobs` package installed
- [ ] Run `init-blobs-stores` function
- [ ] Verify stores appear in Dashboard
- [ ] Test CSRF token generation
- [ ] Test IP blacklist functionality
- [ ] Monitor Netlify logs for Blobs access

---

## 🆘 Troubleshooting

### Stores Not Appearing

**Problem:** Stores don't show up in Dashboard after running init function

**Solutions:**
1. Check Netlify function logs for errors
2. Verify `@netlify/blobs` package is installed
3. Verify function deployed successfully
4. Try running init function again
5. Check if stores are created on first actual use (not just init)

### "Store not found" Errors

**Problem:** Functions error with "Store not found"

**Solutions:**
1. Run the `init-blobs-stores` function first
2. Verify store name matches exactly (case-sensitive)
3. Check Netlify logs for Blobs access errors
4. Verify `@netlify/blobs` package is installed

### Package Not Found

**Problem:** `Cannot find module '@netlify/blobs'`

**Solutions:**
1. Install package: `npm install @netlify/blobs`
2. Add to `package.json` dependencies
3. Redeploy to Netlify

---

## 📚 Official Documentation

- **Netlify Blobs Docs:** https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- **Blobs API Reference:** https://docs.netlify.com/build/data-and-storage/netlify-blobs/#javascript-api
- **CLI Commands:** https://cli.netlify.com/commands/blobs/

---

## ✅ Summary

**Key Points:**
1. ✅ Stores are created automatically on first write
2. ✅ Use `init-blobs-stores` function to create all stores at once
3. ✅ UI is for browsing/managing, not creating
4. ✅ Stores appear in Dashboard after first write
5. ✅ All writes must be done via Functions/Edge Functions/CLI

**Next Steps:**
1. Deploy code
2. Run init function
3. Verify in Dashboard
4. Start using stores!

