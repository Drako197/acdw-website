# 🔔 Netlify Personal Access Token Refresh Reminder

**Token Expiration:** Every 90 days  
**Purpose:** Used for Netlify Blobs access (bot defense persistent storage)

---

## 📅 Next Refresh Dates

**Token Created:** December 8, 2025  
**First Expiration:** March 8, 2026 (90 days)  
**Second Expiration:** June 6, 2026 (180 days)  
**Third Expiration:** September 4, 2026 (270 days)  
**Fourth Expiration:** December 3, 2026 (360 days)

---

## ✅ Refresh Checklist

When your token is about to expire (or has expired):

### Step 1: Create New Token
1. Go to **Netlify Dashboard** → Your Profile → **User Settings**
2. Click **Applications** → **OAuth**
3. Find **"Personal access tokens"** section
4. Click **"Create token"**
5. Name: `Blobs Access Token - [Date]` (e.g., "Blobs Access Token - March 2026")
6. Expiration: **90 days**
7. **Copy the token immediately** (you'll only see it once!)

### Step 2: Update Environment Variable
1. Go to **Site Settings** → **Environment Variables**
2. Find `NETLIFY_TOKEN`
3. Click **Edit**
4. Replace the value with your new token
5. Click **Save**

### Step 3: Test
1. Test the init function:
   ```
   https://www.acdrainwiz.com/.netlify/functions/init-blobs-stores
   ```
2. Verify it works (should return success)

### Step 4: Delete Old Token (Optional but Recommended)
1. Go back to **User Settings** → **Applications** → **OAuth**
2. Find your old token
3. Click **Delete** or **Revoke**

---

## 🚨 Warning Signs Token Has Expired

If you see these errors, your token has likely expired:

1. **Init function fails:**
   ```json
   {
     "error": "Cannot configure Blobs store...",
     "error": "The environment has not been configured to use Netlify Blobs"
   }
   ```

2. **Bot defense functions fail:**
   - CSRF tokens not working
   - IP blacklist not persisting
   - Behavioral patterns not tracking

3. **Netlify Function logs show:**
   ```
   Cannot find module '@netlify/blobs'
   The environment has not been configured to use Netlify Blobs
   ```

---

## 📱 Set Your Own Reminder

**Recommended:** Set a calendar reminder for:
- **7 days before expiration** (to refresh proactively)
- **On expiration date** (backup reminder)

**Example Calendar Events:**
- March 1, 2026: "Netlify Token Expires Soon - Refresh Now"
- March 8, 2026: "Netlify Token Expires Today - Refresh Now"

---

## 🔄 Token Rotation Schedule

| Refresh # | Create Date | Expiration Date | Status |
|-----------|-------------|-----------------|--------|
| 1 | Dec 8, 2025 | Mar 8, 2026 | ✅ Active |
| 2 | Mar 8, 2026 | Jun 6, 2026 | ⏳ Pending |
| 3 | Jun 6, 2026 | Sep 4, 2026 | ⏳ Pending |
| 4 | Sep 4, 2026 | Dec 3, 2026 | ⏳ Pending |

**Update this table each time you refresh!**

---

## 💡 Pro Tips

1. **Refresh 7 days early** - Don't wait until the last day
2. **Test immediately** - Verify the new token works
3. **Keep old token for 24 hours** - In case of issues, you can revert
4. **Document the date** - Update this file with each refresh
5. **Set multiple reminders** - Calendar + phone reminder

---

## 🆘 If You Forget to Refresh

**Don't panic!** The bot defense will still work with in-memory fallback:
- ✅ CSRF tokens work (in-memory)
- ✅ IP blacklist works (in-memory)
- ✅ Behavioral patterns work (in-memory)
- ⚠️ Data not persistent (lost on cold start)

**To fix:**
1. Create new token (follow steps above)
2. Update environment variable
3. Test init function
4. Everything will work again!

---

## 📝 Notes

- Token is stored in Netlify Environment Variables (secure)
- Token is only used server-side (never exposed to clients)
- Token has limited scope (Blobs access only)
- 90-day expiration is a good security practice

---

**Last Updated:** December 8, 2025  
**Next Refresh Due:** March 8, 2026

