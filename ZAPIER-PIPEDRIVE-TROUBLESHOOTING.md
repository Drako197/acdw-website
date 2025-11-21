# Zapier → Pipedrive Troubleshooting Guide

## Problem: Dropdown fields show up but values aren't selected

This happens when the values Zapier sends don't match exactly what's in your Pipedrive dropdown options.

---

## **Step 1: Check What Zapier is Actually Sending**

### **In Zapier:**

1. Go to your Zap → **Task History**
2. Click on the most recent task run
3. Look at the **Trigger** step (Netlify Form Submission)
4. Expand the data to see what values were captured
5. **Write down the exact values** for each dropdown field

**Example:**
- `customerType`: `hvac-contractor` (note the lowercase and hyphen)
- `role`: `purchasing-manager` (note the hyphen)
- `annualVolume`: `1-50` (note the hyphen)

---

## **Step 2: Verify Pipedrive Dropdown Options Match**

### **In Pipedrive:**

1. Go to **Settings** → **Data fields** → **Person**
2. Click **Edit** on your dropdown field (e.g., `customerType`)
3. **Check each option** - they must match EXACTLY:
   - Same case (lowercase/uppercase)
   - Same hyphens
   - Same spacing
   - No extra characters

**Common Issues:**
- ❌ Pipedrive has: `HVAC Contractor` (with space and capitals)
- ✅ Form sends: `hvac-contractor` (with hyphen and lowercase)
- **Result:** No match, value not selected

---

## **Step 3: Fix the Mismatch**

### **Option A: Update Pipedrive Dropdown Values (Recommended)**

1. Edit the dropdown field in Pipedrive
2. **Delete all existing options**
3. **Add the exact values** that Zapier is sending (from Step 1)
4. Save

**Example for `customerType`:**
- Delete: `Homeowner`, `HVAC Contractor`, etc.
- Add: `homeowner`, `hvac-contractor`, `property-manager`, `city-official`, `other`

### **Option B: Use Zapier Formatter to Transform Values**

If you want to keep user-friendly labels in Pipedrive:

1. In Zapier, add a **Formatter** step between Trigger and Action
2. Use **Text** → **Replace** to transform values
3. Example: Replace `hvac-contractor` with `HVAC Contractor`

**This is more complex but gives you control over the display.**

---

## **Step 4: Test the Mapping**

### **In Zapier:**

1. Go to your Zap → **Action** step (Pipedrive → Create Person)
2. Click **Set up action** or **Edit**
3. For each dropdown field, verify:
   - The field name matches (e.g., `customerType`)
   - The value is being pulled from the correct Netlify field
   - Click the dropdown to see what value will be sent

**Example:**
- Field: `customerType` (Pipedrive)
- Value: Should show `hvac-contractor` (from Netlify data)
- If it shows something else, the mapping is wrong

---

## **Step 5: Common Value Mismatches**

### **customerType:**
- ❌ Wrong: `Homeowner`, `HVAC Contractor`, `Property Manager`
- ✅ Correct: `homeowner`, `hvac-contractor`, `property-manager`

### **role:**
- ❌ Wrong: `Purchasing Manager`, `HVAC Contractor`
- ✅ Correct: `purchasing-manager`, `hvac-contractor`

### **annualVolume:**
- ❌ Wrong: `1 to 50`, `1-50 units`, `1 - 50`
- ✅ Correct: `1-50`, `51-200`, `201-500`, `500+`

### **interest:**
- ❌ Wrong: `Bulk Pricing`, `Partner Program`
- ✅ Correct: `bulk-pricing`, `partner-program`

---

## **Step 6: Debugging Checklist**

- [ ] Checked Zapier Task History for actual values sent
- [ ] Verified Pipedrive dropdown values match exactly
- [ ] Updated Pipedrive dropdown values to match form values
- [ ] Tested Zap with a new form submission
- [ ] Verified person created in Pipedrive with dropdowns populated

---

## **Quick Fix: Test with One Field**

To isolate the issue:

1. **Pick one dropdown field** (e.g., `customerType`)
2. **Submit a test form** with a known value (e.g., select "HVAC Contractor")
3. **Check Zapier Task History** - what value was captured?
4. **Check Pipedrive** - does that exact value exist in the dropdown?
5. **If not, add it** to Pipedrive dropdown
6. **Test again**

Once one field works, apply the same fix to all others.

---

## **Alternative: Use Text Fields**

If exact matching is too difficult:

1. Change dropdown fields to **Text** fields in Pipedrive
2. Values will always transfer (no matching needed)
3. Trade-off: No dropdown selection in Pipedrive UI, but data always works

---

## **Still Not Working?**

If values still don't populate after matching:

1. **Check Zapier field mapping** - make sure you're mapping to the right Pipedrive field
2. **Check field type** - dropdown fields must be "Dropdown" type, not "Text"
3. **Wait a few minutes** - Pipedrive sometimes needs time to sync
4. **Re-test the Zap** - Zapier caches field definitions

