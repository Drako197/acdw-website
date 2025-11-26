# Verification Validation - Testing Guide

**Date:** January 2025  
**Status:** Phase 1 - Format Validation Only

---

## 📋 Current Validation Summary

### **Important Note:**
We are currently doing **FORMAT VALIDATION ONLY**. We validate that the license numbers and EINs match expected patterns, but we **DO NOT verify** that they are real, active, or belong to the user.

This means:
- ✅ Format is checked (pattern matching)
- ❌ Authenticity is NOT verified
- ❌ License ownership is NOT verified
- ❌ License status is NOT checked

---

## 🔧 HVAC Professional Validation

### Required Fields:
1. **Company Name** - Must be at least 2 characters
2. **State** - Must be selected from dropdown
3. **License Number** - Required, validated against state-specific format

### License Number Format Validation:

#### States with Specific Patterns:

| State | Format Pattern | Example Valid Values | Invalid Examples |
|-------|---------------|---------------------|------------------|
| **Florida (FL)** | `CAC` or `HVAC-` or `HVAC` followed by 5-8 digits | `CAC123456`, `HVAC-12345`, `HVAC123456` | `123456`, `ABC123` |
| **California (CA)** | Exactly 6 digits | `123456`, `000001` | `12345`, `1234567`, `ABC123` |
| **Texas (TX)** | `TACL-` or `TACL` followed by 4-6 digits | `TACL-12345`, `TACL12345` | `12345`, `TACL-123` |
| **New York (NY)** | Exactly 5 digits | `12345`, `00001` | `1234`, `123456`, `ABC12` |
| **Arizona (AZ)** | `ROC-` or `ROC` followed by 5-8 digits | `ROC-123456`, `ROC123456` | `123456`, `ROC-123` |
| **North Carolina (NC)** | 5-7 digits | `12345`, `123456`, `1234567` | `1234`, `12345678` |
| **Georgia (GA)** | 6-8 digits | `123456`, `1234567`, `12345678` | `12345`, `123456789` |

#### All Other States:
- **Default Pattern:** Alphanumeric with hyphens, 4-15 characters
- **Examples:** `LIC-12345`, `HVAC-ABC123`, `12345-ABC`
- **Invalid:** `123` (too short), `ABCDEFGHIJKLMNOP` (too long)

### Test Values for HVAC Pros:

**Valid Test Cases:**
- State: `FL`, License: `CAC123456` ✅
- State: `CA`, License: `123456` ✅
- State: `TX`, License: `TACL-12345` ✅
- State: `NY`, License: `12345` ✅
- State: `AZ`, License: `ROC-123456` ✅
- State: `NC`, License: `123456` ✅
- State: `GA`, License: `1234567` ✅
- State: `CO` (not in specific list), License: `LIC-12345` ✅

**Invalid Test Cases:**
- State: `FL`, License: `123456` ❌ (missing CAC/HVAC prefix)
- State: `CA`, License: `12345` ❌ (only 5 digits, needs 6)
- State: `TX`, License: `12345` ❌ (missing TACL prefix)
- State: `NY`, License: `1234` ❌ (only 4 digits, needs 5)
- No state selected, License: `123456` ❌ (state required)

---

## 🏢 Property Manager Validation

### Required Fields:
1. **Company Name** - Must be at least 2 characters
2. **Business Tax ID (EIN)** - Required, must match EIN format

### EIN Format Validation:

**Format:** `XX-XXXXXXX`
- 2 digits, hyphen, 7 digits
- Total: 10 characters (including hyphen)
- Auto-formatted as user types

**Pattern:** `/^\d{2}-\d{7}$/`

### Test Values for Property Managers:

**Valid Test Cases:**
- EIN: `12-3456789` ✅
- EIN: `99-9999999` ✅
- EIN: `01-2345678` ✅
- EIN: `12 3456789` ✅ (spaces auto-removed, becomes `12-3456789`)

**Invalid Test Cases:**
- EIN: `123456789` ❌ (missing hyphen)
- EIN: `1-23456789` ❌ (only 1 digit before hyphen)
- EIN: `12-34567` ❌ (only 5 digits after hyphen, needs 7)
- EIN: `12-34567890` ❌ (8 digits after hyphen, needs 7)
- EIN: `AB-3456789` ❌ (letters not allowed)
- EIN: `12-345678` ❌ (missing last digit)

---

## 🧪 Testing Scenarios

