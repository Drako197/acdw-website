# Clerk API Keys Setup

## ✅ Frontend Key (Already Added)

Your **Publishable Key** has been added to `.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA
```

This key is **safe to expose** in the frontend (it's public by design).

---

## 🔒 Secret Key (Server-Side Only)

Your **Secret Key** should **ONLY** be used in Netlify Functions (server-side):

```
CLERK_SECRET_KEY=sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq
```

### ⚠️ IMPORTANT SECURITY NOTES:

1. **Never add the secret key to `.env`** (it's already in `.gitignore`)
2. **Only use it in Netlify Functions** (server-side code)
3. **Add it to Netlify Dashboard** → Environment Variables (not in `.env` file)

---

## 📋 NEXT STEPS

### For Local Development:
1. ✅ `.env` file already has publishable key
2. Restart your dev server: `npm run dev`

### For Netlify Production:

1. **Go to Netlify Dashboard** → Your Site → **Site settings** → **Environment variables**

2. **Add these variables:**

   **Variable 1:**
   - **Key:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** `pk_test_b3JpZW50ZWQtYm9uZWZpc2gtNjguY2xlcmsuYWNjb3VudHMuZGV2JA`
   - **Scopes:** All scopes

   **Variable 2:**
   - **Key:** `CLERK_SECRET_KEY`
   - **Value:** `sk_test_WBCgc5eYxXMrZtWdYeV60FnuOXqv4uzz8s1yLkSGsq`
   - **Scopes:** All scopes (or just Functions if you want to be more restrictive)

3. **Click "Save"**

---

## 🧪 TEST AUTHENTICATION

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:5173/auth/signup`

3. **Create a test account:**
   - Fill in the form
   - Select a role
   - Submit and verify email

4. **Test login:**
   - Go to `/auth/signin`
   - Log in with your test account

---

## 🔐 SECURITY CHECKLIST

- [x] Publishable key in `.env` (frontend)
- [ ] Secret key in Netlify Dashboard (NOT in `.env`)
- [ ] `.env` is in `.gitignore` (already done)
- [ ] Test authentication locally
- [ ] Add keys to Netlify production environment

---

## 📝 NOTE ABOUT SECRET KEY

The secret key (`CLERK_SECRET_KEY`) is only needed if you plan to:
- Use Clerk's backend API in Netlify Functions
- Verify tokens server-side
- Access user data from server-side code

For now, the frontend-only implementation works with just the publishable key. You can add the secret key to Netlify later if needed.

---

**Your Clerk setup is ready! Test it locally first, then add the keys to Netlify for production.**

