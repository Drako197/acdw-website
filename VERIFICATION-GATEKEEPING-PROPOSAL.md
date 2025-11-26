# Verification & Gatekeeping Proposal
## Preventing Unauthorized Pro Account Creation

**Date:** January 2025  
**Purpose:** Implement verification requirements to ensure only legitimate HVAC contractors and property managers can create professional accounts.

---

## 🎯 Problem Statement

Currently, homeowners can easily create `hvac_pro` or `property_manager` accounts to access discounted pricing, bypassing the intended professional-only access. We need a verification system that:

1. **Prevents homeowners from creating pro accounts**
2. **Verifies legitimate business credentials**
3. **Maintains a smooth signup experience for real professionals**
4. **Can be automated or manually reviewed**

---

## 🔍 Research Findings

### Industry Standard Verification Methods

**For HVAC Contractors:**
- ✅ **State HVAC License Number** - Most common and verifiable
- ✅ **EPA Certification Number** - Required for refrigerant handling
- ✅ **Business License Number** - State/county business registration
- ✅ **Insurance Policy Number** - General liability insurance
- ✅ **Business Tax ID (EIN)** - Federal employer identification number

**For Property Managers:**
- ✅ **Business Tax ID (EIN)** - Most reliable identifier
- ✅ **Property Management License** - Required in many states
- ✅ **Business Registration Number** - State business license
- ✅ **Number of Units Managed** - Validates scale of operation

### Verification Approaches

1. **Real-time API Verification** (Best, but requires API access)
2. **Manual Review** (Most reliable, but slower)
3. **Hybrid Approach** (Automated checks + manual review for edge cases)

---

## 💡 Recommended Solution

### **Primary Verification Method: State HVAC License Number**

**Why This Works Best:**
- ✅ **Unique to contractors** - Homeowners don't have HVAC licenses
- ✅ **Publicly verifiable** - Most states have online license lookup databases
- ✅ **Industry standard** - Contractors expect to provide this
- ✅ **Hard to fake** - License numbers follow state-specific formats
- ✅ **State-specific** - Can validate format and potentially verify via API

**For Property Managers: Business Tax ID (EIN)**
- ✅ **Unique to businesses** - Homeowners don't have EINs
- ✅ **Standard format** - XX-XXXXXXX (easy to validate format)
- ✅ **Required for business operations** - Legitimate property managers have this
- ✅ **Can be verified** - IRS database (though API access is limited)

---

## 🏗️ Implementation Plan

### Phase 1: Basic Verification (Immediate)

**Add Required Fields to Signup Form:**

1. **For HVAC Pros:**
   - State (dropdown)
   - HVAC License Number (text input with format validation)
   - Optional: EPA Certification Number

2. **For Property Managers:**
   - Business Tax ID / EIN (text input with format validation: XX-XXXXXXX)
   - Optional: Property Management License Number

**Validation Rules:**
- Format validation (regex patterns)
- Required field enforcement
- Store in Clerk `unsafeMetadata` for review

**User Experience:**
- Show clear messaging: "Professional verification required"
- Explain why: "To ensure you receive professional pricing"
- Set account status to "pending_verification" initially

---

### Phase 2: Automated Verification (Future Enhancement)

**Option A: State License API Integration**
- Integrate with state licensing board APIs (where available)
- Real-time verification during signup
- Auto-approve verified licenses

**Option B: Third-Party Verification Service**
- Services like:
  - **VeriFast** - Business verification API
  - **Plaid** - Business identity verification
  - **Onfido** - Document verification
- Verify business documents uploaded by user

**Option C: Hybrid Approach**
- Format validation + basic checks (automated)
- Manual review for all accounts (initially)
- Build trust database of verified businesses
- Auto-approve repeat customers

---

### Phase 3: Manual Review Workflow

**Admin Dashboard Features:**
- List of pending verifications
- View submitted credentials
- Approve/reject with notes
- Email notifications to users

**Review Criteria:**
- License number format matches state
- Business name matches license holder
- Email domain matches business (if business email)
- Cross-reference with public databases

