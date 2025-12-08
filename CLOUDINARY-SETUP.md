# Cloudinary Image Upload Setup

## Overview
This setup allows the Core 1.0 upgrade form to upload images to Cloudinary, providing permanent, viewable image URLs in form submissions.

## Why Cloudinary?

✅ **Free Tier**: 25GB storage, 25GB bandwidth/month  
✅ **Automatic Optimization**: Images are automatically optimized  
✅ **CDN**: Fast global delivery  
✅ **Permanent URLs**: Images are accessible via direct URLs  
✅ **Easy Integration**: Simple API, no OAuth complexity  
✅ **Secure**: HTTPS URLs by default  

## Setup Steps

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials

1. Log into Cloudinary Dashboard
2. Go to **Settings** → **Security** (or check your dashboard homepage)
3. Copy these values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Create Upload Preset (Optional but Recommended)

1. Go to **Settings** → **Upload** → **Upload presets**
2. Click **Add upload preset**
3. Configure:
   - **Preset name**: `acdw_forms`
   - **Signing mode**: **Unsigned** (allows uploads without signature)
   - **Folder**: `acdw-upgrade-forms` (optional, for organization)
   - **Allowed formats**: `jpg, png, gif, webp`
   - **Max file size**: `5MB`
   - **Use filename**: ✅ Enabled (keeps original filename)
4. Click **Save**

### 4. Add Environment Variables to Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**⚠️ IMPORTANT**: Never commit these values to Git!

### 5. Test the Integration

1. Submit the Core 1.0 upgrade form with an image
2. Check Netlify function logs for upload success
3. Verify the image URL in the form submission
4. Click the URL to confirm the image is accessible

## How It Works

1. **User selects image** → Client validates (size, type)
2. **Client converts to base64** → Using FileReader API
3. **Client uploads to Cloudinary** → Via `upload-image` Netlify Function
4. **Cloudinary returns permanent URL** → HTTPS URL like `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/acdw-upgrade-forms/image.jpg`
5. **Form submits with image URL** → URL is stored in Netlify Forms
6. **Image is viewable** → Click the URL in form submissions to view

## Image URLs in Form Submissions

After setup, form submissions will contain:
- **Field**: `photoUrl`
- **Value**: `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/acdw-upgrade-forms/filename.jpg`

You can:
- Click the URL to view the image
- Copy the URL to share
- Use the URL in emails or other systems

## Troubleshooting

### Error: "Image upload service not configured"
- **Solution**: Add environment variables to Netlify (Step 4)

### Error: "Invalid upload preset"
- **Solution**: Create the upload preset in Cloudinary (Step 3) or remove `upload_preset` from the function

### Images not appearing
- **Check**: Cloudinary dashboard → **Media Library** → Verify images are uploaded
- **Check**: Netlify function logs for errors
- **Check**: Image URL format (should start with `https://res.cloudinary.com`)

### Upload fails with 401/403
- **Solution**: Use unsigned upload preset (Step 3) or implement signed uploads

## Alternative: Signed Uploads (More Secure)

If you prefer signed uploads (more secure, but more complex):

1. Remove `upload_preset` from the function
2. Generate signature on server-side using API secret
3. Add signature to upload request

See Cloudinary docs: https://cloudinary.com/documentation/upload_images#generating_authentication_signatures

## Cost Considerations

**Free Tier Limits**:
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

**For ACDW**:
- Assuming 1MB per image, 25GB = ~25,000 images
- Bandwidth: 25GB = ~25,000 image views/month
- Should be sufficient for initial usage

**If you exceed limits**:
- Paid plans start at $89/month
- Or consider alternative: Netlify Blobs (native to Netlify)

## Next Steps

1. ✅ Complete setup steps above
2. ✅ Test with a real form submission
3. ✅ Verify images appear in Netlify Forms
4. ✅ Check Cloudinary dashboard for uploaded images
5. ✅ Update Zapier/Pipedrive if needed to handle image URLs

