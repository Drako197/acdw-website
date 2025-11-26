/**
 * HVAC License Format Validation
 * 
 * State-specific license number format patterns for validation
 * These patterns help validate format but don't verify authenticity
 */

export interface LicenseFormat {
  pattern: RegExp
  example: string
  description: string
  lookupUrl?: string
}

export const LICENSE_FORMATS: Record<string, LicenseFormat> = {
  // Florida - CAC (Certified Air Conditioning) or HVAC license
  FL: {
    pattern: /^(CAC|HVAC-|HVAC)\d{5,8}$/i,
    example: 'CAC123456',
    description: 'Format: CAC followed by 5-8 digits, or HVAC-XXXXX',
    lookupUrl: 'https://www.myfloridalicense.com/CheckLicense2/',
  },
  
  // California - 6 digit license number
  CA: {
    pattern: /^\d{6}$/,
    example: '123456',
    description: '6-digit license number',
    lookupUrl: 'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/',
  },
  
  // Texas - TACL (Texas Air Conditioning & Refrigeration Contractors)
  TX: {
    pattern: /^(TACL-|TACL)\d{4,6}$/i,
    example: 'TACL-12345',
    description: 'Format: TACL- followed by 4-6 digits',
    lookupUrl: 'https://www.tdlr.texas.gov/',
  },
  
  // New York - 5 digit license number
  NY: {
    pattern: /^\d{5}$/,
    example: '12345',
    description: '5-digit license number',
    lookupUrl: 'https://aca-prod.accela.com/NYS/',
  },
  
  // Arizona - ROC (Registrar of Contractors)
  AZ: {
    pattern: /^(ROC-|ROC)\d{5,8}$/i,
    example: 'ROC-123456',
    description: 'Format: ROC- followed by 5-8 digits',
    lookupUrl: 'https://roc.az.gov/',
  },
  
  // North Carolina - 5-7 digit license number
  NC: {
    pattern: /^\d{5,7}$/,
    example: '123456',
    description: '5-7 digit license number',
    lookupUrl: 'https://www.nclbgc.org/',
  },
  
  // Georgia - 6-8 digit license number
  GA: {
    pattern: /^\d{6,8}$/,
    example: '123456',
    description: '6-8 digit license number',
    lookupUrl: 'https://verify.sos.ga.gov/verification/',
  },
  
  // Default pattern for states without specific format
  DEFAULT: {
    pattern: /^[A-Z0-9-]{4,15}$/i,
    example: 'LIC-12345',
    description: 'Alphanumeric with hyphens, 4-15 characters',
  },
}

/**
 * Validate license number format for a given state
 */
export function validateLicenseFormat(state: string, licenseNumber: string): {
  valid: boolean
  error?: string
} {
  if (!licenseNumber || !licenseNumber.trim()) {
    return { valid: false, error: 'License number is required' }
  }

  const trimmed = licenseNumber.trim().toUpperCase()
  const format = LICENSE_FORMATS[state] || LICENSE_FORMATS.DEFAULT

  if (!format.pattern.test(trimmed)) {
    return {
      valid: false,
      error: `Invalid format. Expected: ${format.description} (Example: ${format.example})`,
    }
  }

  return { valid: true }
}

/**
 * Get license format info for a state
 */
export function getLicenseFormat(state: string): LicenseFormat {
  return LICENSE_FORMATS[state] || LICENSE_FORMATS.DEFAULT
}

