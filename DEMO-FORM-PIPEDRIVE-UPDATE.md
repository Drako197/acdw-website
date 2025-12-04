# Demo Form - Pipedrive & Zapier Update Guide

This guide will help you add the new Priority 1 and Priority 2 fields to your Pipedrive custom fields and update your Demo Request Zap.

---

## **Step 1: Create New Custom Fields in Pipedrive**

### **How to Create Custom Fields:**

1. **Log into Pipedrive**
2. Go to **Settings** (gear icon in top right)
3. Click **Data fields** in the left sidebar
4. Select **Person** (for contact fields)
5. Click **+ Add field** button
6. Fill in the field details (see below)
7. Click **Save**

---

## **New Custom Fields to Create:**

### **Priority 1 Fields (Required):**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `city` | **Text** | City where demo is requested |
| `state` | **Text** | State (2-letter code: FL, CA, etc.) |
| `zip` | **Text** | ZIP code (5 digits) |
| `productsOfInterest` | **Text** | Multi-select products (sent as comma-separated: "mini, sensor, bundle") |
| `numberOfAttendees` | **Dropdown** | Number of people attending demo |

### **Priority 2 Fields (Optional):**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `portfolioSize` | **Dropdown** | Property/portfolio size |
| `demoFocus` | **Dropdown** | What they want to see in demo |

---

## **Step 2: Set Up Dropdown Options**

### **numberOfAttendees** (Dropdown)

**Exact values to add in Pipedrive:**
- `1-2`
- `3-5`
- `6-10`
- `10+`

**Note:** Include hyphens and plus sign exactly as shown.

---

### **portfolioSize** (Dropdown - Optional)

**Exact values to add in Pipedrive:**
- `1-10`
- `11-50`
- `51-100`
- `101-250`
- `251-500`
- `500+`
- `not-applicable`

**Note:** Include hyphens, plus sign, and hyphen in "not-applicable" exactly as shown.

---

### **demoFocus** (Dropdown - Optional)

**Exact values to add in Pipedrive:**
- `installation`
- `monitoring`
- `compliance`
- `roi`
- `product-features`
- `custom`

**Note:** All lowercase with hyphens where shown.

---

## **Step 3: Update Your Demo Request Zap**

### **Current Demo Request Zap Fields (Already Mapped):**
- ✅ `firstName` → First Name
- ✅ `lastName` → Last Name
- ✅ `email` → Email
- ✅ `phone` → Phone
- ✅ `company` → Organization Name
- ✅ `customerType` → customerType
- ✅ `referralSource` → referralSource
- ✅ `message` → message (or Notes)
- ✅ `consent` → consent
- ✅ `demoType` → demoType
- ✅ `preferredDate` → preferredDate
- ✅ `preferredTime` → preferredTime

### **New Fields to Add to Zap:**

1. **Open your Demo Request Zap in Zapier**
2. **Edit the Action step** (Pipedrive → Create Person or Update Person)
3. **Scroll down** to find your custom fields section
4. **Map the new fields:**

| Zapier Field (from Netlify) | Pipedrive Custom Field | Field Type |
|------------------------------|------------------------|------------|
| `city` | `city` | Text |
| `state` | `state` | Text |
| `zip` | `zip` | Text |
| `productsOfInterest` | `productsOfInterest` | Text |
| `numberOfAttendees` | `numberOfAttendees` | Dropdown |
| `portfolioSize` | `portfolioSize` | Dropdown (optional) |
| `demoFocus` | `demoFocus` | Dropdown (optional) |

---

## **Step 4: Understanding productsOfInterest Field**

The `productsOfInterest` field is a **multi-select checkbox** on the form, but it's sent to Netlify as a **comma-separated string**.

**Examples of what you'll receive:**
- Single selection: `"mini"`
- Multiple selections: `"mini, sensor, bundle"`
- All products: `"mini, sensor, bundle"`

