# Core 1.0 Upgrade Zap Setup Guide

This guide will walk you through setting up the final Zap for the Core 1.0 Upgrade form.

---

## **Step 1: Create Custom Fields in Pipedrive**

### **Fields Needed for Core 1.0 Upgrade:**

Go to **Pipedrive → Settings → Data fields → Person** and create these fields:

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `street` | Text | Street address |
| `unit` | Text | Apartment/unit number (optional) |
| `city` | Text | City |
| `state` | Text | State (2-letter code) |
| `zip` | Text | ZIP code (5 digits) |
| `consent` | Yes/No | **Already exists** (reuse from other forms) |

**Note:** The `photo` field is a file upload handled by Netlify. It won't appear in the Zap data, but you can access it via the Netlify dashboard or email notification.

---

## **Step 2: Create the Zap**

### **Zap Configuration:**

1. **Trigger:** Netlify → New Form Submission
   - **Form Name:** `core-upgrade`
   - **Test the trigger** to see sample data

2. **Action:** Pipedrive → Create Person

---

## **Step 3: Map Standard Fields**

These are built-in Pipedrive fields (no custom fields needed):

| Pipedrive Field | Netlify Field | Notes |
|----------------|---------------|-------|
| **First Name** | `firstName` | Direct mapping |
| **Last Name** | `lastName` | Direct mapping |
| **Email** | `email` | Direct mapping |
| **Phone** | `phone` | Direct mapping |

---

## **Step 4: Map Custom Fields**

After creating the custom fields in Pipedrive, map them in Zapier:

| Pipedrive Custom Field | Netlify Field | Field Type |
|----------------------|--------------|------------|
| `street` | `street` | Text |
| `unit` | `unit` | Text (optional - may be empty) |
| `city` | `city` | Text |
| `state` | `state` | Text |
| `zip` | `zip` | Text |
| `consent` | `consent` | Yes/No (expects "yes" or "no") |

---

## **Step 5: Handle Address Fields**

Since Pipedrive has a built-in **Address** field, you have two options:

### **Option A: Use Custom Fields (Recommended)**
- Keep address in separate custom fields (street, city, state, zip)
- More flexible for filtering/searching
- Easier to use in workflows

### **Option B: Combine into Pipedrive Address Field**
- Combine `street`, `city`, `state`, `zip` into one address field
- Use Zapier's "Text Formatter" step to combine: `{street}, {city}, {state} {zip}`
- Less flexible but uses built-in field

**Recommendation:** Use Option A (custom fields) for better data management.

---

## **Step 6: Optional - Create Deal**

You can optionally create a Deal in Pipedrive for each upgrade request:

1. **Add Action Step:** Pipedrive → Create Deal
2. **Deal Title:** `Core 1.0 Upgrade - {city}, {state}`
3. **Person:** Link to the person created in Step 2
4. **Deal Value:** $10.99 (shipping cost)
5. **Deal Stage:** "Upgrade Request" (or create custom stage)

---

## **Step 7: Handle Photo Upload**

**Important:** The `photo` field is a file upload. Netlify stores it, but it won't appear directly in Zapier form data.

### **Options:**

1. **Access via Netlify Dashboard:**
   - Photos are stored in Netlify's form submissions
   - You can download them from the Netlify dashboard

2. **Email Notification:**
   - Set up Netlify email notification (already done)
   - Photos are attached to the email

3. **Add Photo URL to Pipedrive (Advanced):**
   - If you want to store photo URL in Pipedrive, you'd need to:
     - Use Netlify API to get submission details
     - Extract photo URL
     - Add as custom field in Pipedrive
   - This requires additional Zap steps or webhook

**Recommendation:** For now, rely on Netlify email notifications for photo access. You can enhance this later if needed.

---

## **Step 8: Testing**

1. **Test the Zap** with a real form submission
2. **Check Pipedrive** to verify:
   - Person is created with correct name, email, phone
   - All address fields are populated
   - `consent` field shows "Yes" or "No"
3. **Verify address data** is correct
4. **Check Netlify email** for photo attachment

---

## **Step 9: Field Mapping Checklist**

Use this checklist when setting up the Zap:

- [ ] Trigger: Netlify → `core-upgrade` form
- [ ] Standard fields mapped:
  - [ ] First Name → `firstName`
  - [ ] Last Name → `lastName`
  - [ ] Email → `email`
  - [ ] Phone → `phone`
- [ ] Custom fields mapped:
  - [ ] `street` → `street`
  - [ ] `unit` → `unit`
  - [ ] `city` → `city`
  - [ ] `state` → `state`
  - [ ] `zip` → `zip`
  - [ ] `consent` → `consent`
- [ ] Zap tested successfully
- [ ] Person created in Pipedrive with all data
- [ ] Photo accessible via Netlify email/dashboard

---

## **Troubleshooting**

### **Issue: Custom fields not appearing in Zapier**
- **Solution:** Wait 2-3 minutes after creating fields in Pipedrive, then refresh Zapier
- Or click "Refresh Fields" in the Zapier action step

### **Issue: Address fields are empty**
- **Solution:** Check that field names match exactly (case-sensitive)
- Verify the form is sending the data (check Netlify form submission)

### **Issue: Consent field not working**
- **Solution:** Make sure `consent` field type is "Yes/No" in Pipedrive
- Form sends "yes" or "no" strings - Pipedrive should accept these

### **Issue: Photo not accessible**
- **Solution:** Check Netlify email notification settings
- Photos are stored in Netlify, not in Zapier/Pipedrive
- Access via Netlify dashboard or email attachment

---

## **Quick Reference: Form Field Names**

The Core 1.0 Upgrade form sends these fields to Netlify:

- `form-name`: `core-upgrade`
- `firstName`: Text
- `lastName`: Text
- `email`: Email
- `phone`: Phone (formatted)
- `photo`: File upload (handled by Netlify)
- `street`: Text
- `unit`: Text (optional)
- `city`: Text
- `state`: Text (2-letter code)
- `zip`: Text (5 digits)
- `consent`: "yes" or "no"

---

## **Next Steps After Zap is Complete**

Once the Zap is working:

1. ✅ All 7 forms are now connected to Pipedrive
2. ✅ All form submissions create contacts in CRM
3. ✅ All custom fields are mapped and working
4. ✅ Email notifications are set up in Netlify
5. ✅ Data flows automatically from forms → Netlify → Pipedrive

**Congratulations! Your form integration is complete!** 🎉

