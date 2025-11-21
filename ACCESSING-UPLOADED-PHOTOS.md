# How to Access Uploaded Photos from Core 1.0 Upgrade Form

Netlify handles file uploads and stores them separately from form data. Here are the ways to access the uploaded photos:

---

## **Option 1: Netlify Dashboard (Easiest)**

### **Steps:**

1. **Log into Netlify Dashboard**
   - Go to https://app.netlify.com
   - Select your site (ACDW Website)

2. **Navigate to Forms**
   - Click **Forms** in the left sidebar
   - Find **`core-upgrade`** form

3. **View Submissions**
   - Click on the form name
   - You'll see all submissions listed
   - Each submission shows:
     - Submission date/time
     - All form fields (name, email, address, etc.)
     - **File uploads** (photos) - click to download/view

4. **Download Photo**
   - Click on the photo file name
   - It will download to your computer
   - Or right-click → "Open in new tab" to view

**Pros:**
- ✅ All photos in one place
- ✅ Easy to download/view
- ✅ See all submission data together
- ✅ No additional setup needed

**Cons:**
- ⚠️ Requires logging into Netlify dashboard
- ⚠️ Not directly in Pipedrive

---

## **Option 2: Email Notifications (Already Set Up)**

### **How It Works:**

Netlify email notifications (which you've already configured) automatically attach uploaded files to the notification email.

1. **Check Your Email**
   - When a form is submitted, you receive an email
   - The photo is **attached** to the email
   - Download the attachment to view the photo

2. **Email Subject Format:**
   - `🔔 Core 1.0 Upgrade - [Name] ([Email])`

3. **Email Contains:**
   - All form field data
   - **Photo attachment** (downloadable)

**Pros:**
- ✅ Photos come directly to your inbox
- ✅ No need to log into dashboard
- ✅ Already configured
- ✅ Works automatically

**Cons:**
- ⚠️ Photos are in email, not in Pipedrive
- ⚠️ Need to download from email

---

## **Option 3: Add Netlify Submission Link to Pipedrive (Recommended)**

This adds a clickable link in Pipedrive that takes you directly to the Netlify submission (where you can view/download the photo).

### **Setup Steps:**

1. **Add Custom Field in Pipedrive:**
   - Go to **Settings → Data fields → Person**
   - Create new field: `netlifySubmissionUrl` (Text field)
   - Or use the **Notes** field (easier)

2. **Update Your Zap:**

   **In Zapier, add a "Text Formatter" step between Netlify and Pipedrive:**

   - **Step 1:** Netlify → New Form Submission (existing)
   - **Step 2:** **Text Formatter → Create** (NEW)
     - **Transform:** Create URL
     - **Base URL:** `https://app.netlify.com/sites/[YOUR-SITE-ID]/forms/[FORM-ID]/submissions/[SUBMISSION-ID]`
     - **Or simpler:** Use Netlify's submission URL format:
       ```
       https://app.netlify.com/sites/[SITE-NAME]/forms/[FORM-NAME]/submissions/[SUBMISSION-ID]
       ```
   - **Step 3:** Pipedrive → Create Person (existing)
     - Add `netlifySubmissionUrl` → Map from Text Formatter output
     - Or add to **Notes** field: `"View submission: [URL]"`

3. **Alternative: Use Notes Field (Easier)**
   - In Pipedrive action step, add to **Notes** field:
   - Format: `"Core 1.0 Upgrade - View photo: https://app.netlify.com/..."`
   - Use Zapier's "Text Formatter" to build the URL

**Note:** Getting the exact submission URL requires the submission ID from Netlify, which may not be directly available in Zapier. See Option 4 for a better approach.

---

## **Option 4: Add Netlify Dashboard Link (Simpler)**

Instead of linking to a specific submission, add a general link to the form submissions page.

### **Setup:**

1. **Add Custom Field in Pipedrive:**
   - Field name: `netlifyFormLink` (Text)
   - Or use **Notes** field

2. **Update Zap:**
   - In Pipedrive action, add to **Notes** or custom field:
   - Text: `"Core 1.0 Upgrade - View submissions: https://app.netlify.com/sites/[SITE-NAME]/forms/core-upgrade"`
   - Replace `[SITE-NAME]` with your actual Netlify site name

3. **How to Use:**
   - Click the link in Pipedrive
   - Takes you to all `core-upgrade` submissions
   - Find the submission by email/date
   - Click to view/download photo

**Pros:**
- ✅ Easy to set up
- ✅ One-click access to all submissions
- ✅ Works immediately

**Cons:**
- ⚠️ Need to find the right submission manually
- ⚠️ Not a direct link to specific submission

---

## **Option 5: Use Netlify API (Advanced)**

For automatic photo URL extraction and storage in Pipedrive, you'd need to:

1. Use Netlify API to fetch submission details
2. Extract photo URL
3. Store URL in Pipedrive custom field

This requires:
- Netlify API token
- Additional Zap steps (Code by Zapier or webhook)
- More complex setup

**Recommendation:** Only if you need automatic photo URLs in Pipedrive. Otherwise, Options 1-2 are sufficient.

---

## **My Recommendation:**

### **Best Approach: Use Both Options 1 & 2**

1. **For Daily Use:** Check email notifications (photos attached)
2. **For Review/Archive:** Use Netlify dashboard (all submissions in one place)
3. **Optional:** Add Option 4 (dashboard link in Pipedrive Notes) for quick access

### **Quick Setup for Option 4:**

1. In your Zap, edit the Pipedrive "Create Person" action
2. Find the **Notes** field
3. Add this text (replace `[SITE-NAME]` with your Netlify site name):
   ```
   Core 1.0 Upgrade Request
   View submission & photo: https://app.netlify.com/sites/[SITE-NAME]/forms/core-upgrade
   Submitted: {{submission_date}}
   ```
4. This gives you a clickable link in Pipedrive to view all submissions

---

## **Finding Your Netlify Site Name:**

1. Go to Netlify dashboard
2. Click on your site
3. Look at the URL: `https://app.netlify.com/sites/[THIS-IS-YOUR-SITE-NAME]/...`
4. Or check **Site settings → General → Site details**

---

## **Summary:**

- ✅ **Email notifications** = Photos attached automatically (already working)
- ✅ **Netlify dashboard** = All photos in one place (always available)
- ✅ **Pipedrive link** = Quick access from CRM (optional enhancement)

**The easiest way right now:** Check your email - photos are already attached! 📎

