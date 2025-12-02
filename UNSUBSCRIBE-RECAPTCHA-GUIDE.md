# Step 2: reCAPTCHA v3 Integration

## Overview
Google reCAPTCHA v3 provides invisible bot detection that runs in the background. It gives each user a "score" (0.0 to 1.0) indicating how likely they are to be human.

## How It Works
1. reCAPTCHA script loads on page
2. Analyzes user behavior (mouse movements, clicks, etc.)
3. Returns a score (1.0 = human, 0.0 = bot)
4. We verify the score server-side before accepting submission

## Implementation Steps

### Step 2.1: Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"+"** to create a new site
3. Fill in:
   - **Label:** "AC Drain Wiz Unsubscribe"
   - **reCAPTCHA type:** Select **"reCAPTCHA v3"**
   - **Domains:** Add your domains:
     - `acdrainwiz.com`
     - `www.acdrainwiz.com`
     - `localhost` (for testing)
   - Accept terms
4. Click **Submit**
5. **Copy your keys:**
   - **Site Key** (public, goes in frontend)
   - **Secret Key** (private, goes in Netlify environment variable)

### Step 2.2: Add reCAPTCHA Script to HTML

Edit `index.html`:

**Add before closing `</head>` tag:**
```html
<!-- Google reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```

Replace `YOUR_SITE_KEY` with your actual site key.

### Step 2.3: Update UnsubscribePage Component

**Add to imports:**
```typescript
// No additional imports needed - reCAPTCHA is global
```

**Add state for reCAPTCHA token:**
```typescript
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
```

**Add function to get reCAPTCHA token:**
```typescript
const getRecaptchaToken = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    // Check if reCAPTCHA is loaded
    if (typeof window.grecaptcha === 'undefined') {
      console.warn('reCAPTCHA not loaded')
      resolve(null)
      return
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute('YOUR_SITE_KEY', { action: 'unsubscribe' })
        .then((token: string) => {
          resolve(token)
        })
        .catch((error: any) => {
          console.error('reCAPTCHA error:', error)
          resolve(null)
        })
    })
  })
}
```

**Update handleSubmit function:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // ... existing validation code ...
  
  // Get reCAPTCHA token before submitting
  const token = await getRecaptchaToken()
  if (!token) {
    setSubmitError('Security verification failed. Please refresh and try again.')
    return
  }
  
  // Add token to submission data
  const submissionData: Record<string, string> = {
    'form-name': 'unsubscribe',
    email: email.trim(),
    reason: reason,
    feedback: feedback || '',
    'recaptcha-token': token // Add reCAPTCHA token
  }
  
  // ... rest of submission code ...
}
```

### Step 2.4: Update Netlify Function to Verify Token

**Update `netlify/functions/validate-unsubscribe.js`:**

**Add at the top:**
```javascript
// reCAPTCHA verification
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
```

**Add verification function (before handler):**
```javascript
const verifyRecaptcha = async (token) => {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured')
    return { success: false, score: 0 }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token
      }).toString()
    })

    const data = await response.json()
    return {
      success: data.success,
      score: data.score || 0
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false, score: 0 }
  }
}
```

**Add verification in handler (after parsing form data):**
```javascript
// Verify reCAPTCHA token
const recaptchaToken = formData.get('recaptcha-token') || ''
if (recaptchaToken) {
  const recaptchaResult = await verifyRecaptcha(recaptchaToken)
  
  if (!recaptchaResult.success) {
    console.warn('reCAPTCHA verification failed', {
      ip: event.headers['x-forwarded-for'],
      userAgent: event.headers['user-agent']
    })
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Security verification failed',
        message: 'Please refresh and try again'
      })
    }
  }
  
  // Check score (0.0 = bot, 1.0 = human)
  // Threshold: 0.5 (adjust based on your needs)
  if (recaptchaResult.score < 0.5) {
    console.warn('reCAPTCHA score too low', {
      score: recaptchaResult.score,
      ip: event.headers['x-forwarded-for'],
      userAgent: event.headers['user-agent']
    })
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: 'Suspicious activity detected',
        message: 'Please try again'
      })
    }
  }
  
  console.log('reCAPTCHA verified', { score: recaptchaResult.score })
} else {
  // Token missing - could be bot or reCAPTCHA not loaded
  console.warn('reCAPTCHA token missing')
  // You can choose to reject or allow (for graceful degradation)
  // For now, we'll allow but log it
}
```

### Step 2.5: Add Secret Key to Netlify Environment Variables

1. Go to **Netlify Dashboard → Site Settings → Environment Variables**
2. Click **"Add variable"**
3. Add:
   - **Key:** `RECAPTCHA_SECRET_KEY`
   - **Value:** Your reCAPTCHA Secret Key
4. Click **Save**
5. **Redeploy** your site for the function to pick up the new variable

### Step 2.6: Add TypeScript Types (Optional)

Create `src/types/recaptcha.d.ts`:
```typescript
interface Window {
  grecaptcha: {
    ready: (callback: () => void) => void
    execute: (siteKey: string, options: { action: string }) => Promise<string>
  }
}
```

### Step 2.7: Test reCAPTCHA

1. **Deploy to production**
2. **Open unsubscribe page**
3. **Check browser console** - should see reCAPTCHA loading
4. **Submit form** - should work normally
5. **Check Netlify Function logs** - should see reCAPTCHA score

## Score Thresholds

- **0.9 - 1.0:** Definitely human ✅
- **0.7 - 0.9:** Likely human ✅
- **0.5 - 0.7:** Suspicious, but allow ⚠️
- **0.0 - 0.5:** Likely bot ❌

**Recommended threshold: 0.5** (adjust based on your traffic)

## Benefits

✅ **Invisible to users** - No CAPTCHA challenges
✅ **Strong bot detection** - Google's ML models
✅ **Score-based** - More nuanced than pass/fail
✅ **Low friction** - Users don't notice it

## Limitations

- Requires Google account and API keys
- Adds ~100-200ms latency
- May block some legitimate users with low scores
- Requires server-side verification

## Cost

- **Free tier:** 1 million requests/month
- **Paid:** $1 per 1,000 requests after free tier

## Next Steps

After implementing:
1. Monitor reCAPTCHA scores for 1-2 weeks
2. Adjust threshold based on false positives/negatives
3. Review Google reCAPTCHA dashboard for insights

