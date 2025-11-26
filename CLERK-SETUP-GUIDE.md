# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your AC Drain Wiz e-commerce site.

---

## STEP 1: CREATE CLERK ACCOUNT

1. Go to https://clerk.com
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with your email (free tier includes 10,000 MAU)
4. Verify your email address

---

## STEP 2: CREATE NEW APPLICATION

1. After logging in, click **"Create Application"**
2. Choose a name: **"AC Drain Wiz"**
3. Select authentication methods:
   - ✅ **Email** (required)
   - ❌ Social logins (optional, can add later)
4. Click **"Create Application"**

---

## STEP 3: GET API KEYS

1. In your Clerk Dashboard, go to **"API Keys"** (left sidebar)
2. You'll see:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

3. **Copy the Publishable Key** - you'll need this next

---

## STEP 4: SET ENVIRONMENT VARIABLE

### For Local Development:

Create a `.env` file in your project root (if it doesn't exist):

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

Replace `pk_test_xxxxx` with your actual Clerk Publishable Key.

### For Netlify Production:

1. Go to Netlify Dashboard → Your Site → **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** Your Clerk Publishable Key (starts with `pk_test_` or `pk_live_`)
4. Click **"Save"**

---

## STEP 5: CONFIGURE ROLES IN CLERK

1. In Clerk Dashboard, go to **"User & Authentication"** → **"Roles"**
2. Click **"Create Role"**
3. Create these three roles:

   **Role 1:**
   - **Key:** `homeowner`
   - **Name:** `Homeowner`
   - **Description:** `Homeowner customer - MSRP pricing`

   **Role 2:**
   - **Key:** `hvac_pro`
   - **Name:** `HVAC Professional`
   - **Description:** `HVAC contractor - tiered pricing`

   **Role 3:**
   - **Key:** `property_manager`
   - **Name:** `Property Manager`
   - **Description:** `Property manager - tiered pricing (10% lower than HVAC Pro)`

4. Save each role

---

## STEP 6: CONFIGURE USER METADATA

1. In Clerk Dashboard, go to **"User & Authentication"** → **"Metadata"**
2. Under **"Public metadata"**, you can add:
   - `role` (string) - User's role
   - `company` (string) - User's company name

**Note:** The code uses `unsafeMetadata` during signup, which Clerk automatically handles. You don't need to manually configure this.

---

## STEP 7: TEST AUTHENTICATION

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:5173/auth/signup`

3. **Create a test account:**
   - Fill in the form
   - Select a role (HVAC Professional, Property Manager, or Homeowner)
   - Submit the form
   - Check your email for verification code
   - Enter the code to verify

4. **Test login:**
   - Go to `/auth/signin`
   - Log in with your test account
   - Should redirect to `/dashboard`

---

## STEP 8: VERIFY ROLE ASSIGNMENT

1. In Clerk Dashboard, go to **"Users"**
2. Find your test user
3. Click on the user
4. Check **"Public metadata"** or **"Unsafe metadata"**
5. You should see:
   ```json
   {
     "role": "hvac_pro",
     "company": "Test Company"
   }
   ```

---

## TROUBLESHOOTING

### Issue: "VITE_CLERK_PUBLISHABLE_KEY is not set"
**Solution:** Make sure you've added the environment variable to your `.env` file and restarted your dev server.

### Issue: Sign up works but role is not saved
**Solution:** Check that you're using `unsafeMetadata` in the signup form (already implemented in the code).

### Issue: User can't access protected routes
**Solution:** 
1. Verify the user has a role assigned in Clerk
2. Check that the role matches one of: `homeowner`, `hvac_pro`, `property_manager`
3. Check browser console for errors

### Issue: Email verification not working
**Solution:**
1. Check Clerk Dashboard → **"Email & SMS"** → **"Email Templates"**
2. Make sure email verification is enabled
3. Check your spam folder for verification emails

---

## PRODUCTION CHECKLIST

Before going to production:

- [ ] Switch Clerk to **Production** mode (toggle in dashboard)
- [ ] Update environment variable with **live** publishable key (`pk_live_...`)
- [ ] Test signup flow in production
- [ ] Test login flow in production
- [ ] Verify roles are assigned correctly
- [ ] Test protected routes work correctly
- [ ] Set up email templates (optional, for branding)

---

## CLERK FREE TIER LIMITS

- ✅ 10,000 Monthly Active Users (MAU)
- ✅ Unlimited organizations
- ✅ Email/password authentication
- ✅ Social logins (limited)
- ✅ Basic user management

**This should be more than enough for your needs!**

---

## NEXT STEPS

Once Clerk is set up:

1. ✅ Test authentication locally
2. ✅ Set up Stripe Price IDs
3. ✅ Configure environment variables in Netlify
4. ✅ Test the full payment flow

---

**Questions?** Check Clerk's documentation: https://clerk.com/docs