### Scenario 1: HVAC Pro Signup (Valid)
```
Role: HVAC Professional
Company: "ABC HVAC Services"
State: "FL"
License: "CAC123456"
```
**Result:** ✅ Passes validation, account created with `verification.status = 'pending_verification'`

### Scenario 2: HVAC Pro Signup (Invalid Format)
```
Role: HVAC Professional
Company: "ABC HVAC Services"
State: "CA"
License: "12345"  (only 5 digits)
```
**Result:** ❌ Validation error: "Invalid format. Expected: 6-digit license number (Example: 123456)"

### Scenario 3: Property Manager Signup (Valid)
```
Role: Property Manager
Company: "ABC Property Management"
EIN: "12-3456789"
```
**Result:** ✅ Passes validation, account created with `verification.status = 'pending_verification'`

### Scenario 4: Property Manager Signup (Invalid Format)
```
Role: Property Manager
Company: "ABC Property Management"
EIN: "123456789"  (missing hyphen)
```
**Result:** ❌ Validation error: "Invalid format. Expected: XX-XXXXXXX (e.g., 12-3456789)"

### Scenario 5: Missing Required Fields
```
Role: HVAC Professional
Company: "ABC HVAC"
State: (not selected)
License: (empty)
```
**Result:** ❌ Validation errors for both state and license number

---

## 📊 What Gets Stored

### Clerk Metadata Structure:

```typescript
{
  role: 'hvac_pro' | 'property_manager',
  company: string,
  verification: {
    status: 'pending_verification',
    submittedAt: '2025-01-26T...',
    
    // HVAC Pro specific:
    state?: string,
    licenseNumber?: string,
    
    // Property Manager specific:
    businessTaxId?: string
  }
}
```

### Example HVAC Pro Data:
```json
{
  "role": "hvac_pro",
  "company": "ABC HVAC Services",
  "verification": {
    "status": "pending_verification",
    "submittedAt": "2025-01-26T12:00:00.000Z",
    "state": "FL",
    "licenseNumber": "CAC123456"
  }
}
```

### Example Property Manager Data:
```json
{
  "role": "property_manager",
  "company": "ABC Property Management",
  "verification": {
    "status": "pending_verification",
    "submittedAt": "2025-01-26T12:00:00.000Z",
    "businessTaxId": "12-3456789"
  }
}
```

---

## ⚠️ Current Limitations

1. **No Authenticity Verification**
   - We don't check if license numbers are real
   - We don't verify EINs against IRS database
   - We don't check if licenses are active/expired

2. **No Ownership Verification**
   - We don't verify the license belongs to the user
   - We don't verify the EIN matches the company name

3. **No Duplicate Checking**
   - Same license number can be used by multiple accounts
   - Same EIN can be used by multiple accounts

4. **Format Only**
   - We only validate that the format matches expected patterns
   - A fake but correctly formatted license will pass

---

## 🚀 Future Enhancements (Phase 2+)

1. **Manual Review Workflow**
   - Admin reviews submitted credentials
   - Cross-reference with public databases
   - Approve/reject with notes

2. **API Integration**
   - Real-time license verification via state APIs
   - EIN verification via IRS database (if available)

3. **Duplicate Detection**
   - Check if license/EIN already exists
   - Flag for review if duplicate found

4. **Enhanced Validation**
   - EIN checksum validation
   - License number checksum validation (where applicable)

---

## 🧪 Quick Test Checklist

### HVAC Pro Testing:
- [ ] Valid FL license: `CAC123456`
- [ ] Valid CA license: `123456`
- [ ] Valid TX license: `TACL-12345`
- [ ] Invalid format (wrong state pattern)
- [ ] Missing state
- [ ] Missing license number

### Property Manager Testing:
- [ ] Valid EIN: `12-3456789`
- [ ] Invalid EIN (missing hyphen): `123456789`
- [ ] Invalid EIN (wrong length): `1-23456789`
- [ ] Missing EIN

---

## 📝 Notes for Testing

1. **Format validation is case-insensitive** - `cac123456` works the same as `CAC123456`

2. **Auto-formatting** - EIN field auto-formats as you type (adds hyphen)

3. **Real-time validation** - Errors show as you type/blur fields

4. **State change triggers re-validation** - Changing state re-validates license number

5. **All validation is client-side** - No server-side validation yet (Phase 2)

---

**Last Updated:** January 2025  
**Phase:** 1 - Format Validation Only

