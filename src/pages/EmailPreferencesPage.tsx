import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function EmailPreferencesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from URL parameter if provided
  const searchParams = new URLSearchParams(location.search)
  const emailParam = searchParams.get('email') || ''
  
  const [email, setEmail] = useState(emailParam)
  const [preferences, setPreferences] = useState({
    productUpdates: true,
    promotions: true,
    newsletter: true,
    orderUpdates: true,
    supportEmails: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    // Build submission data object
    const submissionData: Record<string, string> = {
      'form-name': 'email-preferences',
      email: email,
      productUpdates: preferences.productUpdates ? 'yes' : 'no',
      promotions: preferences.promotions ? 'yes' : 'no',
      newsletter: preferences.newsletter ? 'yes' : 'no',
      orderUpdates: preferences.orderUpdates ? 'yes' : 'no',
      supportEmails: preferences.supportEmails ? 'yes' : 'no'
    }
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
    
    try {
      let response: Response
      
      if (isDevelopment) {
        // In development, simulate a successful submission
        // SECURITY: Don't log full email - only log first 3 characters for debugging
        const emailPrefix = email ? email.substring(0, 3) + '***' : 'none'
        console.log('📝 [DEV MODE] Email preferences update simulated:', {
          email: emailPrefix, // Sanitized - only first 3 chars
          preferences,
          data: { ...submissionData, email: emailPrefix } // Sanitize in data too
        })
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Create a mock successful response
        response = new Response(null, { status: 200, statusText: 'OK' })
      } else {
        // In production, submit to Netlify
        // Ensure we're submitting to the correct endpoint
        const submitUrl = window.location.origin + '/'
        response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(submissionData).toString()
        })
      }
      
      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnsubscribeAll = () => {
    navigate(`/unsubscribe?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="email-preferences-container">
      <div className="email-preferences-wrapper">
        <div className="email-preferences-content">
          {/* Header Section */}
          <div className="email-preferences-header">
            <div className="email-preferences-icon-wrapper">
              <EnvelopeIcon className="email-preferences-icon" />
            </div>
            <h1 className="email-preferences-title">Email Preferences</h1>
            <p className="email-preferences-subtitle">
              Manage what emails you receive from AC Drain Wiz
            </p>
          </div>

          {/* Form Section */}
          <div className="email-preferences-form-container">
            <form 
              onSubmit={handleSubmit}
              name="email-preferences"
              data-netlify-honeypot="bot-field"
              noValidate
            >
              {/* Hidden Fields for Netlify */}
              <input type="hidden" name="form-name" value="email-preferences" />
              <input type="hidden" name="form-type" value="email-preferences" />
              
              {/* Honeypot field */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>

              {/* Email Input Field */}
              <div className="email-preferences-email-field">
                <label htmlFor="email-preferences-email" className="email-preferences-email-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email-preferences-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-preferences-email-input"
                  placeholder="your.email@example.com"
                />
                <p className="email-preferences-email-help">
                  Enter the email address you used to sign up
                </p>
              </div>

              {/* Preferences Selection Section */}
              <div className="email-preferences-selection-section">
                <h2 className="email-preferences-selection-title">Select Your Preferences</h2>
                <p className="email-preferences-selection-description">
                  Choose which types of emails you'd like to receive from us
                </p>

                <div className="email-preferences-options-list">
                  {/* Product Updates Option */}
                  <label className="email-preferences-option email-preferences-option-selectable">
                    <input
                      type="checkbox"
                      name="productUpdates"
                      checked={preferences.productUpdates}
                      onChange={() => handlePreferenceChange('productUpdates')}
                      className="email-preferences-option-checkbox"
                    />
                    <div className="email-preferences-option-content">
                      <div className="email-preferences-option-title">Product Updates</div>
                      <div className="email-preferences-option-description">New product launches and feature announcements</div>
                    </div>
                  </label>

                  {/* Promotions Option */}
                  <label className="email-preferences-option email-preferences-option-selectable">
                    <input
                      type="checkbox"
                      name="promotions"
                      checked={preferences.promotions}
                      onChange={() => handlePreferenceChange('promotions')}
                      className="email-preferences-option-checkbox"
                    />
                    <div className="email-preferences-option-content">
                      <div className="email-preferences-option-title">Promotions & Special Offers</div>
                      <div className="email-preferences-option-description">Exclusive discounts and promotional campaigns</div>
                    </div>
                  </label>

                  {/* Newsletter Option */}
                  <label className="email-preferences-option email-preferences-option-selectable">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={preferences.newsletter}
                      onChange={() => handlePreferenceChange('newsletter')}
                      className="email-preferences-option-checkbox"
                    />
                    <div className="email-preferences-option-content">
                      <div className="email-preferences-option-title">Newsletter</div>
                      <div className="email-preferences-option-description">Maintenance tips, industry news, and expert advice</div>
                    </div>
                  </label>

                  {/* Order Updates Option (Required) */}
                  <label className="email-preferences-option email-preferences-option-required">
                    <input
                      type="checkbox"
                      name="orderUpdates"
                      checked={preferences.orderUpdates}
                      onChange={() => handlePreferenceChange('orderUpdates')}
                      disabled
                      className="email-preferences-option-checkbox email-preferences-option-checkbox-disabled"
                    />
                    <div className="email-preferences-option-content">
                      <div className="email-preferences-option-title">Order Updates</div>
                      <div className="email-preferences-option-description">Order confirmations, shipping updates, and receipts (required)</div>
                    </div>
                  </label>

                  {/* Support Emails Option (Required) */}
                  <label className="email-preferences-option email-preferences-option-required">
                    <input
                      type="checkbox"
                      name="supportEmails"
                      checked={preferences.supportEmails}
                      onChange={() => handlePreferenceChange('supportEmails')}
                      disabled
                      className="email-preferences-option-checkbox email-preferences-option-checkbox-disabled"
                    />
                    <div className="email-preferences-option-content">
                      <div className="email-preferences-option-title">Support Communications</div>
                      <div className="email-preferences-option-description">Responses to your support requests and account updates (required)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="email-preferences-message email-preferences-message-success">
                  <CheckCircleIcon className="email-preferences-message-icon" />
                  <p className="email-preferences-message-text">
                    Your preferences have been updated successfully!
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="email-preferences-message email-preferences-message-error">
                  <XCircleIcon className="email-preferences-message-icon" />
                  <p className="email-preferences-message-text">{submitError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="email-preferences-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="email-preferences-button email-preferences-button-primary"
                >
                  {isSubmitting ? 'Saving...' : 'Save Preferences'}
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribeAll}
                  className="email-preferences-button email-preferences-button-secondary"
                >
                  Unsubscribe from All
                </button>
              </div>
            </form>
          </div>

          {/* Privacy Notice */}
          <div className="email-preferences-privacy">
            <p className="email-preferences-privacy-text">
              Your privacy is important to us. View our{' '}
              <button onClick={() => navigate('/privacy-policy')} className="email-preferences-privacy-link">
                Privacy Policy
              </button>
              {' '}to learn more about how we handle your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

