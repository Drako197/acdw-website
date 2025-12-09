/**
 * Email Domain Validation Utility
 * 
 * Validates email domains to block disposable emails and invalid domains
 */

const { logBotDetected } = require('./security-logger')
const dns = require('dns').promises

/**
 * List of known disposable email domains
 */
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'mohmal.com',
  'fakeinbox.com',
  'trashmail.com',
  'mintemail.com',
  'mytrashmail.com',
  'throwawaymail.com',
  'maildrop.cc',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chammy.info',
  'devnullmail.com',
  'dispostable.com',
  'emailondeck.com',
  'fakemailgenerator.com',
  'getairmail.com',
  'inboxkitten.com',
  'mailcatch.com',
  'mailmoat.com',
  'mailsac.com',
  'mailtemp.info',
  'meltmail.com',
  'mintemail.com',
  'mohmal.com',
  'mytrashmail.com',
  'putthisinyourspamdatabase.com',
  'receiveee.com',
  'receiveee.org',
  'receiveemail.org',
  'reconmail.com',
  'sendspamhere.com',
  'spamgourmet.com',
  'spamherelots.com',
  'spamhereplease.com',
  'spamhole.com',
  'spamify.com',
  'spamobox.com',
  'spamspot.com',
  'tempail.com',
  'tempinbox.co.uk',
  'tempinbox.com',
  'tempmail.co',
  'tempmail.net',
  'tempmail.org',
  'tempmailaddress.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempmailo.com',
  'tempomail.fr',
  'temporary-mail.net',
  'temporarymailaddress.com',
  'throwaway.email',
  'throwawaymail.com',
  'trash-amil.com',
  'trashmail.com',
  'trashmail.de',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashmailer.com',
  'trashymail.com',
  'tyldd.com',
  'uggsrock.com',
  'wh4f.org',
  'whatpaas.com',
  'whyspam.me',
  'willselfdestruct.com',
  'wuzupmail.net',
  'xagloo.com',
  'xemaps.com',
  'xents.com',
  'xmaily.com',
  'xoxy.net',
  'yapped.net',
  'yeah.net',
  'yep.it',
  'yogamaven.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'youmailr.com',
  'ypmail.com',
  'zippymail.info',
  'zoemail.org'
]

/**
 * Check if email domain is disposable
 */
function isDisposableEmailDomain(domain) {
  const normalizedDomain = domain.toLowerCase().trim()
  return DISPOSABLE_EMAIL_DOMAINS.includes(normalizedDomain)
}

/**
 * Validate email domain has MX records (real email server)
 */
async function validateEmailDomainMX(domain) {
  try {
    const mxRecords = await dns.resolveMx(domain)
    
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        reason: 'No MX records found',
        details: {
          domain,
          message: 'Domain does not have email servers configured'
        }
      }
    }
    
    return {
      valid: true,
      mxRecords: mxRecords.length,
      servers: mxRecords.map(r => r.exchange)
    }
  } catch (error) {
    // DNS lookup failed - could be invalid domain or network issue
    // Fail open (allow) to prevent blocking legitimate users
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return {
        valid: false,
        reason: 'Domain not found',
        details: {
          domain,
          error: error.code
        }
      }
    }
    
    // Other DNS errors - allow (fail open)
    return {
      valid: true,
      reason: 'DNS lookup error (allowed)',
      details: {
        domain,
        error: error.message
      }
    }
  }
}

/**
 * Validate email domain
 */
async function validateEmailDomain(email, ip, userAgent, formType) {
  if (!email || !email.includes('@')) {
    return {
      valid: false,
      reason: 'Invalid email format',
      details: {
        email: email ? email.substring(0, 20) + '***' : 'none'
      }
    }
  }
  
  const domain = email.split('@')[1]
  if (!domain) {
    return {
      valid: false,
      reason: 'No domain in email',
      details: { email: email.substring(0, 20) + '***' }
    }
  }
  
  // Check if disposable email domain
  if (isDisposableEmailDomain(domain)) {
    logBotDetected(formType, 'disposable-email-domain', ip, userAgent, {
      domain,
      email: email.substring(0, 3) + '***@' + domain
    })
    
    return {
      valid: false,
      reason: 'Disposable email domain not allowed',
      details: {
        domain,
        message: 'Temporary email addresses are not accepted'
      }
    }
  }
  
  // Validate domain has MX records (async, don't block if fails)
  const mxCheck = await validateEmailDomainMX(domain)
  if (!mxCheck.valid && mxCheck.reason !== 'DNS lookup error (allowed)') {
    // Domain doesn't exist or has no email servers
    logBotDetected(formType, 'invalid-email-domain', ip, userAgent, {
      domain,
      reason: mxCheck.reason,
      email: email.substring(0, 3) + '***@' + domain
    })
    
    return {
      valid: false,
      reason: mxCheck.reason,
      details: mxCheck.details
    }
  }
  
  return {
    valid: true,
    domain,
    mxRecords: mxCheck.mxRecords,
    isDisposable: false
  }
}

module.exports = {
  isDisposableEmailDomain,
  validateEmailDomainMX,
  validateEmailDomain,
  DISPOSABLE_EMAIL_DOMAINS
}
