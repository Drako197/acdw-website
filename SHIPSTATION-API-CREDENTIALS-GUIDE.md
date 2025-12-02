# How to Find ShipStation API Credentials

## Step-by-Step Guide

### Step 1: Log into ShipStation
1. Go to [https://www.shipstation.com](https://www.shipstation.com)
2. Click **"Sign In"** (top right)
3. Enter your credentials and log in

### Step 2: Navigate to API Settings
1. Once logged in, look for **Settings** (usually in the top navigation or left sidebar)
2. Click on **Settings**
3. In the Settings menu, look for **"API Settings"** or **"API"**
   - It might be under **"Account"** or **"Integrations"**
   - Sometimes it's labeled as **"API Access"** or **"Developer Settings"**

### Step 3: Find Your API Credentials
Once you're in the API Settings page, you should see:

**API Key:**
- Usually displayed as a long string of characters
- May be labeled as "API Key", "Key", or "Public Key"
- **Copy this value** - we'll need it

**API Secret:**
- Usually displayed as another long string
- May be labeled as "API Secret", "Secret", "Secret Key", or "Private Key"
- **Copy this value** - we'll need it

**Note:** Some ShipStation accounts may require you to:
- **Generate** new API credentials (if you haven't created them yet)
- Click a button like **"Generate API Key"** or **"Create API Credentials"**

### Step 4: Check for Store ID (if applicable)
If you have multiple stores/channels:
1. Look for **"Stores"** or **"Channels"** in Settings
2. Note the **Store ID** for the store you want to use
3. If you only have one store, you may not need this

### Alternative: If You Can't Find API Settings

**Option 1: Search in ShipStation**
- Use the search bar (if available) and search for "API"
- Look for "API Settings" or "API Access" in search results

**Option 2: Check Account Settings**
- Go to **Account Settings** or **User Settings**
- Look for **"API"** or **"Developer"** section

**Option 3: Contact ShipStation Support**
- If you still can't find it, ShipStation support can guide you
- They can also help you generate API credentials if needed

## What the Page Should Look Like

The API Settings page typically shows:
- **API Key:** `[long string of characters]`
- **API Secret:** `[another long string]`
- **Status:** Active/Enabled
- **Permissions:** What the API can access
- **Last Used:** When it was last accessed

## Security Note

⚠️ **Important:** 
- These credentials are sensitive - don't share them publicly
- We'll store them securely in Netlify environment variables
- Never commit them to git

## Once You Have the Credentials

Please provide:
1. **API Key:** `[paste here]`
2. **API Secret:** `[paste here]`
3. **Store ID:** `[if applicable, or "single store"]`

I'll add them to Netlify environment variables securely.

---

**Can't find it?** Let me know what you see in your Settings menu, and I can help guide you further!