---

## 📋 Detailed Implementation

### 1. Update Signup Form

**New Fields for HVAC Pros:**
```typescript
{
  state: string,              // Required: State dropdown
  licenseNumber: string,      // Required: HVAC license number
  epaCertNumber?: string      // Optional: EPA certification
}
```

**New Fields for Property Managers:**
```typescript
{
  businessTaxId: string,      // Required: EIN (XX-XXXXXXX format)
  pmLicenseNumber?: string    // Optional: Property management license
}
```

### 2. Validation Logic

**HVAC License Number Validation:**
- State-specific format validation
- Example patterns:
  - Florida: `HVAC-XXXXX` or `CACXXXXXX`
  - California: `XXXXXX` (6 digits)
  - Texas: `TACL-XXXXX`
- Check against state format database

**EIN Validation:**
- Format: `XX-XXXXXXX` (2 digits, hyphen, 7 digits)
- Basic checksum validation
- Verify it's not a common fake pattern

### 3. Account Status Management

**New Account Statuses:**
- `pending_verification` - New signup, awaiting review
- `verified` - Credentials verified, full access
- `rejected` - Verification failed, limited access
- `needs_review` - Flagged for manual review

### 4. Protected Route Updates

**Update ProtectedRoute Component:**
- Check `verificationStatus` in addition to role
- Redirect unverified pro accounts to verification page
- Show verification status in dashboard

### 5. Verification Page

**New Route:** `/dashboard/verification`
- Display verification status
- Show submitted credentials (masked)
- Allow resubmission if rejected
- Contact support option

---

## 🛡️ Security Considerations

### Data Storage
- Store sensitive data (license numbers, EINs) in Clerk `unsafeMetadata`
- Encrypt at rest (Clerk handles this)
- Never display full license numbers publicly
- Mask sensitive data in UI (show last 4 digits only)

### Validation
- Server-side validation (Netlify Function)
- Rate limiting on verification submissions
- Prevent duplicate license number usage
- Log all verification attempts

### Privacy
- Clear privacy policy about data collection
- Explain why verification is required
- Allow users to request data deletion
- Comply with GDPR/CCPA if applicable

---

## 📊 State License Format Database

**Example State Formats (to be expanded):**

| State | Format | Example | Verification Method |
|-------|--------|---------|---------------------|
| Florida | `CACXXXXXX` or `HVAC-XXXXX` | `CAC123456` | Manual/API |
| California | `XXXXXX` (6 digits) | `123456` | Manual/API |
| Texas | `TACL-XXXXX` | `TACL-12345` | Manual/API |
| New York | `XXXXX` (5 digits) | `12345` | Manual/API |
| Arizona | `ROC-XXXXXX` | `ROC-123456` | Manual/API |

**Implementation:**
- Create validation regex for each state
- Store in configuration file
- Update as new states are added

---

## 🎨 User Experience Flow

### Signup Flow (HVAC Pro)

1. **User selects "HVAC Professional" role**
2. **Fills out standard signup form** (name, email, password, company)
3. **New section appears:** "Professional Verification"
   - State dropdown
   - License number input
   - Helper text: "Your license number helps us verify your professional status"
4. **Submit signup**
5. **Account created with status: `pending_verification`**
6. **Email sent:** "Your account is pending verification"
7. **Dashboard shows:** "Verification in progress" banner
8. **Admin reviews and approves/rejects**
9. **User receives email:** "Your account has been verified" or "Additional information needed"

### Verification Status Display

**Dashboard Banner (Pending):**
```
⚠️ Account Verification Pending
Your professional account is being reviewed. You'll receive an email once verification is complete.
[Contact Support] [Check Status]
```

**Dashboard Banner (Rejected):**
```
❌ Verification Required
We couldn't verify your professional credentials. Please update your information.
[Update Information] [Contact Support]
```

---

## 🔄 Alternative Approaches Considered

### Option 1: Email Domain Verification
- **Pros:** Easy to implement, automated
- **Cons:** Many contractors use personal emails, easy to fake business domains

