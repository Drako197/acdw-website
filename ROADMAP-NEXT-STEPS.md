# Roadmap - Next Steps After Forms Migration

**Date:** January 2025  
**Current Focus:** Unsubscribe form testing (48 hours)  
**Next Priority:** Launch blockers and content updates

---

## 🎯 Current Status

### ✅ Recently Completed
- ✅ Security hardening (Phase 1.1)
- ✅ Legal content review (Phase 1.3)
- ✅ Unsubscribe form migration to Resend
- ✅ Organization migration to GitHub
- ✅ Bot defense implementation (all 6 phases)

### ⏳ In Progress
- ⏳ **Unsubscribe form monitoring** (48-hour test period)
- ⏳ **Forms migration planning** (scheduled after testing)

---

## 📋 Next Priority Items (P0 - Launch Blockers)

### 1. Payment Confirmation Emails (Phase 1.2) 🔴 **HIGH PRIORITY**

**Status:** Pending - Needs testing in live mode  
**Priority:** P0 - Launch Blocker  
**Estimated Time:** 2-3 hours

**What It Is:**
- Send automated confirmation emails to customers after successful payment
- Replaces or supplements Stripe's default receipt emails
- Custom branding and messaging

**Requirements:**
- Test in Stripe test mode first
- Then test in live mode (with real payment)
- Verify email delivery
- Verify email content and branding

**Files Involved:**
- `netlify/functions/stripe-webhook.js` (payment processing)
- `netlify/functions/send-confirmation-email.js` (may already exist)
- Resend API integration

**Dependencies:**
- ✅ Resend API already set up (for unsubscribe)
- ✅ Stripe webhook already configured
- ⚠️ Needs testing in live mode

---

### 2. Product Content & Images (Phase 1.4) 🟡 **CONTENT TEAM**

**Status:** Pending - Content team responsibility  
**Priority:** P0 - Launch Blocker  
**Estimated Time:** Content team dependent

**What It Is:**
- Finalize product descriptions
- Update product images
- Ensure all product content is accurate and complete

**Requirements:**
- Review all product pages
- Update product descriptions
- Replace placeholder images
- Verify product specifications
- Check pricing accuracy

**Files Involved:**
- Product pages (`src/pages/ProductsPage.tsx`, etc.)
- Product data files
- Image assets in `public/images/`

**Dependencies:**
- Content team review
- Product photography
- Copy approval

---

### 3. Stripe Production Switch (Phase 1.5) 🔴 **FINAL STEP**

**Status:** Pending - Final step before launch  
**Priority:** P0 - Launch Blocker  
**Estimated Time:** 6-9 hours (includes tax implementation)

**What It Is:**
- Switch from Stripe test mode to production mode
- **Enable Stripe Tax** (automatic tax calculation)
- **Add tax calculation to checkout flow**
- **Include taxes in payment confirmation emails**
- Update environment variables
- Verify production keys work
- Test real payment flow

**Requirements:**
- Get Stripe production API keys
- Enable Stripe Tax in Stripe Dashboard
- Configure tax settings (US sales tax, international VAT/GST)
- Update checkout session to enable automatic tax
- Update email templates to include tax
- Update Netlify environment variables
- Test checkout flow with real payment (including tax)
- Verify webhook works in production
- Test refund process (if applicable)

**Files Involved:**
- Environment variables (Netlify Dashboard)
- `netlify/functions/create-checkout.js` (add automatic_tax)
- `netlify/functions/stripe-webhook.js` (extract tax)
- `netlify/functions/get-checkout-session.js` (display tax)
- `netlify/functions/send-payment-confirmation-email.js` (include tax in email)

**Dependencies:**
- ✅ Payment confirmation emails working
- ✅ All testing complete
- ✅ Ready for real transactions

**⚠️ CRITICAL:** Only do this when ready for real payments!

**Tax Implementation:**
- Enable Stripe Tax in dashboard (0.5% fee)
- Add `automatic_tax: { enabled: true }` to checkout
- Update email templates to show tax breakdown
- Test with various addresses (US and international)

---

## 📊 Lower Priority Items (P1)

### 4. Google Analytics Integration (Phase 2.5) 🟢 **NICE TO HAVE**

**Status:** Pending  
**Priority:** P1  
**Estimated Time:** 2-3 hours

**What It Is:**
- Add Google Analytics tracking
- Set up conversion goals
- Track form submissions
- Track purchase events

**Requirements:**
- Get Google Analytics tracking ID
- Add tracking code to site
- Set up conversion goals
- Test tracking in production

