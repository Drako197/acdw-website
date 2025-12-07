# Session Timeout Testing Guide 🧪

## 🎯 Goal
Verify that expired sessions are handled gracefully with clear user messaging and automatic redirect to login.

---

## 🛠️ Testing Methods

We can't wait 7 days for a session to naturally expire, so we'll use these methods to simulate it:

### **Method 1: Clear Clerk Session (Easiest)**
Simulates what happens when a session expires or becomes invalid.

### **Method 2: Inspect Session Validation (Advanced)**
Watch the session validation logic run in real-time using console logs.

---

## 🧪 Test Case 1: Simulate Expired Session

### **Setup:**
1. Open production site: https://www.acdrainwiz.com
2. Open Chrome DevTools (F12 or Right-click → Inspect)
3. Go to **Console** tab

### **Step 1: Sign In**
```
1. Navigate to /login
2. Sign in as HVAC Pro test account
3. Verify you're redirected to dashboard
4. Console should show: ✅ No session errors
```

**Expected Result:**
- ✅ Logged in successfully
- ✅ Dashboard loads
- ✅ No errors in console

---

### **Step 2: Navigate to Protected Page**
```
1. Click on "View Catalog" or go to /business/pro/catalog
2. Page should load normally
3. You should see pricing and products
```

**Expected Result:**
- ✅ Catalog loads
- ✅ Pricing visible
- ✅ No errors

---

### **Step 3: Simulate Session Expiration**
```
1. Stay on the catalog page
2. Open DevTools → Application tab
3. In left sidebar, expand "Cookies"
4. Click on "https://www.acdrainwiz.com"
5. Find all cookies with "clerk" or "__session" in the name
6. Right-click each Clerk cookie → Delete
7. Also go to "Local Storage" → "https://www.acdrainwiz.com"
8. Find Clerk-related keys (start with "__clerk_")
9. Right-click → Delete each one
```

**What You're Doing:**
- Clearing Clerk's authentication data
- Simulating what happens when session expires
- Browser now thinks you're logged out

---

### **Step 4: Trigger Session Check**
```
Option A: Wait 5 minutes (session check runs automatically)

Option B: Force immediate check by navigation
1. Click on any link (e.g., "Dashboard" or refresh catalog)
2. Or refresh the page (Cmd+R / Ctrl+R)
```

---

### **Step 5: Verify Session Expired Detection**

**What Should Happen:**

1. **Console Warnings:**
```
⚠️ Session expired - Clerk user exists but isSignedIn is false
🔒 Session invalid, redirecting to login: Your session has expired...
```

2. **Automatic Redirect:**
- Page redirects to `/login`
- URL preserves where you came from

3. **Warning Banner:**
You should see a **yellow warning banner** above the login form:

```
┌────────────────────────────────────────────┐
│  ⚠️  Session Expired                       │
│  Your session has expired.                 │
│  Please sign in again.                     │
└────────────────────────────────────────────┘
```

4. **Login Form:**
- Standard sign-in form below the warning
- Email and password fields
- "Sign In" button

---

### **Step 6: Re-Login and Verify Return**
```
1. Sign in again with same credentials
2. Should redirect back to the page you were on (catalog)
3. Catalog should load normally
4. Warning banner should be gone
```

**Expected Result:**
- ✅ Login successful
- ✅ Redirected back to `/business/pro/catalog` (where you were)
- ✅ Catalog loads with pricing
- ✅ No warning banner
- ✅ Session is fresh

---

## 🧪 Test Case 2: Protected Route Without Session

### **Setup:**
Start from a logged-out state (or use incognito window)

### **Steps:**
```
1. Open incognito window
2. Go to: https://www.acdrainwiz.com/business/pro/catalog
3. Should immediately redirect to /login
4. Should NOT see "Session Expired" warning (never had a session)
5. Sign in
6. Should redirect back to catalog
```

**Expected Result:**
- ✅ Immediate redirect (no access to protected page)
- ✅ No session expired warning (expected behavior)
- ✅ After login → Returns to catalog

---

## 🧪 Test Case 3: Session Validation Logging

### **Watch Session Checks in Real-Time:**

```
1. Sign in as any user
2. Open Console
3. Watch for periodic checks (every 5 minutes)
4. You should see NO errors if session is valid
5. After 5 minutes, session check runs (usually silent if valid)
```

**To See Debug Logs:**
```javascript
// Paste this in console to see when session checks run:
console.log('🔍 Monitoring session checks...')
```

**What to Look For:**
- ✅ No errors = Session valid
- ⚠️ Warnings = Session invalid (should redirect)

---

## 📋 Complete Testing Checklist

### **✅ Pre-Testing Verification**

Before starting tests, verify the fix is deployed:

