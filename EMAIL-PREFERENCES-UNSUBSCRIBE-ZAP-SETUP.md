# Email Preferences & Unsubscribe Zap Setup Guide

These two forms are critical for compliance and customer experience. They need to **update existing contacts** in Pipedrive rather than create new ones.

---

## **Why These Forms Are Different:**

Unlike other forms that **create new contacts**, these forms need to:
1. **Find** the existing person in Pipedrive (by email)
2. **Update** their email preferences or unsubscribe status
3. Handle cases where the person doesn't exist yet

---

## **Pipedrive Capabilities:**

✅ **Pipedrive has built-in support for this:**
- **"Find Person"** action (search by email)
- **"Update Person"** action (update custom fields)
- Custom fields for email preferences
- Yes/No fields for unsubscribe status

---

## **Step 1: Create Custom Fields in Pipedrive**

Go to **Settings → Data fields → Person** and create these fields:

### **For Email Preferences:**

| Field Name | Field Type | Options/Notes |
|------------|-----------|---------------|
| `emailProductUpdates` | Yes/No | Track product updates preference |
| `emailPromotions` | Yes/No | Track promotions preference |
| `emailNewsletter` | Yes/No | Track newsletter preference |
| `emailOrderUpdates` | Yes/No | Track order updates (usually always yes) |
| `emailSupportEmails` | Yes/No | Track support emails (usually always yes) |

### **For Unsubscribe:**

| Field Name | Field Type | Options/Notes |
|------------|-----------|---------------|
| `emailUnsubscribed` | Yes/No | Main unsubscribe flag |
| `emailUnsubscribeReason` | Dropdown | Why they unsubscribed |
| `emailUnsubscribeDate` | Date | When they unsubscribed |
| `emailUnsubscribeFeedback` | Textarea | Optional feedback |

### **Unsubscribe Reason Dropdown Options:**

- `too-many-emails`
- `not-relevant`
- `never-signed-up`
- `spam`
- `privacy-concerns`
- `other`

---

## **Step 2: Zap 8 - Email Preferences Update**

### **Zap Structure:**

**Trigger:** Netlify → New Form Submission
- **Form Name:** `email-preferences`

**Action 1:** Pipedrive → Find Person
- **Search by:** Email
- **Email:** `{{email}}` (from Netlify)

**Action 2:** Pipedrive → Update Person
- **Person:** `{{Person ID}}` (from Action 1)
- **Custom Fields:**
  - `emailProductUpdates` → `{{productUpdates}}` (convert "yes"/"no" to Yes/No)
  - `emailPromotions` → `{{promotions}}`
  - `emailNewsletter` → `{{newsletter}}`
  - `emailOrderUpdates` → `{{orderUpdates}}`
  - `emailSupportEmails` → `{{supportEmails}}`

**Optional Action 3:** Add Note
- **Person:** `{{Person ID}}`
- **Note:** "Email preferences updated on {{submission_date}}"

### **Handling Person Not Found:**

If the person doesn't exist in Pipedrive, you have two options:

**Option A: Create Person (Recommended)**
- Add a conditional path: "If Person ID is empty"
- Create Person with email and preferences
- Then update preferences

**Option B: Log Only**
- If person not found, just log to a spreadsheet or send notification
- Don't create new person (they may not be a customer yet)

---

## **Step 3: Zap 9 - Unsubscribe**

### **Zap Structure:**

**Trigger:** Netlify → New Form Submission
- **Form Name:** `unsubscribe`

**Action 1:** Pipedrive → Find Person
- **Search by:** Email
- **Email:** `{{email}}` (from Netlify)

**Action 2:** Pipedrive → Update Person
- **Person:** `{{Person ID}}` (from Action 1)
- **Custom Fields:**
  - `emailUnsubscribed` → `Yes`
  - `emailUnsubscribeReason` → `{{reason}}`
  - `emailUnsubscribeDate` → `{{submission_date}}`
  - `emailUnsubscribeFeedback` → `{{feedback}}`
  
