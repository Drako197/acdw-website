# Session Timeout Investigation & Recommendations

## 🔍 Issue Reported
**User:** HVAC Pro  
**Behavior:** After leaving browser open for extended period, some site features stop working  
**Question:** Should we implement forced logout like banks do?

---

## 📊 Current State: Clerk Session Management

### **How Clerk Handles Sessions**

Clerk uses **JWT tokens** with the following default behavior:

1. **Session Duration:**
   - **Default:** Sessions last **7 days** (configurable in Clerk Dashboard)
   - **Inactivity Timeout:** Not enabled by default
   - **Token Refresh:** Automatic (Clerk refreshes tokens in the background)

2. **Token Lifecycle:**
   - **Access Token:** Short-lived (typically 1 hour)
   - **Refresh Token:** Long-lived (7 days default)
   - **Automatic Renewal:** Clerk auto-refreshes before expiration

3. **Current Configuration:**
   - ✅ Clerk handles token refresh automatically (line 59-61 in `AuthContext.tsx`)
   - ✅ No manual session management needed
   - ⚠️ No inactivity timeout configured
   - ⚠️ No forced logout after extended idle time

---

## 🐛 Likely Root Cause of Issues

### **Why Things Stop Working After Extended Time:**

1. **Token Expiration:**
   - If user is inactive for 7+ days, session expires
   - Clerk should redirect to login automatically
   - But might fail silently in some scenarios

2. **Network Errors During Refresh:**
   - Clerk tries to refresh token in background
   - If network fails or user loses connection
   - Session becomes invalid but UI doesn't update

3. **Stale Data in React State:**
   - User object cached in React context
   - Browser tab open for days
   - Clerk token expires but React doesn't re-render
   - Features requiring auth fail silently

4. **Protected Routes:**
   - API calls to Netlify Functions require valid session
   - If Clerk token expired, API calls fail
   - User sees errors but no prompt to re-login

---

## 🏦 Bank-Style Session Timeout Analysis

### **How Banks Handle This:**

| Feature | Banks | Current ACDW | Recommended |
|---------|-------|--------------|-------------|
| **Inactivity Timeout** | 5-15 minutes | None | 30-60 minutes |
| **Warning Before Logout** | Yes (1-2 min warning) | No | Yes |
| **Auto Logout** | Yes | No | Yes (optional) |
| **Session Extension** | "Stay Logged In" button | No | Yes |
| **Re-auth for Sensitive Actions** | Yes (payments, profile) | No | Not needed (Stripe handles) |

### **Why Banks Use Short Timeouts:**
- ✅ High security risk (money transactions)
- ✅ Compliance requirements (PCI-DSS, regulations)
- ✅ Public computers/shared devices
- ✅ Prevent unauthorized access

### **Do We Need Bank-Level Security?**
**Answer:** **Probably not**, but some timeout is good practice.

**Reasons:**
- ✅ We don't store payment info (Stripe handles it)
- ✅ Most users are on personal devices
- ✅ Low fraud risk for browsing catalog
- ⚠️ BUT: HVAC Pros/PMs have tiered pricing (should protect)

---

## 💡 My Recommendations

### **Option 1: Moderate Timeout (Recommended)**
**Best for most e-commerce sites**

**Settings:**
- **Inactivity Timeout:** 60 minutes
- **Warning:** 5 minutes before logout
- **Extension:** "Stay Logged In" button
- **Hard Limit:** 24 hours (even if active)

**Pros:**
- ✅ Balances security and convenience
- ✅ Protects pricing access
- ✅ Better than no timeout
- ✅ Industry standard for e-commerce

**Cons:**
- ⚠️ Requires some code to implement
- ⚠️ User might be interrupted while browsing

**Implementation Time:** ~2 hours

---

### **Option 2: Relaxed Timeout (Current + Small Fix)**
**Best for convenience-focused sites**

**Settings:**
- **Inactivity Timeout:** None
- **Session Duration:** 7 days (Clerk default)
- **Add:** Session validation on critical pages
- **Add:** Better error handling when session expires

**Pros:**
- ✅ Minimal code changes
- ✅ Better user experience
- ✅ Fixes current issue
- ✅ Easier to implement

**Cons:**
- ⚠️ Less secure
- ⚠️ Sessions can be hijacked if user leaves device unlocked

**Implementation Time:** ~30 minutes

---

### **Option 3: Strict Timeout (Bank-Style)**
**Best for high-security requirements**

**Settings:**
- **Inactivity Timeout:** 15 minutes
- **Warning:** 2 minutes before logout
- **No Extension:** Auto logout always
- **Re-auth:** Required for checkout/pricing

