# XSS Sanitization Verification Guide

## How to Verify Sanitization is Working

### Test 1: Check What's Actually in Netlify

1. Go to **Netlify Dashboard** → **Forms** → **contact-general**
2. Click on **Submissions**
3. Find your test submission
4. Click to view the details
5. **Check the `message` field**:
   - ✅ **If you see**: `alert('XSS')` (no script tags) → **Sanitization is working!**
   - ❌ **If you see**: `<script>alert('XSS')</script>` → Sanitization is NOT working

### Test 2: Test with Mixed Content

Submit a form with this in the message field:
```
Hello, this is a test message. <script>alert('XSS')</script> More text here.
```

**Expected Result in Netlify**:
```
Hello, this is a test message. alert('XSS') More text here.
```

The script tags should be removed, but the text content should remain.

### Test 3: Check Zap Logs

1. Go to **Zapier Dashboard**
2. Find your **General Contact Zap**
3. Click on **History**
4. Look for your test submission
5. Check for:
   - ✅ **Success**: Zap ran successfully
   - ❌ **Error**: Check the error message
   - ⚠️ **Skipped**: Check why it was skipped

### Common Issues

#### Issue 1: Message Field Appears Empty
**Cause**: If you only entered `<script>alert('XSS')</script>` with no other text, after removing tags you get `alert('XSS')` which might look suspicious.

**Solution**: Test with mixed content (see Test 2 above)

#### Issue 2: Zap Not Triggering
**Possible Causes**:
1. **Netlify Forms spam filter**: Netlify might be marking it as spam
2. **Zap filter**: Your Zap might have a filter that's rejecting it
3. **Empty message field**: If the message is empty after sanitization, the Zap might skip it

**How to Check**:
- In Netlify, check if the submission is marked as "Spam"
- In Zapier, check if there's a filter on the trigger
- Check if the message field is empty in Netlify

#### Issue 3: Data Not Showing in Pipedrive
**Possible Causes**:
1. Zap failed to run
2. Zap filter rejected the submission
3. Pipedrive field mapping issue

**How to Check**:
- Check Zapier history for errors
- Verify Pipedrive field mappings in Zap
- Check if other fields (name, email) are making it to Pipedrive

## What Sanitization Does

When you enter: `<script>alert('XSS')</script>`

The sanitization process:
1. ✅ Removes `<script>` tag → Result: `alert('XSS')</script>`
2. ✅ Removes `</script>` tag → Result: `alert('XSS')`
3. ✅ Keeps the text content → Final: `alert('XSS')`

**This is correct behavior!** The script tags are removed, preventing XSS attacks.

## Verification Checklist

- [ ] Submission appears in Netlify Forms
- [ ] Message field shows sanitized content (no script tags)
- [ ] Other fields (name, email, etc.) are present
- [ ] Zap triggers successfully
- [ ] Data appears in Pipedrive (if Zap is working)
- [ ] No script tags in any field

## Expected Behavior

✅ **CORRECT**: Script tags removed, text content preserved
- Input: `<script>alert('XSS')</script>`
- Output: `alert('XSS')`

✅ **CORRECT**: Mixed content sanitized properly
- Input: `Hello <script>alert('XSS')</script> world`
- Output: `Hello alert('XSS') world`

❌ **INCORRECT**: Script tags still present
- Input: `<script>alert('XSS')</script>`
- Output: `<script>alert('XSS')</script>` ← This means sanitization failed

## Next Steps

1. **If sanitization is working** (script tags removed): ✅ Security is working correctly!
2. **If Zap is not triggering**: Check Zapier logs and filters
3. **If data not in Pipedrive**: Check Zap configuration and field mappings

