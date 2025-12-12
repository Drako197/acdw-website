# Forms with reCAPTCHA Implementation

## ✅ Forms with reCAPTCHA

### 1. Contact Forms (5 forms total)
**Page:** `ContactPage.tsx`  
**Forms:**
- ✅ **contact-general** - Action: `contact_general`
- ✅ **contact-support** - Action: `contact_support`
- ✅ **contact-sales** - Action: `contact_sales`
- ✅ **contact-installer** - Action: `contact_installer`
- ✅ **contact-demo** - Action: `contact_demo`

**Implementation:**
- Uses `useRecaptcha` hook
- Action format: `contact_${activeFormType}` (underscores, not hyphens)
- Token sent in form submission
- Validated server-side in `validate-form-submission.js`

---

### 2. Unsubscribe Form
**Page:** `UnsubscribePage.tsx`  
**Form:** `unsubscribe`  
**Action:** `unsubscribe`

**Implementation:**
- Custom reCAPTCHA loading (not using hook)
- Token sent in form submission
- Validated server-side in `validate-unsubscribe.js`
- Stricter enforcement (rejects if token missing when configured)

---

### 3. Promo Signup Form
**Page:** `PromoPage.tsx`  
**Form:** `promo-signup`  
**Action:** `promo`

**Implementation:**
- Uses `useRecaptcha` hook
- Token sent in form submission
- Validated server-side in `validate-form-submission.js`

---

### 4. Core Upgrade Form
**Page:** `Hero.tsx` (embedded in hero section)  
**Form:** `core-upgrade`  
**Action:** `upgrade`

**Implementation:**
- Uses `useRecaptcha` hook
- Token sent in form submission
- Validated server-side in `validate-form-submission.js`

---

## ❌ Forms WITHOUT reCAPTCHA

### 1. Email Preferences Form
**Page:** `EmailPreferencesPage.tsx`  
**Form:** `email-preferences`  
**Status:** ❌ No reCAPTCHA

**Note:** This form uses Netlify Forms directly (not through validation function)

---

## Summary

**Total Forms with reCAPTCHA:** 8 forms
- 5 Contact forms (general, support, sales, installer, demo)
- 1 Unsubscribe form
- 1 Promo signup form
- 1 Core upgrade form

**Total Forms without reCAPTCHA:** 1 form
- Email preferences form

---

## reCAPTCHA Configuration

**Frontend:**
- Site Key: `VITE_RECAPTCHA_SITE_KEY` (environment variable)
- Uses reCAPTCHA v3 (invisible, score-based)
- Actions are form-specific for better tracking

**Backend:**
- Secret Key: `RECAPTCHA_SECRET_KEY` (environment variable)
- Score Threshold: `RECAPTCHA_SCORE_THRESHOLD` (default: 0.7 for unsubscribe, 0.5 for others)
- Validated in `validate-form-submission.js` and `validate-unsubscribe.js`

---

## Notes

- All reCAPTCHA implementations use **reCAPTCHA v3** (invisible, no user interaction)
- Actions use **underscores** (e.g., `contact_general`) not hyphens (e.g., `contact-general`)
- Server-side validation handles action mismatch (converts hyphens to underscores)
- Unsubscribe form has stricter enforcement (rejects if token missing)
- Email preferences form may need reCAPTCHA added if migrating to Resend