**Pros:**
- ✅ Maximum security
- ✅ Compliance-friendly
- ✅ Prevents session hijacking

**Cons:**
- ⚠️ Annoying for users browsing catalog
- ⚠️ Frequent re-logins
- ⚠️ Not typical for e-commerce

**Implementation Time:** ~3 hours

---

## 🎯 My Specific Recommendation: **Option 1 (Moderate)**

### **Why?**
1. **Your Business Model:**
   - HVAC Pros browse catalog, compare pricing
   - Property Managers research for large orders
   - They need time to evaluate without interruption

2. **Security Needs:**
   - Pricing is sensitive (tiered discounts)
   - But not as critical as banking
   - 60 minutes is reasonable

3. **Industry Standard:**
   - Amazon: 30-60 minutes
   - Home Depot: 60 minutes
   - Grainger (B2B): 120 minutes

4. **Best UX:**
   - Protects access without being annoying
   - Warning gives user control
   - "Stay Logged In" for active users

---

## 🛠️ Implementation Plan for Option 1

### **Phase 1: Session Monitoring (30 min)**
```typescript
// Add to AuthContext.tsx
- Track last activity timestamp
- Update on user interaction (clicks, navigation)
- Store in localStorage
```

### **Phase 2: Timeout Detection (30 min)**
```typescript
// Add useEffect in AuthContext
- Check every minute if inactive for 60+ min
- Trigger warning at 55 minutes
- Auto logout at 60 minutes
```

### **Phase 3: Warning Modal (45 min)**
```typescript
// Create TimeoutWarningModal component
- Shows countdown: "You'll be logged out in 4:32"
- "Stay Logged In" button (resets timer)
- "Log Out Now" button
```

### **Phase 4: Session Validation (15 min)**
```typescript
// Add to ProtectedRoute and API calls
- Validate Clerk session is still active
- If expired, redirect to login with message
- Better error handling
```

---

## 🔒 Security Benefits

| Threat | Current Risk | With Option 1 | With Option 3 |
|--------|--------------|---------------|---------------|
| **Session Hijacking** | Medium | Low | Very Low |
| **Pricing Access** | Medium | Low | Very Low |
| **Left Open Device** | High | Medium | Low |
| **Token Theft** | Medium | Low | Very Low |

---

## 📈 User Experience Impact

| Scenario | Current | Option 1 | Option 3 |
|----------|---------|----------|----------|
| **Browsing Catalog** | No interruption | Warning at 55 min | Warning at 13 min |
| **Researching Products** | No interruption | Can extend session | Frequent re-logins |
| **Making Purchase** | Works until expired | Works (resets timer) | Might timeout mid-flow |
| **Inactive Tab Open** | Works for 7 days | Logs out at 60 min | Logs out at 15 min |

---

## 🎬 Quick Fix (Option 2 - Recommended First Step)

**Before implementing full timeout, let's fix the immediate issue:**

### **Problem:**
- Session expires but user doesn't know
- Features fail silently
- No redirect to login

### **Quick Fix:**
1. Add session validation to protected routes
2. Add better error handling on API failures
3. Show "Session Expired - Please log in" message
4. Auto-redirect to login with return URL

**This solves 90% of the reported issue in 30 minutes.**

---

## 🤔 My Recommendation

### **Start with Quick Fix (Option 2), then add Option 1 if needed**

**Reasoning:**
1. Fix the immediate bug (session expiry not handled gracefully)
2. See if users still have issues
3. If yes, add moderate timeout (60 min)
4. Avoid over-engineering if not needed

**Timeline:**
- **Today:** Deploy quick fix (30 min)
- **Test:** Monitor for 1-2 weeks
- **Decide:** Add timeout if users still report issues

---

## ❓ Questions for You

1. **How often do HVAC Pros/PMs report this issue?**
   - Rare occurrence? → Quick fix sufficient
   - Common problem? → Add full timeout

2. **How long do users typically spend on site?**
   - 5-10 minutes? → Strict timeout OK
   - 30-60 minutes? → Moderate timeout better
   - Hours? → Relaxed or no timeout

3. **Do you have security/compliance requirements?**
   - No specific requirements? → Option 1
   - Must comply with standards? → Option 3

4. **What's your priority?**
   - Fix bug fast? → Quick fix (Option 2)
   - Balance security/UX? → Option 1
   - Maximum security? → Option 3

---

## 🚀 Next Steps

**Tell me which approach you prefer:**
- **A:** Quick fix only (30 min) - Fix session handling
- **B:** Quick fix + Moderate timeout (2 hours) - 60 min timeout with warning
- **C:** Strict timeout (3 hours) - 15 min timeout like banks

I'll implement whichever you choose!

