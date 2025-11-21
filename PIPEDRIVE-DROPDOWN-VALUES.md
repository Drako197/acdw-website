# Pipedrive Dropdown Values - Exact Match Required

**IMPORTANT:** The dropdown values in Pipedrive must match EXACTLY what the forms send (case-sensitive, including hyphens).

---

## **customerType** (Dropdown)

**Exact values to add in Pipedrive:**
- `homeowner`
- `hvac-contractor`
- `property-manager`
- `city-official`
- `other`

**Note:** These are lowercase with hyphens. Do NOT use spaces or capital letters.

---

## **referralSource** (Dropdown)

**Exact values to add in Pipedrive:**
- `search-engine`
- `social-media`
- `hvac-contractor`
- `friend-family`
- `trade-show`
- `online-ad`
- `article-blog`
- `other`

---

## **product** (Dropdown) - Support Form Only

**Exact values to add in Pipedrive:**
- `mini`
- `sensor`
- `mini-sensor`
- `core-1.0`
- `other`

---

## **issueType** (Dropdown) - Support Form Only

**Exact values to add in Pipedrive:**
- `installation`
- `technical`
- `warranty`
- `parts`
- `other`

---

## **priority** (Dropdown) - Support Form Only

**Exact values to add in Pipedrive:**
- `low`
- `medium`
- `high`

**Note:** No "urgent" - only these three values.

---

## **role** (Dropdown) - Sales Form Only

**Exact values to add in Pipedrive:**
- `hvac-contractor`
- `property-manager`
- `retailer`
- `purchasing-manager`
- `other`

---

## **annualVolume** (Dropdown) - Sales Form Only

**Exact values to add in Pipedrive:**
- `1-50`
- `51-200`
- `201-500`
- `500+`

**Note:** Include the hyphens and plus sign exactly as shown.

---

## **interest** (Dropdown) - Sales Form Only

**Exact values to add in Pipedrive:**
- `bulk-pricing`
- `partner-program`
- `portfolio-installation`
- `custom-solution`
- `other`

---

## **preferredContact** (Dropdown) - Installer Form Only

**Exact values to add in Pipedrive:**
- `email`
- `phone`
- `either`

---

## **productToInstall** (Dropdown) - Installer Form Only

**Exact values to add in Pipedrive:**
- `mini`
- `sensor`
- `mini-sensor`

**Note:** Different from support form - no "core-1.0" or "other" here.

---

## **demoType** (Dropdown) - Demo Form Only

**Exact values to add in Pipedrive:**
- `in-person`
- `virtual`
- `product-showcase`
- `compliance-review`

---

## **preferredTime** (Dropdown) - Demo Form Only

**Exact values to add in Pipedrive:**
- `morning`
- `afternoon`
- `flexible`

**Note:** No "evening" option - only these three.

---

## **How to Fix Your Pipedrive Fields:**

### **Step 1: Edit Existing Dropdown Fields**

1. Go to **Pipedrive** → **Settings** → **Data fields** → **Person**
2. Find your custom dropdown field (e.g., `customerType`)
3. Click **Edit** (pencil icon)
4. **Delete all existing options**
5. **Add the exact values** from the list above (one at a time)
6. **Save**

### **Step 2: Verify Values Match**

After updating, double-check:
- Values are **exactly** as listed (case-sensitive)
- No extra spaces
- Hyphens are included where shown
- No capital letters unless specified

### **Step 3: Test Your Zap**

1. Submit a test form on your website
2. Check Zapier task history - should show success
3. Check Pipedrive contact - dropdown fields should now be populated

---

## **Alternative Solution: Use Text Fields Instead**

If you want more flexibility, you can change dropdown fields to **Text** fields in Pipedrive:

1. Edit the field in Pipedrive
2. Change field type from "Dropdown" to "Text"
3. This will accept any value from the form
4. You lose the dropdown selection in Pipedrive, but data will always transfer

**Trade-off:** 
- ✅ Text fields: Always work, accept any value
- ❌ Text fields: No dropdown selection in Pipedrive UI
- ✅ Dropdown fields: Better UX in Pipedrive, but must match exactly

---

## **Quick Fix for Sales Inquiry Form:**

For your current Sales Inquiry Zap, update these fields in Pipedrive:

1. **customerType**: `homeowner`, `hvac-contractor`, `property-manager`, `city-official`, `other`
2. **referralSource**: `search-engine`, `social-media`, `hvac-contractor`, `friend-family`, `trade-show`, `online-ad`, `article-blog`, `other`
3. **role**: `hvac-contractor`, `property-manager`, `retailer`, `purchasing-manager`, `other`
4. **annualVolume**: `1-50`, `51-200`, `201-500`, `500+`
5. **interest**: `bulk-pricing`, `partner-program`, `portfolio-installation`, `custom-solution`, `other`

After updating, test your Zap again!

