# Pipedrive Custom Fields Setup Guide

This guide will help you create all necessary custom fields in Pipedrive and map them correctly in Zapier.

---

## **Step 1: Create Custom Fields in Pipedrive**

### **How to Create Custom Fields:**

1. **Log into Pipedrive**
2. Go to **Settings** (gear icon in top right)
3. Click **Data fields** in the left sidebar
4. Select **Person** (for contact fields)
5. Click **+ Add field** button
6. Fill in:
   - **Field name**: (use exact names below)
   - **Field type**: (see recommendations below)
   - Click **Save**

---

## **Custom Fields to Create (For All Forms):**

### **Person (Contact) Custom Fields:**

| Field Name | Field Type | Used In Forms | Notes |
|------------|-----------|---------------|-------|
| `customerType` | Dropdown | All contact forms | Options: Homeowner, Contractor, Property Manager, City/Code Official |
| `referralSource` | Text | All contact forms | How they found you |
| `message` | Textarea | All contact forms | Main message/notes |
| `consent` | Yes/No | All contact forms | Marketing consent |
| `product` | Dropdown | Support | ACDW Mini, ACDW Sensor, ACDW Core 1.0 |
| `issueType` | Dropdown | Support | Technical Issue, Installation Help, Warranty, Other |
| `priority` | Dropdown | Support | Low, Medium, High, Urgent |
| `role` | Dropdown | Sales | Business Owner, Purchasing Manager, Operations Manager, Other |
| `annualVolume` | Dropdown | Sales | 1-50 units, 51-200 units, 201-500 units, 500+ units |
| `interest` | Dropdown | Sales | Bulk Pricing, Partnership, Product Info, Other |
| `location` | Text | Installer | City/State/Region |
| `preferredContact` | Dropdown | Installer | Email, Phone, Either |
| `productToInstall` | Dropdown | Installer | ACDW Mini, ACDW Sensor, ACDW Mini & Sensor Combo |
| `demoType` | Dropdown | Demo | In-Person, Virtual, Product Showcase, Compliance Review |
| `preferredDate` | Date | Demo | Preferred demo date |
| `preferredTime` | Dropdown | Demo | Morning, Afternoon, Flexible |
| `city` | Text | Demo | City where demo is requested ⭐ NEW |
| `state` | Text | Demo | State (2-letter code) ⭐ NEW |
| `zip` | Text | Demo | ZIP code (5 digits) ⭐ NEW |
| `productsOfInterest` | Text | Demo | Multi-select products (comma-separated) ⭐ NEW |
| `numberOfAttendees` | Dropdown | Demo | 1-2, 3-5, 6-10, 10+ ⭐ NEW |
| `portfolioSize` | Dropdown | Demo | 1-10, 11-50, 51-100, 101-250, 251-500, 500+, Not Applicable ⭐ NEW |
| `demoFocus` | Dropdown | Demo | Installation, Monitoring, Compliance, ROI, Product Features, Custom ⭐ NEW |

---

## **Step 2: Form-by-Form Zap Configuration**

### **Zap 1: Sales Inquiry → Pipedrive**

**Standard Fields (Built-in):**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`
- **Organization Name** → `company`

**Custom Fields to Map:**
- **customerType** → `customerType`
- **referralSource** → `referralSource`
- **message** → `message` (or use Notes field)
- **consent** → `consent`
- **role** → `role`
- **annualVolume** → `annualVolume`
- **interest** → `interest`

---

### **Zap 2: General Contact → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`
- **Organization Name** → `company`

**Custom Fields:**
- **customerType** → `customerType`
- **referralSource** → `referralSource`
- **message** → `message` (or Notes)
- **consent** → `consent`

---

### **Zap 3: Support Request → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`
- **Organization Name** → `company`

**Custom Fields:**
- **customerType** → `customerType`
- **referralSource** → `referralSource`
- **message** → `message` (or Notes)
- **consent** → `consent`
- **product** → `product`
- **issueType** → `issueType`
- **priority** → `priority`

---

### **Zap 4: Find Installer → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`
- **Organization Name** → `company`

**Custom Fields:**
- **customerType** → `customerType`
- **referralSource** → `referralSource`
- **message** → `message` (or Notes)
- **consent** → `consent`
- **location** → `location`
- **preferredContact** → `preferredContact`
- **productToInstall** → `productToInstall`

---

### **Zap 5: Demo Request → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`
- **Organization Name** → `company`

**Custom Fields:**
- **customerType** → `customerType`
- **referralSource** → `referralSource`
- **message** → `message` (or Notes)
- **consent** → `consent`
- **demoType** → `demoType`
- **preferredDate** → `preferredDate`
- **preferredTime** → `preferredTime`
- **city** → `city` ⭐ NEW
- **state** → `state` ⭐ NEW
- **zip** → `zip` ⭐ NEW
- **productsOfInterest** → `productsOfInterest` ⭐ NEW
- **numberOfAttendees** → `numberOfAttendees` ⭐ NEW
- **portfolioSize** → `portfolioSize` ⭐ NEW (optional)
- **demoFocus** → `demoFocus` ⭐ NEW (optional)

**See `DEMO-FORM-PIPEDRIVE-UPDATE.md` for detailed setup instructions.**

---

### **Zap 6: Promo Signup → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`

**Custom Fields:**
- **consent** → `consent`

**Optional:**
- Add a **Tag/Label**: "Promo Subscriber" to identify these contacts

---

### **Zap 7: Core 1.0 Upgrade → Pipedrive**

**Standard Fields:**
- **First Name** → `firstName`
- **Last Name** → `lastName`
- **Email** → `email`
- **Phone** → `phone`

**Custom Fields (Create Address Fields):**
- **street** → `street` (Text field)
- **unit** → `unit` (Text field)
- **city** → `city` (Text field)
- **state** → `state` (Text field)
- **zip** → `zip` (Text field)
- **acknowledge** → `acknowledge` (Yes/No field)

**Optional:**
- Create a **Deal** with title: "Core 1.0 Upgrade - [city], [state]"

---

## **Step 3: Mapping Fields in Zapier**

### **After Creating Custom Fields in Pipedrive:**

1. **Go back to your Zap**
2. **Edit the Action step** (Pipedrive → Create Person)
3. **Scroll down** to find your custom fields
4. **Map each field**:
   - Click the dropdown next to your custom field name
   - Select the corresponding field from Netlify data
   - Example: `customerType` (Pipedrive) → `customerType` (from Netlify)

### **Important Notes:**

- **Field names must match exactly** (case-sensitive)
- **If a field doesn't appear**, refresh Zapier or wait a few minutes for sync
- **For dropdown fields**, make sure the values in Pipedrive match what your forms send
- **For Yes/No fields**, Pipedrive expects "yes"/"no" strings (which we're already sending)

---

## **Step 4: Testing**

After mapping all fields:

1. **Test your Zap** with a real form submission
2. **Check Pipedrive** to verify all fields are populated correctly
3. **Verify dropdown values** match what you expect
4. **Adjust field mappings** if needed

---

## **Quick Reference: Form Field Names**

All forms send these field names to Netlify:
- `firstName`, `lastName`, `email`, `phone`, `company`
- `customerType`, `referralSource`, `message`, `consent`
- Form-specific: `product`, `issueType`, `priority`, `role`, `annualVolume`, `interest`, `location`, `preferredContact`, `productToInstall`, `demoType`, `preferredDate`, `preferredTime`, `city`, `state`, `zip`, `productsOfInterest`, `numberOfAttendees`, `portfolioSize`, `demoFocus`

Make sure your Pipedrive custom field names match these exactly!

