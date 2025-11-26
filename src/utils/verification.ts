/**
 * Verification Utilities
 * 
 * Helper functions for validating professional credentials
 */

/**
 * Validate Business Tax ID (EIN) format
 * Format: XX-XXXXXXX (2 digits, hyphen, 7 digits)
 */
export function validateEIN(ein: string): {
  valid: boolean
  error?: string
} {
  if (!ein || !ein.trim()) {
    return { valid: false, error: 'Business Tax ID (EIN) is required' }
  }

  // Remove spaces and convert to uppercase
  const cleaned = ein.replace(/\s/g, '').toUpperCase()

  // EIN format: XX-XXXXXXX (2 digits, hyphen, 7 digits)
  const einPattern = /^\d{2}-\d{7}$/

  if (!einPattern.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid format. Expected: XX-XXXXXXX (e.g., 12-3456789)',
    }
  }

  // Basic checksum validation (EINs have a checksum algorithm)
  // For now, we'll just validate format. Full checksum can be added later.
  
  return { valid: true }
}

/**
 * Format EIN for display (masked)
 * Shows only last 4 digits: XX-XXX6789
 */
export function maskEIN(ein: string): string {
  if (!ein) return ''
  const cleaned = ein.replace(/\s/g, '').replace(/-/g, '')
  if (cleaned.length < 9) return ein
  return `XX-XXX${cleaned.slice(-4)}`
}

/**
 * Format license number for display (masked)
 * Shows only last 4 characters: XXX-XXXX
 */
export function maskLicenseNumber(licenseNumber: string): string {
  if (!licenseNumber) return ''
  if (licenseNumber.length <= 4) return 'XXXX'
  const last4 = licenseNumber.slice(-4)
  const prefix = 'X'.repeat(Math.max(0, licenseNumber.length - 4))
  return `${prefix}-${last4}`
}