**Files Involved:**
- `index.html` (GA script)
- `src/App.tsx` (event tracking)
- Form submission handlers (track conversions)

**Dependencies:**
- Google Analytics account
- Tracking ID

---

## 🎨 Content & UX Enhancements (From Strategy)

### 5. Homepage Content Updates 🟡 **CONTENT TEAM**

**Status:** Ready for implementation  
**Priority:** P1 (after launch blockers)  
**Estimated Time:** 1-2 weeks (content dependent)

**What It Is:**
- Add new homepage sections from strategy
- Update copy and messaging
- Add new components

**Sections to Add:**
- Quick "How It Works" section (3 steps)
- Product Comparison table
- FAQ section (10 Q&As)
- Proof Stack (certifications, testimonials)
- Tech Specs/Compatibility strip
- Risk-Reversal section (warranty, support)

**Files Involved:**
- `src/pages/HomePage.tsx`
- New components in `src/components/home/`
- Content strategy documents

**Dependencies:**
- Content team approval
- Copy finalization
- Image assets

---

## 📅 Recommended Timeline

### Week 1: Launch Blockers
- **Day 1-2:** Payment confirmation emails (test in live mode)
- **Day 3-4:** Product content review (content team)
- **Day 5:** Stripe production switch (if ready)

### Week 2: Forms Migration (After Testing)
- **Days 1-2:** Migrate high-priority forms
- **Days 3-4:** Migrate medium-priority forms
- **Day 5:** Testing and monitoring

### Week 3: Enhancements
- **Day 1-2:** Google Analytics integration
- **Days 3-5:** Homepage content updates (if content ready)

---

## 🎯 Immediate Next Steps (After 48-Hour Test)

### Option A: Launch Blockers First (Recommended)
1. **Payment Confirmation Emails** - Test in live mode
2. **Product Content Review** - Content team
3. **Stripe Production Switch** - Final step

### Option B: Forms Migration First
1. **Migrate remaining forms** - After unsubscribe test succeeds
2. **Then tackle launch blockers**

### Option C: Parallel Work
1. **Forms migration** - Technical work
2. **Product content** - Content team (parallel)
3. **Payment emails** - Can be done anytime

---

## 📋 Complete Roadmap Summary

### Phase 1: Launch Blockers (P0)
1. ✅ Security hardening
2. ⏳ Payment confirmation emails (test in live mode)
3. ✅ Legal content review
4. ⏳ Product content & images (content team)
5. ⏳ Stripe production switch (final step)

### Phase 2: Forms Migration (After Testing)
1. ⏳ Monitor unsubscribe form (48 hours)
2. ⏳ Migrate 8 remaining forms to Resend
3. ⏳ Update Zapier integrations
4. ⏳ Remove all Netlify Forms

### Phase 3: Enhancements (P1)
1. ⏳ Google Analytics integration
2. ⏳ Homepage content updates
3. ⏳ Additional features from strategy

---

## 🚀 Recommended Priority Order

### 1. Payment Confirmation Emails (Next)
**Why:** Launch blocker, can be done now  
**Time:** 2-3 hours  
**Blocks:** Stripe production switch

### 2. Product Content Review (Parallel)
**Why:** Content team work, can happen in parallel  
**Time:** Content team dependent  
**Blocks:** Launch readiness

### 3. Forms Migration (After Testing)
**Why:** Waiting for 48-hour test period  
**Time:** 1-2 weeks (8 forms)  
**Blocks:** Nothing (can happen in parallel)

### 4. Stripe Production Switch (Final)
**Why:** Final step, do after everything else  
**Time:** 1-2 hours  
**Blocks:** Launch

### 5. Google Analytics (Nice to Have)
**Why:** P1 priority, not blocking  
**Time:** 2-3 hours  
**Blocks:** Nothing

---

## 💡 My Recommendation

**After 48-hour unsubscribe test:**

1. **Start with Payment Confirmation Emails** (2-3 hours)
   - Can be done immediately
   - Launch blocker
   - Uses existing Resend setup

2. **Work on Forms Migration** (1-2 weeks)
   - Can happen in parallel
   - High priority for security
   - Follow the roadmap we created

3. **Product Content** (Content team)
   - Can happen in parallel
   - Content team dependent

4. **Stripe Production Switch** (Final)
   - Do last, when everything else is ready
   - Only after thorough testing

5. **Google Analytics** (Nice to have)
   - Can be done anytime
   - Not blocking launch

---

**What would you like to tackle first?** Payment confirmation emails is a good next step since it's a launch blocker and can be done now!