**Also Update Email Preferences:**
- `emailProductUpdates` → `No`
- `emailPromotions` → `No`
- `emailNewsletter` → `No`
- Keep `emailOrderUpdates` → `Yes` (required)
- Keep `emailSupportEmails` → `Yes` (required)

**Optional Action 3:** Add Note
- **Person:** `{{Person ID}}`
- **Note:** "Unsubscribed from marketing emails on {{submission_date}}. Reason: {{reason}}"

### **Handling Person Not Found:**

**Option A: Create Person (Recommended)**
- Create person with email
- Set all unsubscribe fields
- This ensures we don't email them in the future

**Option B: Log Only**
- Log unsubscribe request
- May want to maintain a separate "do not email" list

---

## **Step 4: Setting Up the Zaps**

### **Zap 8: Email Preferences - Detailed Steps**

1. **Create New Zap**
   - Name: "Email Preferences Update"

2. **Trigger: Netlify → New Form Submission**
   - Connect Netlify account
   - Select form: `email-preferences`
   - Test trigger

3. **Action 1: Pipedrive → Find Person**
   - Connect Pipedrive account
   - **Search Field:** Email
   - **Email:** `{{email}}` (from Netlify trigger)
   - Test step

4. **Action 2: Pipedrive → Update Person**
   - **Person:** `{{Person ID}}` (from Find Person step)
   - **Custom Fields:**
     - Map each preference field
     - Use "Text Formatter" if needed to convert "yes"/"no" to Yes/No
   - Test step

5. **Optional: Conditional Logic**
   - **If Person ID is empty:**
     - Create Person with email
     - Then update preferences

6. **Turn on Zap**

### **Zap 9: Unsubscribe - Detailed Steps**

1. **Create New Zap**
   - Name: "Unsubscribe from Marketing"

2. **Trigger: Netlify → New Form Submission**
   - Connect Netlify account
   - Select form: `unsubscribe`
   - Test trigger

3. **Action 1: Pipedrive → Find Person**
   - Connect Pipedrive account
   - **Search Field:** Email
   - **Email:** `{{email}}` (from Netlify trigger)
   - Test step

4. **Action 2: Pipedrive → Update Person**
   - **Person:** `{{Person ID}}` (from Find Person step)
   - **Custom Fields:**
     - `emailUnsubscribed` → `Yes`
     - `emailUnsubscribeReason` → `{{reason}}`
     - `emailUnsubscribeDate` → Use "Formatter" to convert date
     - `emailUnsubscribeFeedback` → `{{feedback}}`
   - **Also update preferences:**
     - Set marketing preferences to `No`
     - Keep required preferences as `Yes`
   - Test step

5. **Optional: Conditional Logic**
   - **If Person ID is empty:**
     - Create Person with email
     - Set unsubscribe status

6. **Turn on Zap**

---

## **Step 5: Data Formatting**

### **Converting "yes"/"no" to Yes/No:**

Netlify sends "yes"/"no" as strings, but Pipedrive Yes/No fields need proper format.

**Use Zapier "Formatter" step:**
- **Transform:** Text → Uppercase first letter
- Input: `{{productUpdates}}`
- Output: `Yes` or `No`

**Or use conditional logic:**
- If `{{productUpdates}}` equals "yes" → `Yes`
- Else → `No`

### **Date Formatting:**

For `emailUnsubscribeDate`:
- Use "Formatter" → Date/Time
- Input: `{{submission_date}}` or current date
- Format: YYYY-MM-DD or your preferred format

---

## **Step 6: Testing**

### **Test Email Preferences:**

1. Submit email preferences form
2. Check Pipedrive:
   - Find person by email
   - Verify all preference fields are updated
   - Check note was added (if configured)

### **Test Unsubscribe:**

1. Submit unsubscribe form
2. Check Pipedrive:
   - Find person by email
   - Verify `emailUnsubscribed` = `Yes`
   - Verify reason and date are set
   - Verify marketing preferences are `No`
   - Verify required preferences are still `Yes`

### **Test Edge Cases:**

