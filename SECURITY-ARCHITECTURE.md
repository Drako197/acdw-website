# Security Architecture & Implementation Plan
## AC Drain Wiz E-Commerce System

**Author:** Senior Full-Stack Engineer & Application Security Lead  
**Date:** 2024  
**Status:** Design & Implementation Guide

---

## EXECUTIVE SUMMARY

This document outlines a secure, role-based e-commerce system for AC Drain Wiz with:
- **3 User Roles:** Homeowner, HVAC Pro, Property Manager
- **Multi-tier Pricing:** Quantity-based discounts per role
- **Stripe Integration:** PCI-compliant payment processing
- **Zero Backend:** Netlify Functions + React frontend
- **Security-First:** OWASP Top 10 mitigation, secure auth, role-based access control

---

## 1. THREAT MODEL & SECURITY CONSIDERATIONS

### 1.1 Identified Threats

| Threat | Risk Level | Mitigation Strategy |
|--------|-----------|-------------------|
| **Authentication Bypass** | HIGH | JWT tokens, secure session management, role validation |
| **Price Manipulation** | HIGH | Server-side price validation, Stripe Price ID enforcement |
| **Role Escalation** | HIGH | Server-side role checks, JWT claims validation |
| **XSS Attacks** | MEDIUM | React's built-in XSS protection, Content Security Policy |
| **CSRF Attacks** | MEDIUM | SameSite cookies, CSRF tokens, origin validation |
| **Injection Attacks** | MEDIUM | Input validation, parameterized queries (if DB added) |
| **Sensitive Data Exposure** | HIGH | No client-side price storage, secure token storage |
| **Broken Authentication** | HIGH | Secure JWT implementation, token expiration, refresh tokens |
| **Insufficient Logging** | MEDIUM | Netlify Functions logging, error tracking |
| **Unvalidated Redirects** | LOW | Whitelist redirect URLs, role-based routing |

### 1.2 PCI Compliance Considerations

- **No Card Data Storage:** All payment data handled by Stripe
- **Stripe Checkout:** Redirects to Stripe-hosted page (PCI DSS Level 1)
- **No PCI Scope:** We never touch card data directly
- **Secure Communication:** HTTPS only, TLS 1.2+

---

## 2. ARCHITECTURE OVERVIEW

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Public      │  │  Protected   │  │  Checkout    │ │
│  │  Pages       │  │  Pages       │  │  Flow        │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│              NETLIFY FUNCTIONS (Serverless)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Auth        │  │  Pricing     │  │  Stripe      │ │
│  │  Functions   │  │  Validation  │  │  Integration │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ API
                          ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Stripe API  │  │  Auth0/      │                    │
│  │              │  │  Netlify     │                    │
│  │              │  │  Identity    │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Authentication Flow

```
1. User visits protected route
2. Check for JWT token in secure cookie
3. If no token → redirect to login
4. If token exists → validate with Netlify Function
5. Extract role from token claims
6. Authorize access based on role
7. Refresh token if needed
```

### 2.3 Payment Flow

```
1. User selects product + quantity
2. Client sends: { productId, quantity, role }
3. Netlify Function validates:
   - User is authenticated
   - Role matches requested pricing
   - Quantity is valid
   - Price matches server-side calculation
4. Function returns Stripe Price ID
5. Client creates Stripe Checkout session
6. Redirect to Stripe-hosted checkout
7. Stripe webhook confirms payment
8. Netlify Function updates order status
```

---

## 3. AUTHENTICATION & AUTHORIZATION SYSTEM

### 3.1 Technology Choice: Netlify Identity + JWT

**Why Netlify Identity:**
- Built into Netlify (no additional service)
- Handles user management
- JWT token generation
- Email verification
- Password reset
- Role management via metadata

**Alternative:** Auth0 (more features, additional cost)

### 3.2 Role Management

**User Roles:**
- `homeowner` - Public access, MSRP pricing
- `hvac_pro` - Protected, contractor pricing
- `property_manager` - Protected, PM pricing

**Role Storage:**
- Stored in Netlify Identity user metadata
- Included in JWT token claims
- Validated server-side on every request

### 3.3 JWT Token Structure

```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "app_metadata": {
    "role": "hvac_pro",
    "company": "ABC HVAC",
    "tier": "tier_2"
  },
  "exp": 1234567890,
  "iat": 1234567890
}
```