1. **Check Git Commit:**
```bash
# Should show commit: ff9643d
git log -1 --oneline
```

2. **Verify Production Build:**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Load production site
- Check Network tab → index.js should be latest version

---

### **✅ Test Case Checklist**

#### **Test 1: Expired Session (Primary Test)**
- [ ] Sign in successfully
- [ ] Navigate to protected page (catalog)
- [ ] Clear Clerk cookies/storage
- [ ] Refresh or navigate
- [ ] Console shows session expired warning
- [ ] Redirects to /login
- [ ] Yellow warning banner displays
- [ ] Sign in again
- [ ] Returns to original page

#### **Test 2: Direct Protected Access**
- [ ] Open incognito window
- [ ] Try to access /business/pro/catalog directly
- [ ] Redirects to /login immediately
- [ ] No session expired warning (correct)
- [ ] Sign in
- [ ] Returns to catalog

#### **Test 3: Session Validation**
- [ ] Sign in
- [ ] Monitor console for 5+ minutes
- [ ] Session checks run periodically
- [ ] No errors if session valid

---

## 🎨 Visual Verification

### **Session Expired Warning Should Look Like:**

**Location:** Above login form  
**Color:** Yellow background (light)  
**Border:** Yellow (medium)  
**Icon:** ⚠️ Warning triangle (yellow)  
**Text:** 
- Title: "Session Expired" (bold, dark yellow)
- Message: "Your session has expired. Please sign in again." (regular, yellow)

**Styling:**
```
Background: bg-yellow-50
Border: border-yellow-300
Icon Color: text-yellow-600
Title: text-yellow-800 font-semibold
Message: text-yellow-700
```

---

## 🐛 Troubleshooting

### **Issue: Warning Banner Doesn't Show**

**Possible Causes:**
1. Cache not cleared → Hard refresh (Cmd+Shift+R)
2. Old build loaded → Check Network tab for latest bundle
3. Session state not properly cleared → Try Method 2 below

**Method 2 - Force Clear:**
```javascript
// Paste in console to completely clear Clerk state:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

### **Issue: No Console Warnings**

**Check:**
1. Console filter is set to "All" (not "Errors" only)
2. "Preserve log" is enabled
3. You're looking at the right tab (Console, not Network)

---

### **Issue: Doesn't Redirect to Login**

**Verify:**
1. URL includes protected route (e.g., `/business/pro/catalog`)
2. Not on a public page (e.g., `/products`)
3. DevTools Console shows the session check running

---

### **Issue: Returns to Wrong Page After Login**

**Expected Behavior:**
- Should return to page you were on when session expired
- URL state is preserved in `location.state.from`

**Debug:**
```javascript
// Check what URL is saved:
// (paste in console on login page)
console.log('Return URL:', window.history.state)
```

---

## 📊 Success Criteria

### **The fix is working correctly if:**

✅ **Session expiration is detected** (console warnings)  
✅ **Automatic redirect happens** (to /login)  
✅ **Warning banner displays** (yellow, above form)  
✅ **Return URL is preserved** (goes back after login)  
✅ **No silent failures** (always redirects or shows error)  

### **The fix is NOT working if:**

❌ Features fail with no redirect  
❌ No warning banner on login page  
❌ Console shows errors (not warnings)  
❌ User can access protected pages without session  
❌ Redirect doesn't preserve intended destination  

---

## 🎯 Quick Test (5 Minutes)

**Fast verification for busy testing:**

```
1. Sign in → ✅ Works
2. Go to catalog → ✅ Loads
3. DevTools → Clear Clerk cookies → ✅ Cleared
4. Refresh page → ✅ Redirects to login
5. See yellow warning? → ✅ Yes
6. Sign in again → ✅ Returns to catalog
```

If all ✅ = Fix is working! 🎉

---

## 📸 Screenshot Reference

### **What You Should See:**

**1. Before Clearing Session:**
```
URL: /business/pro/catalog
Status: Logged in, catalog visible
Console: No errors
```

**2. After Clearing Session:**
```
URL: /login?...from=/business/pro/catalog
Status: Redirected to login
Console: "⚠️ Session expired..."
Page: Yellow warning banner + login form
```

**3. After Re-Login:**
```
URL: /business/pro/catalog
Status: Logged in again, catalog visible
Console: No errors
```

---

## 🚀 Ready to Test!

**Start with Test Case 1** (most important):
1. Sign in as HVAC Pro
2. Go to catalog
3. Clear Clerk cookies
4. Refresh → Should see warning and redirect

**Let me know:**
- ✅ If everything works as expected
- ⚠️ If you see any unexpected behavior
- 🐛 If you encounter any errors

I'll be here to help troubleshoot! 🛠️

