# Security Monitoring & Logging Guide

**Phase 3 Implementation**  
**Date**: December 2024

---

## Overview

All security events are now logged using structured JSON format in Netlify Functions logs. This guide explains how to monitor and respond to security events.

---

## Where to Find Logs

### Netlify Dashboard
1. Go to **Netlify Dashboard** → **Functions**
2. Click on a function name (e.g., `validate-form-submission`)
3. Click on **Logs** tab
4. Filter by `[SECURITY]` to see only security events

### Log Format
All security logs are prefixed with `[SECURITY]` and contain structured JSON:

```json
{
  "timestamp": "2024-12-03T18:00:00.000Z",
  "level": "WARN",
  "eventType": "rate_limit_exceeded",
  "data": {
    "limitType": "form",
    "limit": 10,
    "remaining": 0,
    "exceeded": true
  },
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "environment": "production",
    "function": "validate-form-submission"
  }
}
```

---

## Security Event Types

### 🔴 ERROR Level Events

#### `form_validation_failed`
**When**: Form submission fails validation  
**Action**: Review validation errors, check if it's a legitimate user error or attack

#### `recaptcha_failure`
**When**: reCAPTCHA verification fails  
**Action**: Could indicate bot attack or reCAPTCHA misconfiguration

#### `api_error`
**When**: API endpoint encounters an error  
**Action**: Review error details, check for potential attacks

---

### 🟡 WARN Level Events

#### `form_bot_detected`
**When**: Honeypot fields are filled (bot detected)  
**Action**: Blocked automatically, but monitor for patterns

**Details to check**:
- IP address (is it a known bot?)
- User agent (suspicious patterns?)
- Frequency (same IP repeatedly?)

#### `recaptcha_low_score`
**When**: reCAPTCHA score is below threshold (0.5)  
**Action**: Form is blocked, but monitor for patterns

**What to look for**:
- Low scores from same IP
- Low scores from same user agent
- Geographic patterns

#### `rate_limit_exceeded`
**When**: User exceeds rate limit  
**Action**: Request is blocked, but monitor for abuse patterns

**What to check**:
- Same IP hitting multiple rate limits
- Distributed attacks (different IPs, same pattern)
- Legitimate users being blocked (may need to adjust limits)

#### `xss_attempt`
**When**: Input sanitization removes dangerous content  
**Action**: Form is sanitized and submitted, but log the attempt

**What to monitor**:
- Same IP attempting XSS repeatedly
- Patterns in XSS attempts
- Which fields are being targeted

---

### 🟢 INFO Level Events

#### `form_submission`
**When**: Form is successfully submitted  
**Action**: Normal operation, but useful for audit trail

#### `recaptcha_success`
**When**: reCAPTCHA verification succeeds  
**Action**: Normal operation

#### `rate_limit_hit`
**When**: Rate limit is checked (not exceeded)  
**Action**: Normal operation, shows remaining requests

#### `api_access`
**When**: API endpoint is accessed successfully  
**Action**: Normal operation, audit trail

---

## Monitoring Checklist

### Daily Monitoring
- [ ] Check for ERROR level events
- [ ] Review rate limit violations
- [ ] Check for bot detection patterns
- [ ] Review XSS/injection attempts

### Weekly Review
- [ ] Analyze IP addresses with multiple violations
- [ ] Review geographic patterns
- [ ] Check for new attack vectors
- [ ] Review rate limit effectiveness

### Monthly Analysis
- [ ] Trends in security events
- [ ] Effectiveness of security measures
- [ ] Adjust rate limits if needed
- [ ] Update security policies

---

## Setting Up Alerts

### Netlify Functions Logs
Netlify doesn't have built-in alerting, but you can:

1. **Use Netlify's Log Drains** (Pro plan):
   - Set up log drain to external service (Datadog, LogRocket, etc.)
   - Configure alerts on error patterns

2. **Manual Monitoring**:
   - Check logs daily
   - Set calendar reminders
   - Use browser bookmarks for quick access

3. **Third-Party Monitoring** (Optional):
   - Integrate with monitoring service
   - Set up alerts for ERROR level events
   - Configure dashboards for security metrics

---

## Responding to Security Events

### Rate Limit Violations
**If same IP repeatedly exceeds limits:**
1. Check if it's a legitimate user (check form submissions)
2. If bot/attacker: No action needed (already blocked)
3. If legitimate: Consider whitelisting or adjusting limits

### Bot Detection
**If bots are detected:**
1. Already blocked automatically
2. Monitor for patterns (same IP, same user agent)
3. Consider additional blocking if needed

### XSS/Injection Attempts
**If injection attempts detected:**
1. Input is already sanitized
2. Monitor for patterns
3. Check if same IP/user agent repeatedly attempts
4. Consider additional blocking for repeat offenders

### reCAPTCHA Failures
**If reCAPTCHA fails:**
1. Check if it's a configuration issue
2. Monitor for bot patterns
3. Review score thresholds (may need adjustment)

---

## Log Retention

- **Netlify Functions Logs**: Retained for 7 days (free plan) or 30 days (Pro plan)
- **Recommendation**: Export important security events to external storage if needed for compliance

---

## Security Metrics to Track

### Key Metrics
1. **Form Submission Success Rate**: Should be high (>95%)
2. **Bot Detection Rate**: Monitor for spikes
3. **Rate Limit Hit Rate**: Should be low (<1%)
4. **XSS Attempt Rate**: Monitor for patterns
5. **reCAPTCHA Failure Rate**: Should be low (<5%)

### Red Flags
- Sudden spike in bot detections
- Multiple XSS attempts from same IP
- High rate limit violation rate
- Geographic anomalies (attacks from unexpected regions)

---

## Example Log Queries

### Find all bot detections
Filter logs for: `"eventType":"form_bot_detected"`

### Find rate limit violations
Filter logs for: `"eventType":"rate_limit_exceeded"`

### Find XSS attempts
Filter logs for: `"eventType":"xss_attempt"`

### Find all errors
Filter logs for: `"level":"ERROR"`

### Find events from specific IP
Filter logs for: `"ip":"192.168.1.1"`

---

## Best Practices

1. **Regular Monitoring**: Check logs at least daily
2. **Pattern Recognition**: Look for repeated IPs, user agents, or patterns
3. **Documentation**: Document any security incidents
4. **Response Plan**: Have a plan for responding to attacks
5. **Review Thresholds**: Periodically review rate limits and reCAPTCHA thresholds

---

## Troubleshooting

### Logs Not Appearing
- Check Netlify Functions are deployed
- Verify function is being called
- Check Netlify dashboard → Functions → Logs

### Too Many Warnings
- Review if thresholds are too strict
- Check if legitimate users are being blocked
- Adjust rate limits or reCAPTCHA thresholds if needed

### Missing Events
- Verify security logger is imported in functions
- Check function code for proper logging calls
- Review function deployment

---

## Next Steps

1. **Set up daily log review routine**
2. **Document any security incidents**
3. **Review and adjust thresholds as needed**
4. **Consider log aggregation service for long-term storage** (optional)

---

**Last Updated**: December 2024  
**Maintained By**: Development Team

