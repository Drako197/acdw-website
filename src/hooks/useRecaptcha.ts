import { useEffect } from 'react'

/**
 * Reusable hook for reCAPTCHA v3 integration
 * 
 * Loads reCAPTCHA script and provides token generation function
 */
export const useRecaptcha = () => {
  // Load reCAPTCHA script if site key is configured
  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    if (siteKey && siteKey !== 'RECAPTCHA_SITE_KEY' && typeof window.grecaptcha === 'undefined') {
      // Load reCAPTCHA script dynamically
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      console.log('reCAPTCHA script loaded')
    }
  }, [])

  // Get reCAPTCHA site key from environment or use placeholder
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'RECAPTCHA_SITE_KEY'

  /**
   * Get reCAPTCHA token for a specific action
   * @param action - Action name (e.g., 'contact', 'hero-email', 'promo')
   * @returns Promise<string | null> - Token or null if reCAPTCHA not configured/loaded
   */
  const getRecaptchaToken = async (action: string): Promise<string | null> => {
    return new Promise((resolve) => {
      // Check if reCAPTCHA is loaded
      if (typeof window.grecaptcha === 'undefined') {
        console.warn('reCAPTCHA not loaded - may be disabled or site key not configured')
        // If reCAPTCHA is not configured, allow submission (graceful degradation)
        resolve(null)
        return
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action })
          .then((token: string) => {
            resolve(token)
          })
          .catch((error: any) => {
            console.error('reCAPTCHA error:', error)
            // On error, allow submission (graceful degradation)
            resolve(null)
          })
      })
    })
  }

  return {
    getRecaptchaToken,
    isConfigured: RECAPTCHA_SITE_KEY !== 'RECAPTCHA_SITE_KEY'
  }
}

