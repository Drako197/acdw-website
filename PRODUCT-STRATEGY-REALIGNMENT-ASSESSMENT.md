# AC Drain Wiz Product Strategy Realignment Assessment

**Date**: January 2025  
**Version**: 2.0  
**Status**: Strategy Change Implementation Plan

---

## Executive Summary

**New Strategic Direction:**
- **Core 1.0**: ❌ **DEPRECATED** - Remove from all customer-facing content
- **Sensor**: 🔒 **CONTRACTOR-ONLY** - Not available to homeowners; requires contractor authentication
- **Mini**: ⭐ **FLAGSHIP** - Available to both homeowners (retail) and contractors (with professional pricing)

**Key Changes Required:**
1. Remove all Core 1.0 references and product displays
2. Gate Sensor product behind contractor authentication
3. Reposition Mini as the primary product for all audiences
4. Update customer flows to reflect product availability by audience type

---

## Current State Analysis

### Product Visibility Matrix

| Location | Mini | Sensor | Core 1.0 | Mini+Sensor Bundle |
|----------|------|--------|----------|-------------------|
| **Hero Section** | ✅ Featured | ❌ Not shown | ❌ Not shown | ❌ Not shown |
| **Product Showcase** | ✅ Shown (Bundle) | ✅ Shown | ✅ **NEEDS REMOVAL** | ✅ Shown |
| **Product Comparison** | ✅ Shown | ✅ Shown | ✅ **NEEDS REMOVAL** | N/A |
| **ProductsPage** | ✅ Shown | ✅ Shown | ✅ **NEEDS REMOVAL** | N/A |
| **Customer Selector** | ✅ All users | ✅ All users | ✅ All users | ✅ All users |
| **FAQs** | ✅ Mentioned | ✅ Mentioned | ✅ **NEEDS REMOVAL** | ✅ Mentioned |

### Audience Product Access Matrix

| Audience | Mini | Sensor | Core 1.0 |
|----------|------|--------|----------|
| **Homeowners** | ✅ Retail Purchase | ❌ **BLOCK ACCESS** | ❌ **REMOVE** |
| **Contractors** | ✅ Professional Pricing | ✅ **REQUIRES LOGIN** | ❌ **REMOVE** |
| **Distributors** | ✅ Wholesale Pricing | ✅ Wholesale Pricing | ❌ **REMOVE** |
| **City Officials** | ✅ Info Only | ✅ Info Only | ❌ **REMOVE** |

---

## Required Changes by Component

### 1. Hero Section (`src/components/home/Hero.tsx`)

**Current State:**
- ✅ Correctly features Mini as flagship
- ✅ Mini-focused messaging
- ❌ No changes needed here

**Action Items:**
- ✅ **NO CHANGES REQUIRED** - Hero already correctly positions Mini

---

### 2. Product Showcase Section (`src/components/home/Hero.tsx`)

**Current State:**
- Shows 3 cards: Sensor (top left), Core 1.0 (top right), Mini+Sensor bundle (full width)

**Required Changes:**

#### A. Remove Core 1.0 Card
```typescript
// REMOVE THIS ENTIRE CARD:
{/* Core 1.0 Card */}
<div className="product-showcase-card product-showcase-card-core">
  // ... entire card content
</div>
```

#### B. Update Layout to 2-Card System
- **Left Card**: Mini (single product focus)
- **Right Card**: Mini + Sensor Bundle (contractor-focused, gated messaging)

#### C. Update Sensor Bundle Card Messaging
- Add "Contractor-Only" badge/indicator
- Update CTAs: "Sign In to Access" for contractors, hide for homeowners
- Add conditional rendering based on authentication state

**New Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │   MINI CARD         │  │ MINI + SENSOR BUNDLE│     │
│  │   (Homeowner Focus) │  │ (Contractor Only)   │     │
│  │                     │  │                     │     │
│  │ Available Now       │  │ Requires Contractor │     │
│  │ [Buy Now]           │  │ Sign-In            │     │
│  │                     │  │ [Sign In to Access]│     │
│  └─────────────────────┘  └─────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**Files to Modify:**
- `src/components/home/Hero.tsx` (lines ~240-355)