**In Pipedrive:**
- Store this as a **Text field** (not dropdown)
- The full comma-separated list will be saved
- You can see all selected products in one field

**Optional Enhancement:**
If you want to parse this into separate fields or tags in Pipedrive, you could:
1. Use a Zapier **Formatter** step to split the comma-separated string
2. Create separate Pipedrive fields: `interestedInMini`, `interestedInSensor`, `interestedInBundle` (Yes/No fields)
3. Map each parsed value to the corresponding field

**For now, storing as a single Text field is the simplest approach.**

---

## **Step 5: Testing Your Updated Zap**

### **Test Checklist:**

1. ✅ **Create all new custom fields in Pipedrive**
2. ✅ **Set up dropdown options** for `numberOfAttendees`, `portfolioSize`, `demoFocus`
3. ✅ **Update your Zap** to map all new fields
4. ✅ **Test the Zap** with a real form submission:
   - Fill out the Demo Request form on your website
   - Include all Priority 1 fields (required)
   - Optionally include Priority 2 fields
   - Submit the form
5. ✅ **Verify in Pipedrive**:
   - Check that the new Person/Contact was created
   - Verify all new fields are populated correctly
   - Check that `productsOfInterest` shows the comma-separated list
   - Verify dropdown fields match the selected values

---

## **Step 6: Using Location Data for Demo Scheduling**

The new location fields (`city`, `state`, `zip`) will help you:

1. **Identify South Florida customers** (Jupiter to Florida Keys):
   - Filter by `state = "FL"` and `zip` codes in range
   - Offer in-person demos for these customers

2. **Assess travel requirements**:
   - Use `city`, `state` to determine if travel is needed
   - Combine with `portfolioSize` and `numberOfAttendees` to prioritize large opportunities

3. **Create Pipedrive Filters/Views**:
   - Create a view: "South Florida Demo Requests"
   - Create a view: "High-Value Demo Requests" (large portfolio + many attendees)

---

## **Quick Reference: All Demo Form Fields**

### **Standard Fields (Built-in):**
- `firstName`, `lastName`, `email`, `phone`, `company`

### **Common Fields (All Forms):**
- `customerType`, `referralSource`, `message`, `consent`

### **Demo-Specific Fields:**
- `demoType` (existing)
- `preferredDate` (existing)
- `preferredTime` (existing)
- `city` ⭐ **NEW**
- `state` ⭐ **NEW**
- `zip` ⭐ **NEW**
- `productsOfInterest` ⭐ **NEW**
- `numberOfAttendees` ⭐ **NEW**
- `portfolioSize` ⭐ **NEW** (optional)
- `demoFocus` ⭐ **NEW** (optional)

---

## **Troubleshooting**

### **Issue: Field not appearing in Zapier**
- **Solution**: Wait 2-3 minutes after creating the field in Pipedrive, then refresh Zapier
- If still not appearing, check that the field name matches exactly (case-sensitive)

### **Issue: Dropdown value not matching**
- **Solution**: Check `PIPEDRIVE-DROPDOWN-VALUES.md` for exact values
- Values must match exactly (case-sensitive, including hyphens)

### **Issue: productsOfInterest showing as empty**
- **Solution**: Check that the form is sending the field (should be comma-separated string)
- Verify in Netlify form submissions that the field is populated
- Check Zapier task history for the actual data received

---

## **Next Steps After Setup**

1. ✅ Create all custom fields in Pipedrive
2. ✅ Update your Demo Request Zap with new field mappings
3. ✅ Test with a real form submission
4. ✅ Create Pipedrive views/filters for South Florida and high-value demos
5. ✅ Train your team on the new fields and how to use them

---

**Need Help?** Refer to:
- `PIPEDRIVE-CUSTOM-FIELDS-SETUP.md` - General setup guide
- `PIPEDRIVE-DROPDOWN-VALUES.md` - Exact dropdown values
- `ZAPIER-PIPEDRIVE-TROUBLESHOOTING.md` - Common issues and solutions