### Option 2: Business Phone Verification
- **Pros:** Can verify via SMS/call
- **Cons:** Homeowners can get business phone numbers, not unique enough

### Option 3: Business Address Verification
- **Pros:** Validates physical location
- **Cons:** Homeowners can use any address, requires mail verification (slow)

### Option 4: Manual Application Process
- **Pros:** Most reliable, can verify thoroughly
- **Cons:** Slower signup, higher friction, requires admin resources

**Recommendation:** Start with License Number/EIN (Phase 1), then add automated verification (Phase 2) as resources allow.

---

## 📈 Success Metrics

**Key Performance Indicators:**
- Reduction in unauthorized pro account creation
- Verification approval rate
- Time to verification (manual review)
- User satisfaction with verification process
- Support tickets related to verification

**Target Goals:**
- < 5% false positives (legitimate users rejected)
- < 1% false negatives (homeowners approved as pros)
- < 24 hour verification turnaround (manual review)
- > 90% user satisfaction with process

---

## 🚀 Implementation Priority

### Immediate (This Week)
1. ✅ Add license number field to HVAC Pro signup
2. ✅ Add EIN field to Property Manager signup
3. ✅ Implement format validation
4. ✅ Store in Clerk metadata
5. ✅ Set account status to `pending_verification`

### Short Term (Next 2 Weeks)
6. Create verification status page
7. Build admin review interface
8. Add verification status checks to protected routes
9. Email notifications for verification status

### Medium Term (Next Month)
10. State license format database
11. Automated format validation
12. Manual review workflow
13. Analytics dashboard

### Long Term (Future)
14. API integration for real-time verification
15. Third-party verification service integration
16. Trust database for repeat customers
17. Auto-approval for verified businesses

---

## 💻 Technical Implementation Details

### Database Schema (Clerk Metadata)

```typescript
interface VerificationData {
  status: 'pending' | 'verified' | 'rejected' | 'needs_review'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  
  // HVAC Pro specific
  state?: string
  licenseNumber?: string        // Masked in UI
  epaCertNumber?: string
  
  // Property Manager specific
  businessTaxId?: string        // Masked in UI
  pmLicenseNumber?: string
}
```

### Netlify Function: Verify License

```javascript
// netlify/functions/verify-professional.js
// Validates license number format and optionally checks state database
```

### State License Format Config

```typescript
// src/config/licenseFormats.ts
export const LICENSE_FORMATS = {
  FL: {
    pattern: /^(CAC|HVAC-)\d{5,8}$/i,
    example: 'CAC123456',
    lookupUrl: 'https://www.myfloridalicense.com/...'
  },
  CA: {
    pattern: /^\d{6}$/,
    example: '123456',
    lookupUrl: 'https://www.cslb.ca.gov/...'
  },
  // ... more states
}
```

---

## ✅ Recommendation Summary

**Best Approach: State HVAC License Number + Business EIN**

1. **HVAC Contractors:** Require State + License Number
   - Most unique identifier
   - Industry standard
   - Verifiable via public databases

2. **Property Managers:** Require Business Tax ID (EIN)
   - Unique to businesses
   - Standard format
   - Required for legitimate operations

3. **Implementation:** Start with format validation, add manual review, then automate

4. **User Experience:** Clear messaging, quick format checks, transparent status

This approach balances security, user experience, and implementation complexity.

---

## 📝 Next Steps

1. **Review this proposal** - Confirm approach and requirements
2. **Create implementation plan** - Break down into tasks
3. **Update signup form** - Add verification fields
4. **Build validation logic** - Format and basic checks
5. **Create verification workflow** - Admin review process
6. **Test with real users** - Get feedback on UX
7. **Iterate and improve** - Based on results

---

**Questions to Consider:**
- Do we want to allow signup with pending verification, or block until verified?
- Should we provide a grace period for existing pro accounts?
- How strict should format validation be initially?
- Do we want to integrate with state APIs immediately or start manual?