### 3.4 Secure Token Storage

- **Storage:** HTTP-only cookies (not localStorage)
- **SameSite:** Strict
- **Secure:** HTTPS only
- **Expiration:** 24 hours (refresh token: 7 days)

---

## 4. STRIPE INTEGRATION DESIGN

### 4.1 Stripe Price ID Strategy

**Structure:** One Price ID per product/role/tier combination

**Example Price IDs:**
```
mini_homeowner_msrp: price_xxxxx
mini_hvac_tier1: price_xxxxx
mini_hvac_tier2: price_xxxxx
mini_hvac_tier3: price_xxxxx
mini_pm_tier1: price_xxxxx
mini_pm_tier2: price_xxxxx
mini_pm_tier3: price_xxxxx
```

### 4.2 Price ID Mapping Table

| Product | Role | Tier | Quantity | Price | Stripe Price ID |
|---------|------|------|----------|-------|----------------|
| Mini | Homeowner | MSRP | 1 | $99.99 | `price_mini_homeowner` |
| Mini | HVAC Pro | Tier 1 | 1-20 | $71.67 | `price_mini_hvac_t1` |
| Mini | HVAC Pro | Tier 2 | 21-100 | $65.00 | `price_mini_hvac_t2` |
| Mini | HVAC Pro | Tier 3 | 101-500 | $58.00 | `price_mini_hvac_t3` |
| Mini | PM | Tier 1 | 1-20 | $64.50 | `price_mini_pm_t1` |
| Mini | PM | Tier 2 | 21-100 | $58.50 | `price_mini_pm_t2` |
| Mini | PM | Tier 3 | 101-500 | $52.20 | `price_mini_pm_t3` |
| Sensor | HVAC Pro | Tier 1 | 1-20 | $50.17 | `price_sensor_hvac_t1` |
| ... | ... | ... | ... | ... | ... |

### 4.3 Server-Side Price Validation

**Critical Security Rule:** NEVER trust client-side price calculations

**Validation Flow:**
1. Client sends: `{ productId, quantity, role }`
2. Server calculates tier based on quantity
3. Server looks up correct Price ID
4. Server returns Price ID (not price amount)
5. Client uses Price ID to create Stripe Checkout

### 4.4 Stripe Checkout vs Payment Intents

**Recommendation: Stripe Checkout (Hosted)**

**Why:**
- ✅ PCI compliance handled by Stripe
- ✅ No card data touches our servers
- ✅ Better UX (Stripe-hosted page)
- ✅ Automatic fraud detection
- ✅ Mobile optimized

**Alternative: Payment Intents (Embedded)**
- More control but more PCI scope
- Requires PCI SAQ-A at minimum

---

## 5. NETLIFY FUNCTIONS DESIGN

### 5.1 Required Functions

```
netlify/functions/
├── auth/
│   ├── login.js          # Validate credentials, issue JWT
│   ├── refresh.js         # Refresh expired tokens
│   ├── logout.js          # Invalidate session
│   └── verify.js          # Verify JWT token
├── pricing/
│   ├── get-price.js      # Get Price ID for product/role/quantity
│   └── validate-price.js # Validate price before checkout
├── stripe/
│   ├── create-checkout.js # Create Stripe Checkout session
│   └── webhook.js         # Handle Stripe webhooks
└── orders/
    └── create-order.js    # Create order record (after payment)
```

### 5.2 Function Security Headers

All functions should return:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'"
}
```

---

## 6. FRONTEND SECURITY HARDENING

### 6.1 Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline' https://js.stripe.com; 
           style-src 'self' 'unsafe-inline'; 
           img-src 'self' data: https:; 
           connect-src 'self' https://api.stripe.com https://*.netlify.app;">
```

### 6.2 Security Headers (netlify.toml)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

### 6.3 Input Validation

- All user inputs validated client-side AND server-side
- Use React Hook Form with validation schemas
- Sanitize all outputs (React does this automatically)
- Rate limiting on forms (already implemented)

---

## 7. ROUTING & PAGE STRUCTURE

### 7.1 Route Map

