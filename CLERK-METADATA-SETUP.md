# Clerk Metadata Setup (Alternative to Roles)

If you can't find Roles in Clerk, we can use **Metadata** instead. This works just as well!

---

## Step 1: Navigate to Metadata

1. Go to https://dashboard.clerk.com
2. Click on your application
3. In the left sidebar, look for:
   - **"User & Authentication"** → **"Metadata"**
   - OR **"Configure"** → **"Metadata"**
   - OR **"Settings"** → **"Metadata"**

---

## Step 2: Configure Public Metadata Schema (Optional)

This step is **optional** - Clerk will accept any metadata, but defining a schema helps with validation.

1. On the Metadata page, look for **"Public metadata"** section
2. Click **"Add field"** or **"Define schema"**
3. Add these fields:

   **Field 1:**
   - **Key:** `role`
   - **Type:** `String`
   - **Description:** `User role (homeowner, hvac_pro, property_manager)`

   **Field 2:**
   - **Key:** `company`
   - **Type:** `String`
   - **Description:** `User's company name`

4. Click **"Save"**

**Note:** If you can't find schema definition, that's okay! Clerk will still accept the metadata.

---

## Step 3: Test It Works

The code already reads from metadata, so once you:

1. **Sign up a test user** on your site
2. **Select a role** during signup
3. **Check in Clerk Dashboard** → **"Users"** → Click on your test user
4. **Look at "Public metadata"** or **"Unsafe metadata"**
5. You should see:
   ```json
   {
     "role": "hvac_pro",
     "company": "Test Company"
   }
   ```

---

## How It Works

The code in `AuthContext.tsx` already reads from metadata:

```typescript
role: (clerkUser.unsafeMetadata?.role || clerkUser.publicMetadata?.role || 'homeowner')
```

So it will:
1. First check `unsafeMetadata.role` (set during signup)
2. Then check `publicMetadata.role` (if set manually)
3. Default to `'homeowner'` if neither exists

---

## Manual Role Assignment (If Needed)

If you need to manually assign roles to existing users:

1. Go to Clerk Dashboard → **"Users"**
2. Click on a user
3. Scroll to **"Public metadata"** or **"Unsafe metadata"**
4. Click **"Edit"**
5. Add:
   ```json
   {
     "role": "hvac_pro"
   }
   ```
6. Click **"Save"**

---

## No Setup Required!

**Good news:** The code already supports metadata, so you don't need to configure anything in Clerk for it to work!

The signup form automatically saves the role to `unsafeMetadata` when a user signs up, so roles will work automatically.

---

## Verify It's Working

1. **Sign up a test user** at `/auth/signup`
2. **Select "HVAC Professional"** as the role
3. **Complete signup and verify email**
4. **Log in**
5. **Check if you can access** `/business/pro/catalog` (should work if role is set correctly)

If you can access the protected route, the role is working! ✅

---

**Bottom line:** You don't need to configure anything in Clerk for roles to work. The signup form handles it automatically. Just test it and see if it works!

