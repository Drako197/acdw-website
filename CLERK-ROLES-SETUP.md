# How to Configure Roles in Clerk Dashboard

## Step-by-Step Guide

### Step 1: Access Your Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Log in with your Clerk account
3. You should see your application "AC Drain Wiz" (or whatever you named it)

### Step 2: Navigate to Roles
**Option A (Newer Clerk Dashboard):**
1. In the left sidebar, look for **"User & Authentication"**
2. Click on **"User & Authentication"**
3. In the submenu, click on **"Roles"**

**Option B (If you don't see "User & Authentication"):**
1. In the left sidebar, look for **"Configure"**
2. Click on **"Configure"**
3. Look for **"Roles"** in the list

**Option C (Alternative path):**
1. Click on your application name at the top
2. Look for **"Settings"** or **"Configuration"**
3. Find **"Roles"** or **"User Roles"**

### Step 3: Create Roles
Once you're on the Roles page:

1. Click the **"Create Role"** or **"Add Role"** button (usually in the top right)

2. **Create Role 1:**
   - **Key:** `homeowner`
   - **Name:** `Homeowner`
   - **Description:** `Homeowner customer - MSRP pricing`
   - Click **"Save"** or **"Create"**

3. **Create Role 2:**
   - Click **"Create Role"** again
   - **Key:** `hvac_pro`
   - **Name:** `HVAC Professional`
   - **Description:** `HVAC contractor - tiered pricing`
   - Click **"Save"** or **"Create"**

4. **Create Role 3:**
   - Click **"Create Role"** again
   - **Key:** `property_manager`
   - **Name:** `Property Manager`
   - **Description:** `Property manager - tiered pricing (10% lower than HVAC Pro)`
   - Click **"Save"** or **"Create"**

---

## If You Still Can't Find Roles

### Check Your Clerk Plan
- **Free Plan:** Roles should be available
- If you don't see Roles, you might need to enable them in settings

### Alternative: Use Metadata Instead
If Roles aren't available in your Clerk plan, we can use **Public Metadata** instead:

1. Go to **"User & Authentication"** → **"Metadata"**
2. Under **"Public metadata"**, you can add:
   - `role` (string) - This will store the user's role

The code already supports reading roles from metadata, so this will work!

---

## Visual Guide

The Roles page should look something like this:

```
┌─────────────────────────────────────┐
│  Roles                               │
│  ┌───────────────────────────────┐  │
│  │  [Create Role]  [Import Roles] │  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │  Key: homeowner               │  │
│  │  Name: Homeowner              │  │
│  │  [Edit] [Delete]              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Quick Test

After creating roles, you can test by:

1. Creating a test user account on your site
2. During signup, select a role (e.g., "HVAC Professional")
3. After signup, go to Clerk Dashboard → **"Users"**
4. Find your test user
5. Click on the user
6. Check **"Public metadata"** or **"Unsafe metadata"**
7. You should see: `{ "role": "hvac_pro", "company": "..." }`

---

## Still Having Issues?

If you can't find Roles anywhere:

1. **Check your Clerk plan** - Make sure you're on a plan that supports roles
2. **Try the search bar** - Type "roles" in the Clerk dashboard search
3. **Contact Clerk support** - They can help you locate it
4. **Use Metadata instead** - We can configure it to use metadata (see above)

---

## Important Notes

- **Role Keys** must match exactly: `homeowner`, `hvac_pro`, `property_manager`
- **Case-sensitive:** Make sure the keys are lowercase with underscores
- **No spaces:** Use underscores, not spaces in keys

---

**Need more help?** Take a screenshot of your Clerk dashboard and I can help you find the exact location!

