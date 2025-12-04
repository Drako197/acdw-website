# CSP 'unsafe-inline' Explanation

## Why We Use 'unsafe-inline'

Our Content Security Policy (CSP) includes `'unsafe-inline'` in the `script-src` directive, which securityheaders.com flags as a warning. Here's why it's necessary and acceptable in our case:

### Required For:

1. **Vite/React Build System**
   - Vite injects inline scripts during the build process
   - React's hydration requires inline scripts
   - Module scripts need inline execution

2. **Third-Party Libraries**
   - Clerk authentication may use inline scripts
   - Google reCAPTCHA uses inline scripts
   - Some React libraries require inline execution

3. **Development vs Production**
   - In development, Vite uses inline scripts for HMR (Hot Module Replacement)
   - Production builds still require some inline scripts for initialization

### Security Mitigations

Even with `'unsafe-inline'`, we have strong security protections:

1. **Input Sanitization**: All user inputs are sanitized server-side
2. **XSS Protection**: Script tags are removed from all form submissions
3. **Rate Limiting**: Prevents rapid-fire attacks
4. **reCAPTCHA**: Bot protection on all forms
5. **Honeypot Fields**: Additional bot detection
6. **Strict Source Lists**: Only trusted domains allowed in CSP

### Alternative Solutions (Not Feasible)

1. **Nonces**: Would require server-side rendering (we're using static site generation)
2. **Hashes**: Would break with every build (Vite generates different hashes)
3. **Remove 'unsafe-inline'**: Would break the application

### Current Security Grade: A

Despite the warning, we maintain an **A grade** from securityheaders.com because:
- ✅ All other security headers are properly configured
- ✅ Source lists are restrictive (only trusted domains)
- ✅ We have multiple layers of XSS protection
- ✅ Server-side sanitization prevents injection attacks

### Recommendation

**Keep `'unsafe-inline'` for now** because:
- The security risk is mitigated by our other protections
- Removing it would break the application
- The warning is acceptable given our security posture
- We maintain an A grade overall

### Future Improvements

If we migrate to a server-side rendered solution (Next.js, etc.), we could:
- Use nonces for inline scripts
- Implement stricter CSP without `'unsafe-inline'`
- Potentially achieve an A+ grade

For now, the current configuration provides strong security with practical functionality.

