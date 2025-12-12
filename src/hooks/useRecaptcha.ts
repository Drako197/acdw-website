import { useEffect } from 'react'

export const useRecaptcha = () => {
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
    const isConfigured = RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'RECAPTCHA_SITE_KEY'

    useEffect(() => {
        if (isConfigured && typeof window.grecaptcha === 'undefined') {
            const script = document.createElement('script')
            script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
            script.async = true
            script.defer = true
            document.head.appendChild(script)
        }
    }, [isConfigured, RECAPTCHA_SITE_KEY])

    const getRecaptchaToken = async (action: string): Promise<{ success: true; token: string } | { success: false; error: string }> => {
        if (!isConfigured) {
            return { success: false, error: 'reCAPTCHA is not configured' }
        }

        if (typeof window.grecaptcha === 'undefined') {
            return { success: false, error: 'reCAPTCHA failed to load. Please refresh and try again.' }
        }

        return new Promise((resolve) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(RECAPTCHA_SITE_KEY, { action })
                    .then((token: string) => {
                        resolve({ success: true, token })
                    })
                    .catch((error: unknown) => {
                        console.error('reCAPTCHA error:', error)
                        resolve({ success: false, error: 'Security verification failed. Please refresh and try again.' })
                    })
            })
        })
    }

    return {
        getRecaptchaToken,
        isConfigured
    }
}