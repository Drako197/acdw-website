# Step-by-Step: Finding Uploaded Photos in Netlify

This guide will walk you through exactly how to find and download photos from the Core 1.0 Upgrade form submissions in Netlify.

---

## **Step 1: Log into Netlify**

1. Go to **https://app.netlify.com**
2. Log in with your Netlify account credentials

---

## **Step 2: Select Your Site**

1. Once logged in, you'll see a list of your sites
2. Click on your **ACDW Website** site (or whatever you named it)
3. This takes you to the site's dashboard

---

## **Step 3: Navigate to Forms**

1. In the left sidebar, look for **"Forms"** (it has an icon that looks like a document/form)
2. Click on **"Forms"**
3. You'll see a list of all your forms

---

## **Step 4: Find the Core 1.0 Upgrade Form**

1. Look for the form named **`core-upgrade`**
2. You should see:
   - Form name: `core-upgrade`
   - Number of submissions (e.g., "5 submissions")
3. Click on **`core-upgrade`** to open it

---

## **Step 5: View Submissions**

1. You'll now see a list of all form submissions
2. Each submission shows:
   - **Date/Time** of submission
   - **Email** address
   - **Name** (if visible in the list)
3. Submissions are listed from newest to oldest (most recent at top)

---

## **Step 6: Open a Submission**

1. Click on any submission row to open it
2. This opens a detailed view showing:
   - All form fields (firstName, lastName, email, phone, etc.)
   - **File uploads** section (this is where the photo is!)

---

## **Step 7: Find and Download the Photo**

1. Scroll down in the submission details
2. Look for a section labeled **"File uploads"** or **"Attachments"**
3. You should see the photo file listed (e.g., `photo.jpg`, `photo.png`, etc.)
4. **To view/download:**
   - **Click the file name** → Downloads to your computer
   - **Right-click → "Open in new tab"** → Opens in browser to view
   - **Right-click → "Save link as..."** → Save to specific location

---

## **Visual Guide:**

```
Netlify Dashboard
├── Sites (list)
│   └── ACDW Website ← Click here
│       ├── Overview
│       ├── Deploys
│       ├── Forms ← Click here
│       │   └── core-upgrade ← Click here
│       │       └── Submission #1 ← Click here
│       │           ├── Form Data
│       │           │   ├── firstName: John
│       │           │   ├── lastName: Doe
│       │           │   ├── email: john@example.com
│       │           │   └── ...
│       │           └── File uploads ← Photo is here!
│       │               └── photo.jpg ← Click to download
│       └── Submission #2
│           └── ...
```

---

## **Alternative: Quick Access URL**

If you know your Netlify site name, you can go directly to:

```
https://app.netlify.com/sites/[YOUR-SITE-NAME]/forms/core-upgrade
```

Replace `[YOUR-SITE-NAME]` with your actual site name.

**To find your site name:**
1. In Netlify dashboard, click on your site
2. Look at the URL in your browser: `https://app.netlify.com/sites/[SITE-NAME]/...`
3. Or go to **Site settings → General → Site details** → Site name

---

## **Tips:**

### **Finding a Specific Submission:**

If you have many submissions and need to find a specific one:

1. **By Email:**
   - Look through the list for the email address
   - Or use browser search (Ctrl+F / Cmd+F) to search for the email

2. **By Date:**
   - Submissions are sorted by date (newest first)
   - Scroll to find submissions from a specific date

3. **By Name:**
   - Some Netlify views show the name in the list
   - Use browser search to find by name

### **Bulk Download:**

If you need to download multiple photos:

1. Unfortunately, Netlify doesn't have a bulk download feature
2. You'll need to:
   - Open each submission individually
   - Download each photo one by one
   - Or use the Netlify API (advanced)

### **Exporting Submission Data:**

1. In the Forms section, you can export submission data as CSV
2. However, **photos are NOT included in CSV exports**
3. Photos must be downloaded individually from each submission

---

## **Troubleshooting:**

### **Issue: Can't find the Forms section**
- **Solution:** Make sure you're logged into the correct Netlify account
- Check that you have access to the site
- Forms only appear if your site has Netlify Forms enabled (which it does)

### **Issue: No photos showing in submission**
- **Solution:** 
  - Check that the form submission was successful
  - Verify the file was actually uploaded (check file size limits)
  - Make sure you're looking in the "File uploads" section, not just form fields

### **Issue: Photo won't download**
- **Solution:**
  - Try right-clicking and "Save link as..."
  - Check your browser's download settings
  - Try a different browser

### **Issue: Can't see all submissions**
- **Solution:**
  - Netlify may paginate results if you have many submissions
  - Use the pagination controls at the bottom
  - Or use the search/filter if available

---

## **Quick Reference:**

**Direct Path:**
```
Netlify Dashboard → Your Site → Forms → core-upgrade → [Submission] → File uploads → [Photo]
```

**URL Format:**
```
https://app.netlify.com/sites/[SITE-NAME]/forms/core-upgrade
```

---

## **Need More Help?**

If you're still having trouble finding the photos:

1. **Check your email** - Photos are also attached to Netlify email notifications
2. **Verify form name** - Make sure you're looking at `core-upgrade` form
3. **Check submission date** - Make sure the submission actually went through
4. **Contact Netlify support** - If photos are missing, there may be a technical issue

---

**That's it! You should now be able to find and download all uploaded photos from the Core 1.0 Upgrade form.** 📸