---

### 3. Product Comparison Table (`src/components/home/Hero.tsx`)

**Current State:**
- 3-column table: Mini | Sensor | Core 1.0

**Required Changes:**

#### Option A: Remove Comparison Table Entirely
- Simplifies messaging
- Reduces confusion
- Focus on Mini as flagship

#### Option B: Simplify to Mini Only
- Single product feature table
- Detailed specs for Mini

#### Option C: Mini vs. Sensor (Contractor View Only)
- Show only when user is authenticated contractor
- Hide for homeowners
- Emphasize Sensor as contractor-only upgrade

**Recommendation:** **Option A** - Remove comparison table, focus messaging on Mini as the solution.

**Files to Modify:**
- `src/components/home/Hero.tsx` (lines ~358-530)

---

### 4. Products Page (`src/pages/ProductsPage.tsx`)

**Current State:**
- Shows 3 products: Mini, Sensor, Core 1.0
- All products visible to all users

**Required Changes:**

#### A. Remove Core 1.0 Product
```typescript
// REMOVE FROM PRODUCTS ARRAY:
{
  id: 'core-1-0',
  name: 'AC Drain Wiz (Core 1.0)',
  // ... entire product object
}
```

#### B. Gate Sensor Product Display
```typescript
// Add conditional rendering:
{user?.role === 'HVAC_PROFESSIONAL' && (
  // Show Sensor product card
)}
```

#### C. Update Product Evolution Section
- Remove Core 1.0 from timeline
- Update to: Mini → Sensor (contractor upgrade path)

**Files to Modify:**
- `src/pages/ProductsPage.tsx` (entire file)

---

### 5. Customer Type Selector (`src/components/home/CustomerTypeSelector.tsx`)

**Current State:**
- All customer types see same product options
- No product gating by audience

**Required Changes:**

#### A. Homeowner Card Updates
```typescript
{
  type: 'homeowner',
  title: 'Homeowner',
  description: 'Protect your home with AC Drain Wiz Mini - our flagship solution designed for homeowners.',
  features: [
    'AC Drain Wiz Mini - available now',
    'Direct purchase with retail pricing',
    'DIY-friendly 30-minute installation',
    'Professional installation support available',
    '100% satisfaction guarantee'
  ],
  cta: 'Shop Mini',
  pricing: 'retail'
}
```

#### B. HVAC Professional Card Updates
```typescript
{
  type: 'hvac-professional',
  title: 'HVAC Professional',
  description: 'Boost efficiency with Mini (bulk pricing) and Sensor (contractor-only smart monitoring).',
  features: [
    'AC Drain Wiz Mini - bulk pricing available',
    'AC Drain Wiz Sensor - contractor-only access',
    'Professional pricing tiers',
    'Mini + Sensor bundle options',
    '35% faster cleanouts'
  ],
  cta: 'Access Pro Portal',
  pricing: 'pro'
}
```

#### C. Update Navigation Logic
- Homeowners → `/products?product=mini`
- Contractors → `/auth/signin` → `/products` (shows Mini + Sensor)

**Files to Modify:**
- `src/components/home/CustomerTypeSelector.tsx` (entire file)

---

### 6. FAQs Section (`src/components/home/Hero.tsx`)

**Current State:**
- FAQ #4: "What's the difference between Mini, Sensor, and Core 1.0?"
- FAQ #5: "Do I need both Mini and Sensor, or can I use them separately?"
- Other FAQs mention all products generically

**Required Changes:**

#### Update FAQ #4
```typescript
{
  question: "What's the difference between Mini and Sensor?",
  answer: "Mini is our flagship product available to everyone - a compact maintenance solution with versatile attachments. Sensor is a contractor-only smart monitoring system that adds 24/7 alerts. Contractors can purchase both for maximum protection."
}
```

#### Update FAQ #5
```typescript
{
  question: "Can homeowners purchase the Sensor?",
  answer: "The Sensor is a contractor-only product designed for professional installations. Homeowners can purchase and install the Mini directly, which provides excellent protection on its own. If you're interested in the Sensor's smart monitoring features, contact a licensed HVAC contractor who can install it for you."
}
```

