# Core 1.0 Upgrade Form - Suggested Updates

## **Current Issues:**
1. Form doesn't clearly state it's NOT a payment form
2. Payment process ($10.99 shipping) is mentioned but unclear when/how it happens
3. Users might expect to pay immediately
4. Success message doesn't mention email with payment link

---

## **Suggested Updates:**

### **1. Heritage Section Description (Before Form Opens)**

**Current:**
```
Thank you for being an early adopter! As a Core 1.0 customer, you're eligible for a FREE upgrade to the new Mini. Simply share a photo of your installed Core 1.0 unit, and we'll ship you a brand new Mini at no cost—you just pay $10.99 shipping.
```

**Suggested:**
```
Thank you for being an early adopter! As a Core 1.0 customer, you're eligible for a FREE upgrade to the new Mini. Submit your request below with a photo of your installed Core 1.0 unit as proof of purchase. We'll review your submission and email you a secure payment link for $10.99 shipping. Once payment is received, we'll ship your new Mini within 2-3 business days.
```

**Key Changes:**
- ✅ Clarifies it's a "request" not immediate purchase
- ✅ Explains the email with payment link
- ✅ Sets expectations for timeline

---

### **2. Modal Title & Subtitle**

**Current Title:**
```
Free Upgrade to AC Drain Wiz Mini
```

**Current Subtitle:**
```
Complete the form below to claim your free upgrade. We'll review your submission and ship your new Mini within 2-3 business days.
```

**Suggested Title:**
```
Request Your Free Core 1.0 to Mini Upgrade
```

**Suggested Subtitle:**
```
This is a registration form, not a payment form. Submit your information and photo below. We'll review your submission and email you a secure payment link for $10.99 shipping. Your Mini will ship within 2-3 business days after payment is received.
```

**Key Changes:**
- ✅ "Request" instead of "Claim" - less transactional
- ✅ Explicitly states "not a payment form"
- ✅ Explains email with payment link
- ✅ Clarifies shipping happens AFTER payment

---

### **3. Add Process Steps Section (Visual Guide)**

**Add before form fields:**
```
<div className="upgrade-process-steps">
  <h4>How It Works:</h4>
  <ol>
    <li>Submit this form with your Core 1.0 photo</li>
    <li>We'll review and verify your submission</li>
    <li>You'll receive an email with a secure payment link ($10.99 shipping)</li>
    <li>Complete payment via the secure link</li>
    <li>Your Mini ships within 2-3 business days</li>
  </ol>
</div>
```

**Benefits:**
- ✅ Visual process flow
- ✅ Sets clear expectations
- ✅ Reduces confusion

---

### **4. Photo Field Label & Helper Text**

**Current:**
```
Photo of Installed Core 1.0 *
Please upload a clear photo showing your Core 1.0 unit installed on your AC drain line.
```

**Suggested:**
```
Photo of Installed Core 1.0 (Proof of Purchase) *
Please upload a clear photo showing your Core 1.0 unit installed on your AC drain line. This photo serves as proof of purchase and is required to process your upgrade request.
```

**Key Changes:**
- ✅ Adds "(Proof of Purchase)" to clarify purpose
- ✅ Explains why photo is needed

---

### **5. Acknowledgment Checkbox**

**Current:**
```
I understand that I will be charged $10.99 for shipping and handling. My new Mini will ship within 2-3 business days of approval.
```

**Suggested:**
```
I understand that after my submission is reviewed and approved, I will receive an email with a secure payment link for $10.99 shipping. My new Mini will ship within 2-3 business days after I complete the payment.
```

**Key Changes:**
- ✅ Clarifies payment happens AFTER approval
- ✅ Mentions email with payment link
- ✅ Sets correct timeline expectations

---

### **6. Submit Button Text**

**Current:**
```
Submit Upgrade Request
```

**Suggested:**
```
Submit Request (No Payment Required)
```

**Alternative:**
```
Request My Free Upgrade
```

**Key Changes:**
- ✅ Emphasizes no payment at this stage
- ✅ Less transactional language

---

### **7. Success Message**

**Current:**
```
Thank you! Your upgrade request has been submitted. We'll contact you within 24 hours.
```

**Suggested:**
```
Thank you! Your upgrade request has been submitted. We'll review your submission and email you within 24-48 hours with a secure payment link for $10.99 shipping. Please check your email (and spam folder) for next steps.
```

**Key Changes:**
- ✅ Mentions email with payment link
- ✅ Sets timeline (24-48 hours)
- ✅ Reminds to check spam folder
- ✅ Explains next steps

---

### **8. Add Info Box (Optional but Recommended)**

**Add at top of form, after subtitle:**
```
<div className="upgrade-info-box">
  <strong>📧 What Happens Next:</strong>
  <ul>
    <li>Submit this form (no payment required)</li>
    <li>We'll review your photo and verify your Core 1.0 purchase</li>
    <li>You'll receive an email with a secure payment link for $10.99 shipping</li>
    <li>Complete payment and your Mini ships within 2-3 business days</li>
  </ul>
</div>
```

**Benefits:**
- ✅ Quick visual reference
- ✅ Reduces anxiety about payment
- ✅ Sets clear expectations

---

## **Summary of Key Messaging Changes:**

1. ✅ **"Request" not "Claim"** - Less transactional
2. ✅ **"Registration form, not payment form"** - Explicit clarification
3. ✅ **"Email with secure payment link"** - Explains payment process
4. ✅ **"After approval/review"** - Sets correct timeline
5. ✅ **"Proof of purchase"** - Clarifies photo purpose
6. ✅ **Process steps** - Visual guide for users

---

## **Implementation Priority:**

**High Priority (Must Have):**
1. Modal subtitle update
2. Acknowledgment checkbox update
3. Success message update

**Medium Priority (Should Have):**
4. Heritage section description update
5. Submit button text update
6. Photo field helper text update

**Low Priority (Nice to Have):**
7. Process steps section
8. Info box at top of form

---

## **Testing Checklist:**

After updates:
- [ ] Form clearly states it's not a payment form
- [ ] Users understand they'll receive an email with payment link
- [ ] Timeline expectations are clear
- [ ] Photo purpose (proof of purchase) is clear
- [ ] Success message explains next steps
- [ ] No confusion about when payment happens

