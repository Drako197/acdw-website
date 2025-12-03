# reCAPTCHA Keys Setup - Step-by-Step Walkthrough

## Step 1: Get Keys from Google

### 1.1: Go to reCAPTCHA Admin Console
1. Open your browser
2. Go to: **https://www.google.com/recaptcha/admin**
3. Sign in with your Google account (if not already signed in)

**Are you on the reCAPTCHA Admin page?** (You should see a list of sites or a "+" button)

---

### 1.2: Create New Site
1. Click the **"+"** button (top right) or **"Create"** button
2. You'll see a form to create a new reCAPTCHA site

**What do you see?** (Form with fields for Label, Type, Domains, etc.)

---

### 1.3: Fill in the Form
Fill in these fields:

**Label:**
- Enter: `AC Drain Wiz Unsubscribe`

**reCAPTCHA type:**
- **IMPORTANT:** Select **"reCAPTCHA v3"** (NOT v2)
- v3 is invisible, v2 shows a checkbox challenge

**Domains:**
- Click in the "Domains" field
- Add each domain on a new line:
  ```
  acdrainwiz.com
  www.acdrainwiz.com
  localhost
  ```
- (localhost is for testing locally)

**Owners:**
- Your email should be pre-filled
- You can add more if needed

**Accept Terms:**
- Check the box to accept reCAPTCHA Terms of Service

**Click "Submit"**

---

### 1.4: Copy Your Keys
After clicking Submit, you'll see a page with:

**Site Key:**
- A long string starting with something like `6Lc...` or `6Le...`
- **Copy this entire key** (it's public, safe to share)

**Secret Key:**
- Another long string
- **Copy this entire key** (keep this private!)

**⚠️ Important:** Copy both keys now - you won't be able to see the Secret Key again easily!

---

## Step 2: Add Keys to Netlify

### 2.1: Go to Netlify Dashboard
1. Go to: **https://app.netlify.com**
2. Sign in
3. Select your site: **ACDW Website** (or your site name)

---

### 2.2: Navigate to Environment Variables
1. Click **"Site settings"** (in the top navigation)
2. In the left sidebar, click **"Environment variables"**
3. You'll see a list of existing environment variables

---

### 2.3: Add Site Key (Public)
1. Click **"Add a variable"** button
2. Fill in:
   - **Key:** `VITE_RECAPTCHA_SITE_KEY`
   - **Value:** Paste your **Site Key** from Step 1.4
   - **Scopes:** Check all boxes:
     - ✅ Production
     - ✅ Deploy previews  
     - ✅ Branch deploys
3. Click **"Create variable"**

---

### 2.4: Add Secret Key (Private)
1. Click **"Add a variable"** again
2. Fill in:
   - **Key:** `RECAPTCHA_SECRET_KEY`
   - **Value:** Paste your **Secret Key** from Step 1.4
   - **Scopes:** Check all boxes:
     - ✅ Production
     - ✅ Deploy previews
     - ✅ Branch deploys
3. Click **"Create variable"**

---

### 2.5: Optional - Set Score Threshold
1. Click **"Add a variable"** again
2. Fill in:
   - **Key:** `RECAPTCHA_SCORE_THRESHOLD`
   - **Value:** `0.5`
   - **Scopes:** Check all boxes
3. Click **"Create variable"**

**Note:** 0.5 is the default. You can adjust later if needed (0.0 to 1.0).

---

## Step 3: Verify Variables Added

You should now see these 3 variables in your list:
- ✅ `VITE_RECAPTCHA_SITE_KEY`
- ✅ `RECAPTCHA_SECRET_KEY`
- ✅ `RECAPTCHA_SCORE_THRESHOLD` (optional)

---

## Step 4: Redeploy Site

1. Go to **Netlify Dashboard → Deploys**
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete (~2-3 minutes)

**Why redeploy?** Environment variables are only available to functions after a new deploy.

---

## Step 5: Test

1. Visit: `https://acdrainwiz.com/unsubscribe`
2. Open browser console (F12)
3. Submit the form with a valid email
4. Check Netlify Function logs:
   - Go to **Functions → validate-unsubscribe**
   - Look for: `✅ reCAPTCHA verified` with a score

---

## Troubleshooting

### "reCAPTCHA not loaded" in console
- Check `VITE_RECAPTCHA_SITE_KEY` is set correctly
- Verify domain is added in reCAPTCHA settings
- Check browser console for errors

### "reCAPTCHA verification failed"
- Check `RECAPTCHA_SECRET_KEY` is set correctly
- Verify secret key matches site key
- Check Netlify function logs for error codes

### Still getting bot submissions
- Check reCAPTCHA scores in logs
- Lower threshold if too many false positives
- Review Google reCAPTCHA dashboard for insights

---

**Ready to start?** Let me know when you're on the reCAPTCHA Admin page and I'll guide you through each step!

