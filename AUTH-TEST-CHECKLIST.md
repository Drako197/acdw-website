# Authentication Test Checklist

## ✅ CONFIRMED WORKING
- [x] Role is being saved to `unsafeMetadata` in Clerk
- [x] Company is being saved to `unsafeMetadata` in Clerk
- [x] Signup form is working
- [x] Email verification is working

---

## 🧪 TEST THESE NEXT

### Test 1: Role-Based Access Control
1. **Log in** with your test account (role: `hvac_pro`)
2. **Try to access:** `http://localhost:5173/business/pro/catalog`
3. **Expected:** Should see the HVAC Pro catalog page
4. **If blocked:** Check browser console for errors

### Test 2: Protected Route
1. **Log out**
2. **Try to access:** `http://localhost:5173/business/pro/catalog`
3. **Expected:** Should redirect to `/login` or `/auth/signin`
4. **If not redirecting:** Check ProtectedRoute component

### Test 3: Role Mismatch
1. **Create another test account** with role: `homeowner`
2. **Log in** as homeowner
3. **Try to access:** `http://localhost:5173/business/pro/catalog`
4. **Expected:** Should show "Access Denied" or redirect
5. **If allowed:** Check role validation logic

### Test 4: Dashboard Redirect
1. **Log in** with `hvac_pro` role
2. **Go to:** `http://localhost:5173/dashboard`
3. **Expected:** Should redirect to `/business/pro/catalog` (or show appropriate dashboard)
4. **Check:** User role is displayed correctly

---

## 🔍 DEBUGGING

If something doesn't work:

1. **Check browser console** for errors
2. **Check Network tab** - look for Clerk API calls
3. **Verify role in Clerk Dashboard:**
   - Go to Users → Your test user
   - Check `unsafeMetadata` has: `{ "role": "hvac_pro" }`
4. **Check AuthContext:**
   - Add `console.log(user)` in AuthContext to see what's being read
   - Verify `user.role` matches what's in Clerk

---

## ✅ SUCCESS CRITERIA

Authentication is fully working when:
- [x] Users can sign up with role selection
- [x] Role is saved to Clerk metadata
- [x] Users can log in
- [x] Unauthorized page created (redirects when role doesn't match)
- [ ] Protected routes work based on role (ready to test)
- [ ] Role-based redirects work (ready to test)
- [ ] Users without required role are blocked (ready to test)

---

**Test these and let me know what works and what doesn't!**

