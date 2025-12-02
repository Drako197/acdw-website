# Local Development Guide

## Issue: Netlify Functions Not Available in Vite Dev Server

When running `npm run dev` (Vite dev server), Netlify Functions are **not available**. You'll see 404 errors like:

```
POST http://localhost:5173/.netlify/functions/get-price-id 404 (Not Found)
```

This is **expected behavior** - Vite's dev server doesn't run Netlify Functions.

---

## Solution: Use Netlify Dev

To test Netlify Functions locally, you need to use **Netlify Dev**, which runs both your frontend and functions.

### Prerequisites

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify** (if not already logged in):
   ```bash
   netlify login
   ```

3. **Link your site** (if not already linked):
   ```bash
   netlify link
   ```
   This will prompt you to select your site from your Netlify account.

### Running Netlify Dev

**Option 1: Use the npm script** (recommended):
```bash
npm run dev:netlify
```

**Option 2: Run directly**:
```bash
netlify dev
```

This will:
- Start the Vite dev server (frontend)
- Start Netlify Functions server
- Proxy requests to `/.netlify/functions/*` to the functions server
- Use your Netlify environment variables

### What You'll See

```
◈ Netlify Dev ◈
◈ Server now ready on http://localhost:8888
◈ Functions server is running on port 9999
```

Your site will be available at **http://localhost:8888** (not 5173).

---

## Alternative: Test on Deployed Site

If you don't want to set up Netlify Dev locally, you can:

1. **Deploy to Netlify** (push to main branch or use Netlify CLI):
   ```bash
   netlify deploy --prod
   ```

2. **Test on the deployed site** (e.g., `https://www.acdrainwiz.com`)

3. **Use Netlify's Deploy Preview** for testing before production

---

## Troubleshooting

### Error: "netlify: command not found"
- Install Netlify CLI: `npm install -g netlify-cli`

### Error: "Site not linked"
- Run: `netlify link`
- Or manually create `.netlify/state.json` with your site ID

### Functions still return 404
- Make sure you're accessing the site at `http://localhost:8888` (not 5173)
- Check that `netlify dev` is running
- Verify functions exist in `netlify/functions/` directory

### Environment Variables Not Loading
- Netlify Dev automatically loads from your Netlify site's environment variables
- To use local env vars, create `.env` file (but don't commit secrets!)
- Or set them in Netlify Dashboard → Site Settings → Environment Variables

---

## Quick Reference

| Command | Purpose | Port |
|---------|---------|------|
| `npm run dev` | Vite dev server (no functions) | 5173 |
| `npm run dev:netlify` | Netlify Dev (with functions) | 8888 |
| `netlify dev` | Same as above | 8888 |
| `npm run build` | Build for production | - |
| `netlify deploy --prod` | Deploy to production | - |

---

## For Guest Checkout Testing

When testing guest checkout locally:

1. **Start Netlify Dev**:
   ```bash
   npm run dev:netlify
   ```

2. **Open browser** to `http://localhost:8888/products/mini`

3. **Test guest checkout**:
   - Click "Buy Now - Guest Checkout"
   - Should redirect to Stripe Checkout (test mode)
   - Complete checkout with test card: `4242 4242 4242 4242`
   - Should redirect to success page with account creation offer

4. **Verify functions are working**:
   - Check browser console - no 404 errors
   - Check terminal - should see function logs

---

## Note on Browser Extension Errors

The errors you see like:
```
Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

These are **browser extension errors** (often from password managers, ad blockers, etc.) and can be **safely ignored**. They don't affect your application.

---

## Next Steps

1. Install Netlify CLI if needed
2. Run `npm run dev:netlify`
3. Test guest checkout at `http://localhost:8888/products/mini`
4. Verify the full flow works end-to-end

