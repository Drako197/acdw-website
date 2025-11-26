# Authentication Testing Guide

## 🎯 Testing Checklist

### Prerequisites
- [ ] Development server is running (`npm run dev`)
- [ ] Clerk is configured and working
- [ ] Browser console is open (F12) to check for errors

---

## Test 1: Sign Up Flow

### Steps:
1. Navigate to `/auth/signup` or `/signup`
2. Fill out the signup form:
   - Email: `test-hvac@example.com`
   - Password: (meet requirements)
   - Role: Select "HVAC Professional"
   - Company: `Test HVAC Company`
   - Name: `Test User`
3. Submit the form
4. Check email for verification code
5. Enter verification code
6. Complete signup

### Expected Results:
- ✅ Form submits successfully
- ✅ Email verification code is received
- ✅ After verification, user is redirected appropriately
- ✅ User role is saved in Clerk metadata

### Verify in Clerk Dashboard:
- Go to Clerk Dashboard → Users
- Find the test user
- Check `unsafeMetadata` contains:
  ```json
  {
    "role": "hvac_pro",
    "company": "Test HVAC Company"
  }
  ```

---

## Test 2: Sign In Flow

### Steps:
1. Navigate to `/auth/signin` or `/login`
2. Enter credentials:
   - Email: `test-hvac@example.com`
   - Password: (your password)
3. Click "Sign In"

### Expected Results:
- ✅ User successfully logs in
- ✅ Redirects to appropriate page based on role:
  - `hvac_pro` → `/business/pro/catalog` (or `/dashboard`)
  - `homeowner` → `/dashboard`
  - `property_manager` → `/contact?type=demo-request` (or `/dashboard`)

---

## Test 3: Protected Route - Unauthenticated Access

### Steps:
1. **Make sure you're logged out**
2. Try to access: `http://localhost:5173/business/pro/catalog`
3. Try to access: `http://localhost:5173/dashboard`
4. Try to access: `http://localhost:5173/dashboard/profile`

### Expected Results:
- ✅ All routes redirect to `/login` or `/auth/signin`
- ✅ After login, user is redirected back to the originally requested page

---

## Test 4: Protected Route - Role-Based Access (HVAC Pro)

### Steps:
1. **Log in** as `hvac_pro` user
2. Try to access: `http://localhost:5173/business/pro/catalog`
3. Try to access: `http://localhost:5173/dashboard`
4. Try to access: `http://localhost:5173/dashboard/profile`

### Expected Results:
- ✅ `/business/pro/catalog` → Should load successfully
- ✅ `/dashboard` → Should load successfully (shows HVAC Pro dashboard)
- ✅ `/dashboard/profile` → Should load successfully

---

## Test 5: Protected Route - Role Mismatch (Homeowner)

### Steps:
1. **Create a new test account** with role: `homeowner`
   - Email: `test-homeowner@example.com`
   - Role: Select "Homeowner"
2. **Log in** as homeowner
3. Try to access: `http://localhost:5173/business/pro/catalog`

### Expected Results:
- ✅ Should redirect to `/unauthorized` page
- ✅ Unauthorized page shows:
  - "Access Denied" message
  - Current role: "homeowner"
  - Options to go to Dashboard, Contact Support, or Sign Out

---

## Test 6: Role-Based Redirects After Login

### Steps:
1. **Log out**
2. Navigate to `/auth/signin`
3. **Log in** as `hvac_pro`
4. Observe redirect destination

### Expected Results:
- ✅ `hvac_pro` → Redirects to `/business/pro/catalog` (or `/dashboard`)
- ✅ `homeowner` → Redirects to `/dashboard`
- ✅ `property_manager` → Redirects to `/contact?type=demo-request` (or `/dashboard`)

---

## Test 7: Profile Update Flow

### Steps:
1. **Log in** as any user
2. Navigate to `/dashboard/profile`
3. Update profile information:
   - Change name
   - Add/update phone number
   - Add/update address
   - Add/update company (if applicable)
4. Click "Save Changes"

### Expected Results:
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Data is saved to Clerk metadata
- ✅ After 2 seconds, redirects to `/dashboard`
- ✅ Updated information appears on dashboard

---

## Test 8: Password Change Flow

### Steps:
1. **Log in** as any user
2. Navigate to `/dashboard/profile`
3. Scroll to "Security" section
4. Click "Change Password"
5. Fill in:
   - Current password
   - New password (min 8 characters)
   - Confirm new password
6. Click "Update Password"

### Expected Results:
- ✅ Password changes successfully
- ✅ Success message appears
- ✅ Form resets and collapses
- ✅ User can log in with new password

---

## Test 9: Logout Flow

### Steps:
1. **Log in** as any user
2. Click user menu in header
3. Click "Sign Out"

### Expected Results:
- ✅ User is logged out
- ✅ Redirects to home page or login page
- ✅ Protected routes are no longer accessible

---

## Test 10: Session Persistence

### Steps:
1. **Log in** as any user
2. Close the browser tab
3. Reopen the application
4. Navigate to a protected route

### Expected Results:
- ✅ User remains logged in (Clerk handles session)
- ✅ Protected routes are accessible
- ✅ User data is still available

---

## 🐛 Debugging Tips

### If Tests Fail:

1. **Check Browser Console:**
   - Look for JavaScript errors
   - Check for Clerk-related errors
   - Verify network requests to Clerk API

2. **Check Clerk Dashboard:**
   - Verify user exists
   - Check `unsafeMetadata` has correct role
   - Verify email is verified

3. **Check AuthContext:**
   - Add temporary `console.log(user)` in `AuthContext.tsx`
   - Verify `user.role` matches Clerk metadata

4. **Check ProtectedRoute:**
   - Verify routes are wrapped with `<ProtectedRoute>`
   - Check `requiredRole` prop is set correctly

5. **Check Network Tab:**
   - Look for failed API calls
   - Check response status codes
   - Verify Clerk API keys are correct

---

## 📝 Test Results Template

```
Test 1: Sign Up Flow
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 2: Sign In Flow
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 3: Protected Route - Unauthenticated
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 4: Protected Route - HVAC Pro Access
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 5: Protected Route - Role Mismatch
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 6: Role-Based Redirects
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 7: Profile Update
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 8: Password Change
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 9: Logout
- Status: [ ] Pass [ ] Fail
- Notes: 

Test 10: Session Persistence
- Status: [ ] Pass [ ] Fail
- Notes: 
```

---

## ⚠️ Known Issues to Check

1. **Routes Not Protected:**
   - Verify `/business/pro/catalog` is wrapped with `<ProtectedRoute requiredRole="hvac_pro">`
   - Verify `/dashboard` is wrapped with `<ProtectedRoute>`
   - Verify `/dashboard/profile` is wrapped with `<ProtectedRoute>`

2. **Redirect Logic:**
   - Check `getRoleBasedRedirect()` in `src/utils/auth.ts`
   - Verify `SignInForm` uses this function

3. **Role Reading:**
   - Verify `AuthContext` reads from `unsafeMetadata` or `publicMetadata`
   - Check role format matches (e.g., `hvac_pro` vs `hvac-professional`)

---

**Ready to test? Start with Test 1 and work through each test systematically!**

