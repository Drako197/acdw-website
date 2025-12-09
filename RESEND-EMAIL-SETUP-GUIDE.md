# Resend Email Setup Guide

## Overview
This guide will help you set up Resend API to send branded confirmation emails to customers after they submit forms on your website.

---

## Step 1: Create Resend Account

1. **Go to Resend**: Visit [https://resend.com](https://resend.com)
2. **Sign Up**: Click "Sign Up" and create a free account
3. **Verify Email**: Check your email and verify your account

---

## Step 2: Get Your API Key

1. **Dashboard**: After logging in, you'll see your dashboard
2. **API Keys**: Click on "API Keys" in the sidebar
3. **Create Key**: Click "Create API Key"
4. **Name It**: Give it a name like "ACDW Website Production"
5. **Copy Key**: Copy the API key immediately (you won't see it again!)
   - Format: `re_xxxxxxxxxxxxxxxxxxxxx`

---

## Step 3: Verify Your Domain (Required for Production)

**Important**: To send emails from `noreply@acdrainwiz.com`, you need to verify your domain.

### Option A: Use Resend's Default Domain (Quick Testing)
- Resend provides a default domain: `onboarding.resend.dev`
- Good for: Testing and development
- **Limitation**: Emails will come from `onboarding@resend.dev` (not branded)

### Option B: Verify Your Domain (Production - Recommended)

1. **Go to Domains**: In Resend dashboard, click "Domains"
2. **Add Domain**: Click "Add Domain"
3. **Enter Domain**: Enter `acdrainwiz.com`
4. **Add DNS Records**: Resend will provide DNS records to add:
   - **SPF Record**: `v=spf1 include:resend.com ~all`
   - **DKIM Record**: (provided by Resend)
   - **DMARC Record**: (optional but recommended)
5. **Add to DNS**: Add these records to your domain's DNS settings
   - Go to your domain registrar (where you bought acdrainwiz.com)
   - Add the DNS records provided by Resend
   - Wait 24-48 hours for DNS propagation
6. **Verify**: Once DNS propagates, Resend will verify your domain

---

## Step 4: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard**: [https://app.netlify.com](https://app.netlify.com)
2. **Select Your Site**: Click on "ACDW Website" (or your site name)
3. **Site Settings**: Click "Site settings" in the sidebar
4. **Environment Variables**: Click "Environment variables" under "Build & deploy"
5. **Add Variables**: Click "Add a variable" and add:

   **Variable 1:**
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (from Step 2)
   - **Scopes**: Select "All scopes" (or just "Production" if you want)

   **Variable 2 (Optional - if using custom domain):**
   - **Key**: `RESEND_FROM_EMAIL`
   - **Value**: `AC Drain Wiz <noreply@acdrainwiz.com>`
   - **Scopes**: Select "All scopes"

6. **Save**: Click "Save" after adding each variable

---

## Step 5: Test Email Sending

### Test in Production:

1. **Submit a Form**: Go to your website and submit any form (e.g., General Contact)
2. **Check Email**: Check the email inbox you used in the form
3. **Verify**: You should receive a branded confirmation email within seconds

### Test via Netlify Function Logs:

1. **Go to Netlify Dashboard**: Site → Functions → View logs
2. **Submit a Form**: Submit a test form
3. **Check Logs**: Look for:
   - ✅ `Confirmation email sent successfully` (success)
   - ❌ `Failed to send confirmation email` (error)

---

## Step 6: Customize Email Templates (Optional)

Email templates are located in:
```
netlify/functions/utils/email-templates.js
```

### What You Can Customize:

1. **Branding Colors**: Change the blue gradient (`#2563eb`) to your brand colors
2. **Logo**: Add your logo image URL to the header
3. **Contact Info**: Update phone number, email, website URL
4. **Content**: Modify the message text for each form type
5. **Footer**: Update footer links and text

### Example: Change Brand Color

Find this line in `email-templates.js`:
```javascript
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)
```

Change to your brand color:
```javascript
background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_DARKER_COLOR 100%)
```

---

## Troubleshooting

### Issue: Emails Not Sending

**Check 1: API Key**
- Verify `RESEND_API_KEY` is set in Netlify environment variables
- Make sure the key is correct (starts with `re_`)

**Check 2: Email Address**
- Verify the form is collecting a valid email address
- Check Netlify logs for "No email address provided"

**Check 3: Domain Verification**
- If using custom domain, verify it's verified in Resend dashboard
- Check DNS records are correct

**Check 4: Resend Dashboard**
- Go to Resend dashboard → Logs
- Check for any errors or blocked emails

### Issue: Emails Going to Spam

**Solutions:**
1. **Verify Domain**: Make sure your domain is verified in Resend
2. **SPF/DKIM**: Ensure DNS records are correct
3. **Content**: Avoid spam trigger words in subject/body
4. **Sender Reputation**: Build sender reputation by sending legitimate emails

### Issue: "Email service not configured" Error

**Solution:**
- Make sure `RESEND_API_KEY` is set in Netlify environment variables
- Redeploy your site after adding the environment variable

---

## Email Templates Included

We've created branded email templates for all 9 form types:

1. ✅ **General Contact** - "Thank You for Contacting Us!"
2. ✅ **Support Request** - "Support Request Received"
3. ✅ **Sales Inquiry** - "Thank You for Your Interest!"
4. ✅ **Find an Installer** - "Installer Search Request Received"
5. ✅ **Demo Request** - "Demo Request Received"
6. ✅ **Promo Signup** - "You're All Set!"
7. ✅ **Core 1.0 Upgrade** - "Upgrade Request Received"
8. ✅ **Email Preferences** - "Email Preferences Updated"
9. ✅ **Unsubscribe** - "You've Been Unsubscribed"

Each template includes:
- ✅ ACDW branding (colors, logo area)
- ✅ Personalized greeting with customer name
- ✅ Form submission details
- ✅ "What Happens Next" section
- ✅ Contact information
- ✅ Email preferences/unsubscribe links

---

## Cost Information

### Resend Pricing:

- **Free Tier**: 3,000 emails/month
- **Pro Plan**: $20/month for 50,000 emails
- **Pay-as-you-go**: $0.30 per 1,000 emails after free tier

### For ACDW Website:

- **Estimated Monthly Volume**: ~100-500 form submissions
- **Cost**: **FREE** (well within 3,000/month limit)
- **Upgrade Needed**: Only if you exceed 3,000 emails/month

---

## Next Steps

1. ✅ Create Resend account
2. ✅ Get API key
3. ✅ Add to Netlify environment variables
4. ✅ Test email sending
5. ✅ Verify emails are received
6. ✅ Customize templates (optional)
7. ✅ Monitor email delivery in Resend dashboard

---

## Support

If you encounter any issues:

1. **Check Netlify Logs**: Site → Functions → View logs
2. **Check Resend Logs**: Resend dashboard → Logs
3. **Verify Environment Variables**: Netlify → Site settings → Environment variables
4. **Test Email Function**: Submit a test form and check logs

---

## Security Notes

- ✅ API key is stored securely in Netlify environment variables
- ✅ Emails are sent server-side (not exposed to client)
- ✅ Email addresses are sanitized in logs (only first 3 chars shown)
- ✅ Form validation happens before email is sent
- ✅ Email sending is non-blocking (form submission succeeds even if email fails)

---

## Success Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] API key added to Netlify environment variables
- [ ] Domain verified (if using custom domain)
- [ ] Test form submitted
- [ ] Confirmation email received
- [ ] Email looks correct (branding, content)
- [ ] All 9 form types tested
- [ ] Email delivery verified in Resend dashboard

---

**Ready to test?** Submit a form on your website and check your email inbox!

