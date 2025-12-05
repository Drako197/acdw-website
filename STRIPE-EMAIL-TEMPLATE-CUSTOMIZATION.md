# Stripe Email Template Customization Guide

**Current Location:** Settings > Business > Customer emails  
**Next Step:** Navigate to Email Templates

---

## Where to Customize Receipt Email Templates

### Option 1: Email Templates (Recommended)

1. **From your current page:**
   - Look at the left sidebar navigation
   - Find **"Settings"** (gear icon)
   - Click on **"Settings"** in the sidebar

2. **Navigate to Email Templates:**
   - In the Settings sidebar, look for **"Emails"** or **"Email templates"**
   - Click on **"Emails"** or **"Receipt emails"**

3. **Alternative path:**
   - Go to: **Settings** → **Branding** (for logo/colors)
   - Then: **Settings** → **Emails** → **Receipt emails** (for template)

### Option 2: Direct URL

If you're logged into Stripe Dashboard, try this direct link:
- **Test Mode:** https://dashboard.stripe.com/test/settings/emails
- **Live Mode:** https://dashboard.stripe.com/settings/emails

---

## What You Can Customize

### 1. Branding (Settings → Branding)

**Location:** Settings → Branding

**What to customize:**
- **Logo:** Upload your AC Drain Wiz logo
- **Icon:** Upload a favicon/icon
- **Primary color:** Set to your brand orange (#f97316)
- **Background color:** White or light gray
- **Link color:** Match your brand

**How it affects emails:**
- Logo appears at the top of receipt emails
- Colors are used throughout the email template

### 2. Receipt Email Template (Settings → Emails → Receipt emails)

**Location:** Settings → Emails → Receipt emails

**What to customize:**
- **Email header:** Logo and company name
- **Email footer:** 
  - Company name: AC Drain Wiz
  - Contact phone: (561) 654-5237
  - Contact email: support@acdrainwiz.com or ariddle@acdrainwiz.com
  - Website: www.acdrainwiz.com
- **Email content:** Order details, payment info, shipping info
- **Colors:** Match your brand (orange #f97316)

**Template sections:**
- Header (logo, company name)
- Order summary (items, quantities, prices)
- Payment details (amount, method, date)
- Shipping information (if applicable)
- Footer (contact info, support links)

---

## Step-by-Step Customization

### Step 1: Set Up Branding

1. Go to **Settings** → **Branding**
2. **Upload Logo:**
   - Click "Upload logo"
   - Use your AC Drain Wiz logo (PNG or SVG, transparent background recommended)
   - Recommended size: 200x50px or similar

3. **Set Colors:**
   - **Primary color:** `#f97316` (your brand orange)
   - **Background:** `#ffffff` (white)
   - **Link color:** `#f97316` (orange) or `#2563eb` (blue)

4. **Save changes**

### Step 2: Customize Receipt Email Template

1. Go to **Settings** → **Emails** → **Receipt emails**
   - Or use direct link: https://dashboard.stripe.com/test/settings/emails

2. **Click "Customize" or "Edit template"**

3. **Customize Footer:**
   - Add company name: **AC Drain Wiz**
   - Add contact phone: **(561) 654-5237**
   - Add contact email: **support@acdrainwiz.com** or **ariddle@acdrainwiz.com**
   - Add website: **www.acdrainwiz.com**

4. **Preview the template:**
   - Use the preview feature to see how it looks
   - Test with sample order data

5. **Save changes**

### Step 3: Set Support Email (Current Page)

On the page you're currently viewing:

1. **Find "Support email" section**
   - It should show: "Email replies will go to sandbox@accessible.stripe.com..."
   - Click on **"Public details settings"** link

2. **Set Support Email:**
   - This is where customer email replies will go
   - Set to: **support@acdrainwiz.com** or **ariddle@acdrainwiz.com**

---

## Quick Navigation Guide

**From your current location (Settings > Business > Customer emails):**

1. **Click "Settings" in the left sidebar** (not the "Business" tab)
2. **Look for "Branding"** → Click it
   - Upload logo and set colors here
3. **Go back to Settings** → **Click "Emails"**
   - This should show receipt email templates
   - Click "Customize" or "Edit" on receipt emails

**Alternative:**
- Use the search bar at the top of Stripe Dashboard
- Search for "receipt emails" or "email templates"
- Click the result to go directly there

---

## What the Receipt Email Will Include

Once customized, your receipt emails will show:

✅ **Your logo** (from Branding settings)  
✅ **Order number** (Stripe session ID)  
✅ **Order date**  
✅ **Customer name and email**  
✅ **Product details:**
   - Product name
   - Quantity
   - Unit price
   - Total amount
✅ **Payment information:**
   - Amount paid
   - Payment method (last 4 digits)
   - Payment date
✅ **Shipping address** (if collected)  
✅ **Your custom footer** with contact information

---

## Testing the Email

1. **Create a test checkout:**
   - Use test card: `4242 4242 4242 4242`
   - Complete a test payment

2. **Check your email:**
   - Receipt should arrive within seconds
   - Verify logo appears
   - Check colors match your brand
   - Verify footer information is correct

3. **Check spam folder:**
   - Stripe emails sometimes go to spam initially
   - Add Stripe to contacts/whitelist

---

## Troubleshooting

### Can't Find Email Templates

**Try these:**
1. Use the search bar: Search "receipt emails"
2. Check Settings sidebar: Look for "Emails" section
3. Direct URL: https://dashboard.stripe.com/test/settings/emails
4. Check if you're in Test Mode vs Live Mode (templates are separate)

### Template Not Saving

- Make sure you click "Save" or "Update" button
- Check for error messages
- Try refreshing the page

### Logo Not Showing

- Check logo file format (PNG or SVG recommended)
- Verify logo size (not too large)
- Check if logo uploaded successfully in Branding settings

---

## Next Steps After Customization

1. ✅ **Test the email** with a test payment
2. ✅ **Verify all information** is correct
3. ✅ **Check on mobile** - emails should be responsive
4. ✅ **Save the settings** - they apply to all future receipts

---

**Current Status:**
- ✅ Successful payments emails: **ENABLED**
- ✅ Refunds emails: **ENABLED**
- ⚠️ **Next:** Customize email template and branding

**Estimated Time:** 15-20 minutes for full customization

---

**Last Updated:** December 2025

