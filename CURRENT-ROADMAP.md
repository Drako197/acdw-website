# Current Roadmap & Todo List

## ✅ Recently Completed

1. **Email Collection in Checkout** - Added required email field for ShipStation notifications
2. **SKU Mapping Fix** - Fixed "UNKNOWN-MINI" issue, now correctly shows "ACDW-MINI-HOMEOWNER"
3. **Tennessee Tax Support** - Added Tennessee to fallback tax calculation (7%)
4. **Tax Display Fix** - Fixed duplicate tax percentage display in checkout
5. **Dev Branch Workflow** - Set up Dev/main branch workflow with PR process
6. **Netlify Branch Deploys** - Configured Dev branch for preview deployments
7. **Daily Sync Automation** - Automated daily pull from Dev branch at 9 AM

---

## 🔴 High Priority (P0 - Launch Blockers)

### 1. Payment Confirmation Emails
**Status:** Pending  
**Description:** Test payment confirmation emails in live mode and ensure tax information is included

**Tasks:**
- [ ] Test email delivery in live mode
- [ ] Verify tax amount is included in email
- [ ] Verify tax breakdown is displayed correctly
- [ ] Test with different tax scenarios (Idaho, Florida, Tennessee)
- [ ] Verify email formatting and design

**Estimated Time:** 2-3 hours

---

### 2. Stripe Production Switch
**Status:** Pending  
**Description:** Switch from test mode to live mode, final verification

**Tasks:**
- [ ] Enable Stripe Tax in production dashboard
- [ ] Add tax registrations for all states you sell to
- [ ] Verify tax calculation accuracy in production
- [ ] Test complete checkout flow in production
- [ ] Verify ShipStation order creation in production
- [ ] Test payment confirmation emails in production
- [ ] Final security review

**Estimated Time:** 4-6 hours

---

### 3. Product Content & Images
**Status:** Pending (Content Team)  
**Description:** Finalize product descriptions, images, and content

**Tasks:**
- [ ] Review and finalize product descriptions
- [ ] Optimize product images
- [ ] Add missing product content
- [ ] Verify all product information is accurate

**Estimated Time:** Content team dependent

---

## 🟡 Medium Priority (P1)

### 4. Netlify Forms Migration
**Status:** Pending  
**Description:** Migrate remaining Netlify Forms to Resend API

**Forms to Migrate:**
- [ ] contact-general
- [ ] contact-support
- [ ] contact-sales
- [ ] contact-installer
- [ ] contact-demo
- [ ] promo-signup
- [ ] core-upgrade
- [ ] email-preferences

**Tasks per Form:**
- [ ] Create Resend notification function
- [ ] Update validation function to use Resend
- [ ] Set up Zapier webhook integration
- [ ] Test form submission
- [ ] Remove hidden form blueprint from index.html
- [ ] Delete form from Netlify Dashboard

**Estimated Time:** 2-3 hours per form (16-24 hours total)

---

### 5. Zapier Integration Updates
**Status:** Pending  
**Description:** Update Zapier integrations for all migrated forms

**Tasks:**
- [ ] Set up webhook URLs for each form
- [ ] Configure Zapier workflows
- [ ] Test webhook triggers
- [ ] Verify data mapping
- [ ] Test end-to-end flow

**Estimated Time:** 1-2 hours per form (8-16 hours total)

---

## 🟢 Lower Priority (P2)

### 6. Google Analytics Integration
**Status:** Pending  
**Description:** Set up Google Analytics tracking

**Tasks:**
- [ ] Set up Google Analytics account
- [ ] Add tracking code to site
- [ ] Configure events (purchases, form submissions)
- [ ] Set up conversion tracking
- [ ] Test tracking accuracy

**Estimated Time:** 3-4 hours

---

### 7. Multi-Product Shopping Cart for Pros & Property Managers
**Status:** Pending  
**Description:** Update catalog pages to support shopping cart experience with multiple products and quantities

**Current State:**
- Catalog pages (HVAC Pro & Property Manager) only support single product purchases
- Quantity selector exists but only for one product at a time
- Checkout flow handles single `CartItem` only

**Requirements:**
- Allow pros/property managers to add multiple product types to cart
- Support different quantities for each product (e.g., 10 Minis, 50 Sensors, 100 Bundles)
- Shopping cart UI with ability to update quantities
- Remove items from cart
- Update checkout flow to handle multiple products
- Calculate tier pricing per product based on quantity
- Calculate shipping for multiple products
- Calculate tax for entire order
- Update ShipStation integration for multi-product orders

**Research Phase:**
- [ ] Research best practices for multi-product shopping carts
- [ ] Review Stripe Payment Element support for multiple line items
- [ ] Research how to handle tier pricing with multiple products
- [ ] Review ShipStation API for multi-product orders
- [ ] Design cart state management approach
- [ ] Design UI/UX for cart experience
- [ ] Plan checkout flow for multiple products

**Implementation Phase:**
- [ ] Create shopping cart context/state management
- [ ] Update catalog pages to support "Add to Cart" functionality
- [ ] Create shopping cart page/component
- [ ] Update cart to support multiple products with quantities
- [ ] Add quantity update functionality in cart
- [ ] Add remove item functionality
- [ ] Update checkout page to handle multiple products
- [ ] Update `create-payment-intent` to handle multiple line items
- [ ] Update tax calculation for multi-product orders
- [ ] Update shipping calculation for multi-product orders
- [ ] Update ShipStation integration for multi-product orders
- [ ] Update success page to show all products
- [ ] Test complete flow with multiple products

**Estimated Time:** 
- Research: 4-6 hours
- Implementation: 20-30 hours
- Testing: 4-6 hours
- **Total: 28-42 hours**

**Priority:** P2 (Can be done after launch, but high value for B2B customers)

---

## 📋 Next Immediate Steps

### Recommended Order:

1. **Payment Confirmation Emails** (P0)
   - Test and verify tax information is included
   - Quick win, high impact

2. **Stripe Production Switch** (P0)
   - Final step before launch
   - Requires careful testing

3. **Netlify Forms Migration** (P1)
   - Can be done incrementally
   - Start with highest-traffic forms first

4. **Multi-Product Shopping Cart** (P2)
   - High value for B2B customers (pros & property managers)
   - Can be done after launch
   - Requires research phase first

5. **Google Analytics** (P2)
   - Important for tracking but not launch blocker
   - Can be added after launch

---

## Notes

- **Unsubscribe Form:** Already migrated to Resend ✅
- **Email Collection:** Implemented and working ✅
- **SKU Mapping:** Fixed and working ✅
- **Tax Calculation:** Working for Idaho, Florida, Tennessee ✅
- **Dev Branch Workflow:** Established ✅

---

## Questions to Consider

1. **Which forms have the highest traffic?** (Migrate those first)
2. **Do you have tax registrations set up in Stripe for all states?**
3. **Is Google Analytics account already created?**
4. **What's the target launch date?** (This will help prioritize)

