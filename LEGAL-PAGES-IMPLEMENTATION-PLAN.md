# Legal Pages Implementation Plan

**Priority:** P0 - Critical for Launch  
**Status:** In Progress  
**Timeline:** < 1 day

---

## Current Status

### ✅ Already Complete
- **Privacy Policy Page:** `src/pages/PrivacyPolicyPage.tsx` exists with content
- **Privacy Policy Route:** `/privacy-policy` is routed in `App.tsx`

### ⚠️ Needs Implementation
- **Terms of Service Page:** Not created yet
- **Terms of Service Route:** Not added to `App.tsx`
- **Footer Links:** Privacy Policy and Terms of Service links missing
- **Stripe Public Details:** Need to add links to both pages

---

## Implementation Tasks

### Task 1: Review Privacy Policy Content ✅ (Optional)

**Status:** Privacy Policy page exists with comprehensive content

**Action:**
- Review existing content in `src/pages/PrivacyPolicyPage.tsx`
- Verify it matches your business needs
- Update if needed (especially contact information, data collection practices)

**Estimated Time:** 15-30 minutes (if updates needed)

---

### Task 2: Create Terms of Service Page

**File to Create:** `src/pages/TermsOfServicePage.tsx`

**Content Sections Needed:**
1. **Introduction**
   - Company information
   - Effective date
   - Agreement to terms

2. **Acceptance of Terms**
   - How users agree to terms
   - Age requirements
   - Account responsibilities

3. **Use of Website**
   - Permitted uses
   - Prohibited uses
   - User content

4. **Products and Services**
   - Product descriptions
   - Pricing
   - Availability
   - Order acceptance

5. **Payment Terms**
   - Payment methods
   - Pricing
   - Refunds and returns
   - Shipping

6. **Intellectual Property**
   - Copyright
   - Trademarks
   - User content license

7. **Limitation of Liability**
   - Disclaimer of warranties
   - Limitation of liability
   - Indemnification

8. **Dispute Resolution**
   - Governing law
   - Jurisdiction
   - Arbitration (if applicable)

9. **Changes to Terms**
   - Right to modify
   - Notification of changes

10. **Contact Information**
    - Company name: AC Drain Wiz
    - Contact: (561) 654-5237
    - Email: ariddle@acdrainwiz.com
    - Website: www.acdrainwiz.com

**Estimated Time:** 2-3 hours (if creating from scratch)

**Note:** If you have Terms of Service from your previous website, we can adapt that content instead.

---

### Task 3: Add Terms of Service Route

**File to Update:** `src/App.tsx`

**Action:**
1. Import `TermsOfServicePage` component
2. Add route: `<Route path="/terms-of-service" element={<TermsOfServicePage />} />`
3. Or: `<Route path="/terms" element={<TermsOfServicePage />} />`

**Estimated Time:** 5 minutes

---

### Task 4: Add Footer Links

**File to Update:** `src/components/layout/Footer.tsx`

**Action:**
Add a new "Legal" section in the footer links grid, or add links to existing section:

```tsx
{/* Legal */}
<div className="footer-section">
  <h3 className="footer-section-title">
    Legal
  </h3>
  <ul className="footer-link-list">
    <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
    <li><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></li>
  </ul>
</div>
```

**Alternative:** Add links to the bottom section (footer-bottom) as small text links.

**Estimated Time:** 10 minutes

---

### Task 5: Update Stripe Public Details

**Location:** Stripe Dashboard → Settings → Business → Public details

**Action:**
1. Go to Stripe Dashboard
2. Navigate to: **Settings** → **Business** → **Public details**
3. Find "Privacy policy URL" field
   - Add: `https://www.acdrainwiz.com/privacy-policy`
4. Find "Terms of service URL" field
   - Add: `https://www.acdrainwiz.com/terms-of-service`
5. Save changes

**Why:** Stripe requires these links for compliance and displays them in checkout and receipts.

**Estimated Time:** 5 minutes

---

## Implementation Checklist

### Code Changes
- [ ] Review Privacy Policy content (if needed)
- [ ] Create `TermsOfServicePage.tsx` component
- [ ] Add Terms of Service route to `App.tsx`
- [ ] Add Privacy Policy link to Footer
- [ ] Add Terms of Service link to Footer
- [ ] Test both pages load correctly
- [ ] Verify footer links work

### Stripe Configuration
- [ ] Add Privacy Policy URL to Stripe Public Details
- [ ] Add Terms of Service URL to Stripe Public Details
- [ ] Verify links appear in Stripe checkout/receipts

### Content Review
- [ ] Review Privacy Policy content accuracy
- [ ] Review Terms of Service content accuracy
- [ ] Verify contact information is correct
- [ ] Check dates (Last Updated, Effective Date)

---

## File Structure

```
src/
├── pages/
│   ├── PrivacyPolicyPage.tsx ✅ (exists)
│   └── TermsOfServicePage.tsx ⚠️ (needs creation)
├── components/
│   └── layout/
│       └── Footer.tsx ⚠️ (needs legal links)
└── App.tsx ⚠️ (needs Terms route)
```

---

## Content Sources

### Option 1: Use Previous Website Content (Recommended)
- Copy Terms of Service from previous website
- Adapt to current business practices
- Update contact information
- Review for any needed changes

### Option 2: Use Template/Generator
- Use a Terms of Service generator
- Customize for your business
- Have legal review (recommended)

### Option 3: Create from Scratch
- Write custom Terms of Service
- Cover all necessary sections
- Legal review strongly recommended

---

## Next Steps

1. **Decide on Terms of Service content source:**
   - Do you have Terms from previous website? (Fastest)
   - Need to create new Terms? (More time)
   - Want to use a template? (Moderate time)

2. **Once content is ready:**
   - I'll create the TermsOfServicePage component
   - Add the route
   - Update footer links
   - Guide you through Stripe configuration

3. **Final review:**
   - Review both pages for accuracy
   - Test all links
   - Verify Stripe integration

---

## Questions to Answer

1. **Do you have Terms of Service from your previous website?**
   - If yes, we can adapt that content
   - If no, we'll need to create new content

2. **Do you need legal review?**
   - Recommended for Terms of Service
   - Privacy Policy already has comprehensive content

3. **Preferred route path:**
   - `/terms-of-service` (full name)
   - `/terms` (shorter)
   - Other preference?

---

**Current Priority:** Create Terms of Service page and add footer links

**Estimated Total Time:** 2-4 hours (depending on content source)

---

**Last Updated:** December 2025

