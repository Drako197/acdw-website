# AC Drain Wiz Website - Development Roadmap

**Last Updated:** December 16, 2025  
**Project:** AC Drain Wiz E-commerce & Support Website  
**Repository:** https://github.com/acdrainwiz/acdw-website

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Current Features](#current-features)
4. [Recent Work Completed](#recent-work-completed)
5. [In-Progress Work](#in-progress-work)
6. [Planned Features](#planned-features)
7. [Technical Debt & TODOs](#technical-debt--todos)
8. [Architecture Overview](#architecture-overview)
9. [Development Workflow](#development-workflow)
10. [Deployment & Environment](#deployment--environment)

---

## 🎯 Project Overview

The AC Drain Wiz website is a comprehensive e-commerce and support platform serving multiple user types:
- **HVAC Contractors** - Business catalog with tiered pricing
- **Property Managers** - Business catalog with quantity discounts
- **Homeowners** - Product information and support resources
- **City/Code Officials (AHJs)** - Compliance and technical documentation

### Key Business Goals
- Enable online ordering with Stripe integration
- Provide self-service support and installation guides
- Manage user authentication and role-based access
- Support multiple product lines (Core, Mini, Sensor)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19.2.1 with TypeScript
- **Routing:** React Router DOM 7.9.4
- **Styling:** Tailwind CSS 3.4.18
- **UI Components:** Headless UI, Heroicons
- **Forms:** React Hook Form with Zod validation
- **Animations:** Framer Motion

### Backend & Services
- **Hosting:** Netlify
- **Authentication:** Clerk (v5.57.0)
- **Payments:** Stripe (v14.25.0)
- **Email:** Resend (v6.5.2)
- **Storage:** Netlify Blobs (v10.4.3)
- **Shipping:** ShipStation API integration

### Development Tools
- **Build Tool:** Vite 7.1.7
- **Type Checking:** TypeScript 5.9.3
- **Linting:** ESLint 9.36.0
- **Package Manager:** npm

---

## ✨ Current Features

### E-commerce
- ✅ Product catalog pages (Core, Mini, Sensor)
- ✅ Stripe Payment Element integration
- ✅ Tiered pricing for HVAC Pros and Property Managers
- ✅ Shopping cart and checkout flow
- ✅ Order confirmation emails
- ✅ Shipping address collection and validation
- ✅ ShipStation order creation

### Authentication & User Management
- ✅ Clerk-based authentication
- ✅ Role-based access control (homeowner, hvac_pro, property_manager)
- ✅ User profile management
- ✅ Protected routes with session validation
- ✅ Email verification flow
- ✅ Password reset functionality

### Support & Documentation
- ✅ Support Hub (hub-and-spoke navigation model)
- ✅ Installation & Setup guides page
- ✅ Product Support FAQs page
- ✅ Warranty & Returns information page
- ✅ Contact Support page
- ✅ Sensor Setup Wizard (3-step interactive flow with accordions)
- ✅ Recommended Installation Scenarios page (with visual guides)
- ✅ Contact support forms with validation

### User Experience
- ✅ Responsive design (mobile-first)
- ✅ Smooth page transitions
- ✅ Loading states and error handling
- ✅ Form validation and error messages
- ✅ Email preferences management
- ✅ Unsubscribe functionality

---

## 🎉 Recent Work Completed

### Sensor Setup Flow (December 2025)
- ✅ Created 3-step sensor setup wizard
  - Step 1: Create Account (with prerequisite modal)
  - Step 2: Physical Setup & WiFi Connection (accordion-based)
  - Step 3: Assign Sensor to Customer
- ✅ Added scroll-to-top on step navigation
- ✅ Implemented 3-bar progress indicator (blue → purple gradient)
- ✅ Added "Back to Support" navigation link
- ✅ Made ACDW logo clickable (navigates to home)
- ✅ Added setup images for all steps
- ✅ Model identification section (Battery vs DC models)
- ✅ Prerequisite callout with modal
- ✅ Accordion sections for Physical Setup and WiFi Connection
- ✅ Step 2 UX enhancements:
  - Both accordions start closed on page load
  - Pulsating outline animation on Physical Setup accordion (guides user to start there)
  - Continue button disabled until WiFi Connection accordion is opened
  - Smart scroll behavior: scrolls to notification message (not page top) when WiFi clicked first
  - Continue button opens WiFi accordion and scrolls to content when Physical Setup is open
  - Notification message with auto-dismiss (5 seconds) when user attempts wrong order

### Support Center Reorganization
- ✅ Implemented hub-and-spoke navigation model
- ✅ Created dedicated support pages:
  - Installation & Setup
  - Product Support
  - Warranty & Returns
  - Contact Support
- ✅ Added links to footer for new support pages

### Security Enhancements
- ✅ CSRF token generation and validation
- ✅ Bot detection and blacklisting
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Behavioral analysis
- ✅ IP reputation checking
- ✅ Netlify Blobs integration for token storage

---

## 🚧 In-Progress Work

_No active in-progress work at this time. All recent features have been completed and are ready for testing._

---

## 📅 Planned Features

### Short-Term (Q1 2026)

#### Dashboard Enhancements
- [ ] Connect Dashboard to real order data (Stripe API)
- [ ] Display user's order history
- [ ] Show purchased products with status
- [ ] Order tracking integration
- [ ] Product registration functionality

#### Mini Setup Guide
- [ ] Create Mini setup wizard (similar to Sensor setup)
- [ ] Reuse setup wizard template/component
- [ ] Add Mini-specific installation steps
- [ ] Include images and visual guides

#### Product Pages
- [ ] Complete Core product page
- [ ] Add product comparison features
- [ ] Enhanced product specifications
- [ ] Installation video integration

### Medium-Term (Q2 2026)

#### Advanced Features
- [ ] Customer management for contractors
- [ ] Multi-address support for customers
- [ ] Sensor assignment workflow
- [ ] Alert notification preferences
- [ ] Integration with ACDW Monitor API
- [ ] Real-time sensor status display

#### Business Tools
- [ ] Contractor dashboard enhancements
- [ ] Customer relationship management
- [ ] Inventory management
- [ ] Reporting and analytics

### Long-Term (Q3-Q4 2026)

#### Platform Expansion
- [ ] Mobile app (React Native consideration)
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced search functionality

---

## 🔧 Technical Debt & TODOs

### High Priority

1. **Dashboard Data Integration**
   - **File:** `src/pages/DashboardPage.tsx`
   - **Issue:** Currently using placeholder data (`HAS_ORDERS = false`, `HAS_PRODUCTS = false`)
   - **Action Required:** Connect to Stripe API to fetch real order data
   - **Lines:** 27-33

2. **Functions API Migration**
   - **Status:** Planned (see `Fix.plan.md` in cursor plans)
   - **Issue:** Functions currently use CommonJS (API v1), need to migrate to ES modules (API v2) for Blobs support
   - **Files Affected:**
     - `netlify/functions/validate-form-submission.js`
     - `netlify/functions/generate-csrf-token.js`
     - `netlify/functions/init-blobs-stores.js`
     - All utility files in `netlify/functions/utils/`

### Medium Priority

3. **Error Handling Improvements**
   - Add comprehensive error boundaries
   - Improve user-facing error messages
   - Add retry mechanisms for API calls

4. **Performance Optimization**
   - Image optimization and lazy loading
   - Code splitting for large components
   - Bundle size optimization

5. **Testing**
   - Add unit tests for critical components
   - Integration tests for checkout flow
   - E2E tests for user journeys

### Low Priority

6. **Code Cleanup**
   - Remove unused imports and components
   - Consolidate duplicate code
   - Improve TypeScript type definitions

7. **Documentation**
   - Add JSDoc comments to complex functions
   - Create component documentation
   - API documentation

---

## 🏗 Architecture Overview

### Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── checkout/        # Checkout and payment
│   ├── home/           # Homepage components
│   ├── layout/         # Header, Footer, ScrollToTop
│   └── setup/          # Sensor setup wizard
├── config/             # Configuration files (pricing, shipping, etc.)
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks
├── pages/              # Page components (35 pages)
├── types/               # TypeScript type definitions
└── utils/              # Utility functions

netlify/
├── functions/          # Serverless functions
│   ├── utils/          # Shared utilities
│   └── [function files]
└── edge-functions/     # Edge functions
```

### Key Architectural Patterns

1. **Component-Based Architecture**
   - Reusable components with clear props interfaces
   - Separation of concerns (presentation vs. logic)

2. **Protected Routes**
   - Page-level protection using `ProtectedRoute` component
   - Role-based access control
   - Session validation

3. **State Management**
   - React hooks for local state
   - Context API for global state (authentication)
   - URL state for navigation and routing

4. **Form Handling**
   - React Hook Form for form state
   - Zod for schema validation
   - Server-side validation in Netlify functions

### Authentication Flow

```
User → ProtectedRoute → AuthContext (Clerk) → Check Session
  ↓
If not authenticated → Redirect to /login
  ↓
Login → Clerk Authentication → Set Active Session
  ↓
Redirect to original destination or /dashboard
```

### Payment Flow

```
User → Checkout Page → Stripe Payment Element
  ↓
Create Payment Intent (Netlify Function)
  ↓
User completes payment → Stripe Webhook
  ↓
Create ShipStation order → Send confirmation email
  ↓
Redirect to success page
```

---

## 🔄 Development Workflow

### Branch Strategy
- **Main Branch:** Production-ready code
- **Dev Branch:** Development and staging
- **Feature Branches:** Individual features (merge to Dev)

### Getting Started

1. **Clone Repository**
   ```bash
   git clone https://github.com/acdrainwiz/acdw-website.git
   cd acdw-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add required API keys (Clerk, Stripe, Resend, etc.)

4. **Run Development Server**
   ```bash
   npm run dev
   # or with Netlify CLI
   npm run dev:netlify
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

### Code Standards

- **TypeScript:** Strict mode enabled
- **ESLint:** Configured with React hooks rules
- **Class Naming:** Human-friendly, semantic class names (e.g., `sensor-setup-wizard-progress-bar`)
- **Component Structure:** Functional components with TypeScript interfaces
- **File Naming:** PascalCase for components, kebab-case for utilities

### Commit Guidelines

- Use descriptive commit messages
- Include context (e.g., "Update sensor setup: add scroll to top")
- Group related changes together
- Run linting before committing

---

## 🚀 Deployment & Environment

### Environments

1. **Development (Dev Branch)**
   - Netlify branch deploy
   - Auto-deploys on push to `Dev` branch
   - URL: `[dev-branch].netlify.app`

2. **Production (Main Branch)**
   - Netlify production deploy
   - Manual or auto-deploy based on configuration
   - URL: `www.acdrainwiz.com`

### Build Process

1. TypeScript compilation (`tsc -b`)
2. Vite build (`vite build`)
3. Netlify deployment
4. Edge functions and serverless functions deployed

### Environment Variables

Required in Netlify dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `SHIPSTATION_API_KEY`
- `SHIPSTATION_API_SECRET`
- `SHIPSTATION_STORE_ID`
- `VITE_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- And various Stripe price IDs

### Monitoring

- Netlify build logs
- Netlify function logs
- Stripe webhook logs
- Resend email delivery logs

---

## 📞 Contact & Resources

### Key Contacts
- **Founder & CEO:** Alan Riddle (ariddle@acdrainwiz.com)
- **Phone:** (561) 654-5237

### Documentation
- [Stripe Integration Guide](./PAYMENT-ELEMENT-IMPLEMENTATION-COMPLETE.md)
- [Stripe Tax Implementation](./STRIPE-TAX-IMPLEMENTATION-COMPLETE.md)
- [Sensor Setup Flow Plan](./SENSOR-SETUP-FLOW-PLAN.md)
- [Support Center UX Options](./SUPPORT-CENTER-UX-OPTIONS.md)

### External Resources
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Router Documentation](https://reactrouter.com)

---

## 📝 Notes for New Developers

### Important Files to Know

1. **`src/App.tsx`** - Main routing configuration
2. **`src/contexts/AuthContext.tsx`** - Authentication logic
3. **`src/components/auth/ProtectedRoute.tsx`** - Route protection
4. **`src/components/setup/SetupWizard.tsx`** - Reusable setup wizard component
5. **`netlify/functions/validate-form-submission.js`** - Form submission handler
6. **`netlify/functions/stripe-webhook.js`** - Payment webhook handler

### Common Tasks

- **Adding a new page:** Create component in `src/pages/`, add route in `App.tsx`
- **Adding authentication:** Wrap component with `ProtectedRoute`
- **Adding a form:** Use React Hook Form, validate with Zod, submit via Netlify function
- **Styling:** Use Tailwind CSS classes, follow existing patterns
- **Adding images:** Place in `public/images/`, reference with `/images/...`

### Gotchas

- Header/Footer are hidden on `/checkout` and `/sensor-setup` routes
- Post-login redirect uses 3-tier priority system (query param → location state → default)
- Protected routes save attempted location for redirect after login
- Forms require CSRF tokens (generated client-side, validated server-side)

---

**Document maintained by:** Development Team  
**For questions or updates:** Contact project lead or create an issue in the repository