```
Public Routes:
/ → Home page
/product/mini → Mini product page (Homeowner)
/login → Login page
/signup → Signup page

Protected Routes (require auth):
/dashboard → Role-based dashboard redirect
/dashboard/homeowner → Homeowner dashboard
/dashboard/pro → HVAC Pro dashboard
/dashboard/pm → Property Manager dashboard

/business/pro/catalog → HVAC Pro catalog + pricing
/business/pro/cart → HVAC Pro cart
/business/pm/catalog → PM catalog + pricing
/business/pm/demo → PM demo request
```

### 7.2 Protected Route Component

```typescript
<ProtectedRoute 
  requiredRole="hvac_pro" 
  fallback="/login"
>
  <HVACProCatalog />
</ProtectedRoute>
```

---

## 8. PRICING CALCULATION LOGIC

### 8.1 Tier Calculation Function

```typescript
function calculateTier(quantity: number): 'tier_1' | 'tier_2' | 'tier_3' | 'contact_sales' {
  if (quantity >= 1 && quantity <= 20) return 'tier_1'
  if (quantity >= 21 && quantity <= 100) return 'tier_2'
  if (quantity >= 101 && quantity <= 500) return 'tier_3'
  return 'contact_sales' // > 500
}
```

### 8.2 Price Lookup Function

```typescript
function getPriceId(
  product: 'mini' | 'sensor' | 'bundle',
  role: 'homeowner' | 'hvac_pro' | 'property_manager',
  tier: 'tier_1' | 'tier_2' | 'tier_3' | 'msrp'
): string {
  // Server-side lookup table
  // Returns Stripe Price ID
}
```

---

## 9. IMPLEMENTATION PHASES

### Phase 1: Authentication Foundation (Week 1)
- [ ] Set up Netlify Identity
- [ ] Create auth context/provider
- [ ] Implement JWT token management
- [ ] Build login/signup pages
- [ ] Create ProtectedRoute component
- [ ] Test authentication flow

### Phase 2: Role Management (Week 1-2)
- [ ] Configure user roles in Netlify Identity
- [ ] Update signup to assign roles
- [ ] Create role-based routing
- [ ] Build role-specific dashboards
- [ ] Test role isolation

### Phase 3: Stripe Integration (Week 2)
- [ ] Set up Stripe account
- [ ] Create all Price IDs in Stripe
- [ ] Build pricing lookup function
- [ ] Create Stripe Checkout function
- [ ] Implement webhook handler
- [ ] Test payment flow

### Phase 4: Pricing Pages (Week 2-3)
- [ ] Build HVAC Pro catalog page
- [ ] Build Property Manager catalog page
- [ ] Create pricing tables with tiers
- [ ] Add quantity calculator
- [ ] Implement add-to-cart
- [ ] Test pricing display

### Phase 5: Security Hardening (Week 3)
- [ ] Implement CSP headers
- [ ] Add security headers
- [ ] Server-side price validation
- [ ] Rate limiting
- [ ] Input validation
- [ ] Security testing

### Phase 6: Testing & Deployment (Week 4)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance testing
- [ ] Production deployment
- [ ] Monitoring setup

---

## 10. SECURITY CHECKLIST

### Authentication & Authorization
- [ ] JWT tokens stored in HTTP-only cookies
- [ ] Token expiration implemented
- [ ] Refresh token mechanism
- [ ] Role validation on every protected route
- [ ] Server-side role checks in functions
- [ ] No role information in client-side code
- [ ] Secure password requirements
- [ ] Account lockout after failed attempts

### Payment Security
- [ ] No price calculations on client
- [ ] All prices validated server-side
- [ ] Stripe Price IDs used (not amounts)
- [ ] Webhook signature verification
- [ ] Idempotency keys for payments
- [ ] Order confirmation emails
- [ ] Payment logging (no card data)

### Data Protection
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted
- [ ] No PII in logs
- [ ] Secure session management
- [ ] CSRF protection
- [ ] XSS prevention

### Infrastructure
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Rate limiting enabled
- [ ] Error handling (no stack traces)
- [ ] Logging and monitoring
- [ ] Backup and recovery plan

---

## 11. NEXT STEPS

1. **Review this architecture** with your team
2. **Set up Netlify Identity** and configure roles
3. **Create Stripe account** and set up Price IDs
4. **Begin Phase 1 implementation** (Authentication)
5. **Iterate through phases** with security reviews

---

**This architecture prioritizes security while maintaining usability. All implementations should follow these guidelines.**

