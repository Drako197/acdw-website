# Remaining Forms Setup Guide

Now that Sales Inquiry is working, let's set up the other 6 forms.

---

## **Form Priority Order:**

1. ✅ **Sales Inquiry** - DONE
2. **General Contact** - Next (simplest)
3. **Support Request** - Important for customer service
4. **Find Installer** - Important for lead generation
5. **Demo Request** - Important for sales
6. **Promo Signup** - Marketing/lead generation
7. **Core 1.0 Upgrade** - Product-specific

---

## **Zap 2: General Contact → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, phone, company (optional), message, referralSource, customerType, consent

### **Standard Fields (Already in Pipedrive):**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`
- Phone → `phone`
- Organization Name → `company`
- Notes → `message` (or use message custom field)

### **Custom Fields Needed:**

1. **customerType** (Dropdown) - NEW FIELD
   - Options: `homeowner`, `hvac-contractor`, `property-manager`, `city-official`, `other`

2. **referralSource** (Dropdown) - ALREADY CREATED (from Sales)
   - Options: `search-engine`, `social-media`, `hvac-contractor`, `friend-family`, `trade-show`, `online-ad`, `article-blog`, `other`

3. **consent** (Yes/No) - ALREADY CREATED (from Sales)
   - Already exists

4. **message** (Textarea) - Optional
   - Can use Pipedrive's built-in Notes field, or create custom field

### **Zap Setup:**
- Trigger: Netlify → `contact-general`
- Action: Pipedrive → Create Person
- Map all fields above

---

## **Zap 3: Support Request → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, phone, company (optional), message, referralSource, customerType, consent, **product**, **issueType**, **priority**

### **Standard Fields:**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`
- Phone → `phone`
- Organization Name → `company`
- Notes → `message`

### **Custom Fields Needed:**

1. **customerType** (Dropdown) - ALREADY CREATED (from General)
2. **referralSource** (Dropdown) - ALREADY CREATED
3. **consent** (Yes/No) - ALREADY CREATED
4. **product** (Dropdown) - NEW FIELD
   - Options: `mini`, `sensor`, `mini-sensor`, `core-1.0`, `other`
5. **issueType** (Dropdown) - NEW FIELD
   - Options: `installation`, `technical`, `warranty`, `parts`, `other`
6. **priority** (Dropdown) - NEW FIELD
   - Options: `low`, `medium`, `high`

### **Zap Setup:**
- Trigger: Netlify → `contact-support`
- Action: Pipedrive → Create Person
- Map all fields above

---

## **Zap 4: Find Installer → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, phone, company (optional), message, referralSource, customerType, consent, **location**, **preferredContact**, **productToInstall**

### **Standard Fields:**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`
- Phone → `phone`
- Organization Name → `company`
- Notes → `message`

### **Custom Fields Needed:**

1. **customerType** (Dropdown) - ALREADY CREATED
2. **referralSource** (Dropdown) - ALREADY CREATED
3. **consent** (Yes/No) - ALREADY CREATED
4. **location** (Text) - NEW FIELD
   - Field type: Text (not dropdown)
5. **preferredContact** (Dropdown) - NEW FIELD
   - Options: `email`, `phone`, `either`
6. **productToInstall** (Dropdown) - NEW FIELD
   - Options: `mini`, `sensor`, `mini-sensor`

### **Zap Setup:**
- Trigger: Netlify → `contact-installer`
- Action: Pipedrive → Create Person
- Map all fields above

---

## **Zap 5: Demo Request → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, phone, company (required), message, referralSource, customerType, consent, **demoType**, **preferredDate**, **preferredTime`

### **Standard Fields:**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`
- Phone → `phone`
- Organization Name → `company`
- Notes → `message`

### **Custom Fields Needed:**

1. **customerType** (Dropdown) - ALREADY CREATED
2. **referralSource** (Dropdown) - ALREADY CREATED
3. **consent** (Yes/No) - ALREADY CREATED
4. **demoType** (Dropdown) - NEW FIELD
   - Options: `in-person`, `virtual`, `product-showcase`, `compliance-review`
5. **preferredDate** (Date) - NEW FIELD
   - Field type: Date
6. **preferredTime** (Dropdown) - NEW FIELD
   - Options: `morning`, `afternoon`, `flexible`

### **Zap Setup:**
- Trigger: Netlify → `contact-demo`
- Action: Pipedrive → Create Person
- Map all fields above

**Optional:** Create Activity in Pipedrive for demo scheduling

---

## **Zap 6: Promo Signup → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, consent

### **Standard Fields:**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`

### **Custom Fields Needed:**

1. **consent** (Yes/No) - ALREADY CREATED

### **Zap Setup:**
- Trigger: Netlify → `promo-signup`
- Action: Pipedrive → Create Person
- Map fields above

**Optional:** Add Tag/Label "Promo Subscriber" to identify these contacts

---

## **Zap 7: Core 1.0 Upgrade → Pipedrive**

### **Fields in Form:**
- firstName, lastName, email, phone, **photo**, **street**, **unit**, **city**, **state**, **zip**, **acknowledge**

### **Standard Fields:**
- First Name → `firstName`
- Last Name → `lastName`
- Email → `email`
- Phone → `phone`

### **Custom Fields Needed:**

1. **photo** (Text) - NEW FIELD
   - Field type: Text (URL or file reference)
2. **street** (Text) - NEW FIELD
   - Field type: Text
3. **unit** (Text) - NEW FIELD
   - Field type: Text
4. **city** (Text) - NEW FIELD
   - Field type: Text
5. **state** (Text) - NEW FIELD
   - Field type: Text
6. **zip** (Text) - NEW FIELD
   - Field type: Text
7. **acknowledge** (Yes/No) - NEW FIELD
   - Field type: Yes/No

### **Zap Setup:**
- Trigger: Netlify → `core-upgrade`
- Action: Pipedrive → Create Person
- Map all fields above

**Optional:** Create Deal with title "Core 1.0 Upgrade - [city], [state]"

---

## **Summary of New Custom Fields to Create:**

### **Already Created (from Sales Inquiry):**
- ✅ referralSource (Dropdown)
- ✅ consent (Yes/No)
- ✅ role (Dropdown)
- ✅ annualVolume (Dropdown)
- ✅ interest (Dropdown)

### **New Fields to Create:**

**For General Contact:**
- customerType (Dropdown)

**For Support:**
- product (Dropdown)
- issueType (Dropdown)
- priority (Dropdown)

**For Installer:**
- location (Text)
- preferredContact (Dropdown)
- productToInstall (Dropdown)

**For Demo:**
- demoType (Dropdown)
- preferredDate (Date)
- preferredTime (Dropdown)

**For Core Upgrade:**
- photo (Text)
- street (Text)
- unit (Text)
- city (Text)
- state (Text)
- zip (Text)
- acknowledge (Yes/No)

**Total New Fields:** 15 custom fields

---

## **Recommended Order:**

1. **Create all custom fields in Pipedrive first** (one-time setup)
2. **Then create Zaps one by one** (faster since fields already exist)
3. **Test each Zap** as you create it

---

## **Quick Reference: All Dropdown Values**

See `PIPEDRIVE-DROPDOWN-VALUES.md` for exact values for each dropdown field.