1. **Person doesn't exist:**
   - Submit with email not in Pipedrive
   - Verify person is created (if configured)
   - Or verify request is logged

2. **Multiple submissions:**
   - Submit preferences multiple times
   - Verify latest preferences are saved

---

## **Step 7: Using This Data**

### **In Pipedrive:**

**Filter/Search:**
- Find all unsubscribed: `emailUnsubscribed = Yes`
- Find people who want promotions: `emailPromotions = Yes`
- Find people who don't want newsletter: `emailNewsletter = No`

**Segmentation:**
- Create lists/segments based on preferences
- Use for targeted email campaigns
- Respect unsubscribe status

**Reporting:**
- Track unsubscribe rates
- Analyze unsubscribe reasons
- Monitor preference changes

### **In Email Marketing:**

**Before sending emails:**
- Check `emailUnsubscribed` field
- Check relevant preference field
- Don't send if unsubscribed or preference is `No`

**Segmentation:**
- Product updates → `emailProductUpdates = Yes`
- Promotions → `emailPromotions = Yes`
- Newsletter → `emailNewsletter = Yes`

---

## **Best Practices:**

### **Compliance:**

✅ **Always respect unsubscribe:**
- Never email if `emailUnsubscribed = Yes`
- Even if they update preferences later, check unsubscribe first

✅ **Respect preferences:**
- Only send emails matching their preferences
- Required emails (order updates, support) can always be sent

✅ **Audit trail:**
- Track when preferences change
- Track unsubscribe date and reason
- Keep feedback for improvement

### **Data Quality:**

✅ **Handle missing persons:**
- Decide: Create person or log only?
- Consider: Are they a customer or just a lead?

✅ **Prevent duplicates:**
- Always find by email first
- Update existing, don't create duplicate

✅ **Data validation:**
- Verify email format
- Handle empty/optional fields gracefully

---

## **Troubleshooting:**

### **Issue: Person not found**

**Solution:**
- Check email format matches exactly
- Verify person exists in Pipedrive
- Consider creating person if they don't exist

### **Issue: Fields not updating**

**Solution:**
- Verify custom field names match exactly
- Check field types (Yes/No vs Text)
- Test Zap step by step

### **Issue: Yes/No not working**

**Solution:**
- Use Formatter to convert "yes"/"no" to "Yes"/"No"
- Or use conditional logic
- Verify Pipedrive field type is Yes/No

### **Issue: Date not formatting**

**Solution:**
- Use Date/Time formatter
- Check date format matches Pipedrive expectations
- Use current date if submission date not available

---

## **Quick Reference:**

### **Email Preferences Form Fields:**
- `email` (required)
- `productUpdates` ("yes"/"no")
- `promotions` ("yes"/"no")
- `newsletter` ("yes"/"no")
- `orderUpdates` ("yes"/"no")
- `supportEmails` ("yes"/"no")

### **Unsubscribe Form Fields:**
- `email` (required)
- `reason` (dropdown)
- `feedback` (optional text)

### **Pipedrive Custom Fields:**
- `emailProductUpdates` (Yes/No)
- `emailPromotions` (Yes/No)
- `emailNewsletter` (Yes/No)
- `emailOrderUpdates` (Yes/No)
- `emailSupportEmails` (Yes/No)
- `emailUnsubscribed` (Yes/No)
- `emailUnsubscribeReason` (Dropdown)
- `emailUnsubscribeDate` (Date)
- `emailUnsubscribeFeedback` (Textarea)

---

## **Summary:**

✅ **Email Preferences Zap:**
- Finds person by email
- Updates preference custom fields
- Creates person if doesn't exist (optional)

✅ **Unsubscribe Zap:**
- Finds person by email
- Sets unsubscribe flag and reason
- Updates all marketing preferences to `No`
- Keeps required preferences as `Yes`
- Creates person if doesn't exist (optional)

✅ **Compliance:**
- Respect unsubscribe status
- Track preferences accurately
- Maintain audit trail

**These Zaps are essential for GDPR/CCPA compliance and customer experience!** 📧✅

