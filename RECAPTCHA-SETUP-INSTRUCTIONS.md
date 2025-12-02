# reCAPTCHA v3 Setup Instructions

## Step 1: Get reCAPTCHA Keys from Google

1. **Go to Google reCAPTCHA Admin Console:**
   - Visit: https://www.google.com/recaptcha/admin
   - Sign in with your Google account

2. **Create a new site:**
   - Click the **"+"** button (top right) or **"Create"**
   - Fill in the form:
     - **Label:** `AC Drain Wiz Unsubscribe`
     - **reCAPTCHA type:** Select **"reCAPTCHA v3"** (NOT v2)
     - **Domains:** Add these domains (one per line):
       ```
       acdrainwiz.com
       www.acdrainwiz.com
       localhost
       ```
     - **Owners:** Your email (default)
     - Accept the reCAPTCHA Terms of Service
   - Click **Submit**

3. **Copy your keys:**
   - **Site Key** (public) - Copy this value
   - **Secret Key** (private) - Copy this value
   - ⚠️ **Keep these secure!** Don't share publicly.

---

## Step 2: Add Site Key to Frontend

### Option A: Environment Variable (Recommended)

1. **Add to Netlify Environment Variables:**
   - Go to **Netlify Dashboard → Site Settings → Environment Variables**
   - Click **"Add variable"**
   - **Key:** `VITE_RECAPTCHA_SITE_KEY`
   - **Value:** Your Site Key from Step 1
   - **Scopes:** All scopes
   - Click **Save**

2. **Update `index.html`:**
   - The script tag is already added with placeholder
   - Once you have the site key, we'll update it

### Option B: Direct in HTML (Less Secure)

Update `index.html` line with the script tag:
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY_HERE" async defer></script>
```

**Replace `YOUR_SITE_KEY_HERE` with your actual Site Key.**

---

## Step 3: Add Secret Key to Netlify

1. **Go to Netlify Dashboard → Site Settings → Environment Variables**
2. **Click "Add variable"**
3. **Add:**
   - **Key:** `RECAPTCHA_SECRET_KEY`
   - **Value:** Your Secret Key from Step 1
   - **Scopes:** All scopes (Production, Deploy previews, Branch deploys)
4. **Click Save**

---

## Step 4: Optional - Set Score Threshold

The default threshold is **0.5** (scores below this are rejected).

To change it:
1. **Add environment variable:**
   - **Key:** `RECAPTCHA_SCORE_THRESHOLD`
   - **Value:** `0.5` (or your preferred threshold: 0.0 to 1.0)
   - **Recommended:** 0.5 (blocks most bots, allows legitimate users)

**Score Guidelines:**
- **0.9 - 1.0:** Definitely human ✅
- **0.7 - 0.9:** Likely human ✅
- **0.5 - 0.7:** Suspicious, but allow ⚠️
- **0.0 - 0.5:** Likely bot ❌

---

## Step 5: Redeploy Site

After adding environment variables:

1. Go to **Netlify Dashboard → Deploys**
2. Click **"Trigger deploy" → "Deploy site"**
3. Wait for deployment to complete

---

## Step 6: Test reCAPTCHA

1. **Visit unsubscribe page:**
   - Go to `/unsubscribe`
   - Open browser console (F12)

2. **Check reCAPTCHA loading:**
   - Should see no errors in console
   - reCAPTCHA script should load

3. **Submit form:**
   - Enter valid email
   - Submit form
   - Should work normally

4. **Check Netlify Function logs:**
   - Go to **Netlify Dashboard → Functions → validate-unsubscribe**
   - Look for: `✅ reCAPTCHA verified` with score
   - Should see score between 0.0 and 1.0

---

## Troubleshooting

### Issue: "reCAPTCHA not loaded"

**Possible causes:**
- Site key not configured
- Site key incorrect
- Domain not added to reCAPTCHA settings

**Solution:**
1. Verify site key in `index.html` or environment variable
2. Check reCAPTCHA Admin Console - ensure domains are added
3. Check browser console for errors

### Issue: "reCAPTCHA verification failed"

**Possible causes:**
- Secret key not configured
- Secret key incorrect
- Token expired (tokens expire after 2 minutes)

**Solution:**
1. Verify `RECAPTCHA_SECRET_KEY` in Netlify environment variables
2. Check Netlify function logs for specific error codes
3. Ensure secret key matches the site key

### Issue: "reCAPTCHA score too low"

**Possible causes:**
- User is actually a bot
- User has suspicious behavior
- Threshold too high

**Solution:**
1. Check the actual score in logs
2. Adjust `RECAPTCHA_SCORE_THRESHOLD` if needed
3. Review Google reCAPTCHA dashboard for insights

### Issue: reCAPTCHA not working in development

**Solution:**
- Add `localhost` to reCAPTCHA domains
- Or use environment variable for site key

---

## Cost

- **Free tier:** 1 million requests/month
- **Paid:** $1 per 1,000 requests after free tier

For most sites, the free tier is sufficient.

---

## Security Notes

✅ **Site Key (public):** Safe to expose in frontend code
❌ **Secret Key (private):** Must be kept secret, only in environment variables

---

## Next Steps

After setup:
1. Monitor reCAPTCHA scores in Netlify function logs
2. Review Google reCAPTCHA dashboard for insights
3. Adjust threshold based on false positives/negatives
4. Check bot detection rate improvement

---

## Quick Reference

**Environment Variables Needed:**
- `VITE_RECAPTCHA_SITE_KEY` - Your Site Key (public)
- `RECAPTCHA_SECRET_KEY` - Your Secret Key (private)
- `RECAPTCHA_SCORE_THRESHOLD` - Optional (default: 0.5)

**Files Modified:**
- `index.html` - Added reCAPTCHA script
- `src/pages/UnsubscribePage.tsx` - Gets reCAPTCHA token
- `netlify/functions/validate-unsubscribe.js` - Verifies token
- `src/types/recaptcha.d.ts` - TypeScript types

---

**Need help?** Let me know if you encounter any issues during setup!