#### Remove Core 1.0 References
- Remove any mentions of Core 1.0 from all FAQs

**Files to Modify:**
- `src/components/home/Hero.tsx` (faqs array, lines ~13-54)

---

### 7. About Page (`src/pages/AboutPage.tsx`)

**Current State:**
- Lists all three products in status section

**Required Changes:**
- Remove Core 1.0 from product status
- Update to show: Mini (Available), Sensor (Contractor-Only)

**Files to Modify:**
- `src/pages/AboutPage.tsx` (product status section)

---

### 8. Content Strategy Documents

**Files to Update:**
- `CONTENT-STRATEGY.md`
- `LANDING-PAGE-CONTENT-STRATEGY.md`
- `UX-User-Flow-Document.md`

**Updates Needed:**
- Remove all Core 1.0 sections
- Update product hierarchy to: Mini (flagship), Sensor (contractor-only)
- Update audience messaging
- Revise user flows

---

## Authentication & Gating Requirements

### Sensor Product Gating Logic

```typescript
// Example implementation pattern:
const canViewSensor = () => {
  const user = useAuth()
  return user?.role === 'HVAC_PROFESSIONAL' || user?.role === 'DISTRIBUTOR'
}

// In component:
{canViewSensor() ? (
  <SensorProductCard />
) : (
  <SignInPromptCard 
    message="Sensor is available to contractors only. Sign in to access."
    cta="Sign In as Contractor"
  />
)}
```

### Required Routes & Guards

1. **Product Routes:**
   - `/products?product=mini` → Open to all
   - `/products?product=sensor` → Guarded (contractor-only)
   - `/products?product=core` → **404 or redirect to /products**

2. **Protected Routes:**
   - Add route guard for Sensor product pages
   - Redirect non-contractors to sign-in or Mini product page

---

## SEO & Content Updates

### Pages to Remove/Update
- ❌ Remove: Core 1.0 product page
- ✅ Update: Product comparison content
- ✅ Update: Meta descriptions
- ✅ Update: Schema markup

### Redirects Needed
- `/products/core-1-0` → `/products/mini`
- `/products/core` → `/products/mini`
- Any Core 1.0 deep links → Mini product page

---

## Implementation Priority

### Phase 1: Critical (Immediate)
1. ✅ Remove Core 1.0 from Product Showcase
2. ✅ Remove Core 1.0 from ProductsPage
3. ✅ Update Product Comparison Table (remove Core 1.0 column)
4. ✅ Gate Sensor product display (contractor-only)

### Phase 2: High Priority (This Week)
5. ✅ Update Customer Type Selector messaging
6. ✅ Update FAQs
7. ✅ Update About Page
8. ✅ Add authentication checks for Sensor access

### Phase 3: Polish (Next Week)
9. ✅ Update content strategy documents
10. ✅ Set up redirects for deprecated Core 1.0 links
11. ✅ Update SEO metadata
12. ✅ Test all user flows

---

## Risk Mitigation

### Potential Issues
1. **Existing Core 1.0 Links:** Create redirects
2. **Customer Confusion:** Clear messaging about deprecation
3. **Sensor Visibility:** Ensure contractors can easily find it
4. **SEO Impact:** Monitor organic traffic after changes

### Success Metrics
- ✅ Zero Core 1.0 references in customer-facing content
- ✅ Sensor only accessible to authenticated contractors
- ✅ Homeowners see only Mini
- ✅ Contractors can easily access Sensor
- ✅ No broken links or 404s

---

## Next Steps

1. **Review this assessment** with stakeholders
2. **Confirm implementation approach** (recommend Phase 1 immediate)
3. **Begin Phase 1 implementation** once approved
4. **Test user flows** for each audience type
5. **Monitor analytics** for traffic patterns post-launch

---

**Document Status:** Ready for Implementation  
**Last Updated:** January 2025  
**Next Review:** After Phase 1 completion

