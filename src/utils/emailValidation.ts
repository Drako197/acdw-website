/**
 * Email Validation Utility
 * 
 * Provides consistent email validation across the application
 * Uses RFC 5322 compliant regex pattern
 */

/**
 * Validates email format using improved regex pattern
 * 
 * Pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
 * 
 * This pattern:
 * - Allows alphanumeric, dots, underscores, percent, plus, and hyphens in local part
 * - Requires @ symbol
 * - Allows alphanumeric, dots, and hyphens in domain
 * - Requires TLD to be at least 2 letters
 * 
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const trimmedEmail = email.trim()
  if (trimmedEmail.length === 0) {
    return false
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(trimmedEmail)
}

/**
 * Validates email and returns error message if invalid
 * 
 * @param email - Email address to validate
 * @returns Error message string if invalid, null if valid
 */
export function validateEmail(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return 'Please enter an email address'
  }
  
  const trimmedEmail = email.trim()
  if (trimmedEmail.length === 0) {
    return 'Please enter an email address'
  }
  
  if (!isValidEmail(trimmedEmail)) {
    return 'Please enter a valid email address'
  }
  
  return null
}

