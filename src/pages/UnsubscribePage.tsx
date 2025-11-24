import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function UnsubscribePage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from URL parameter if provided
  const searchParams = new URLSearchParams(location.search)
  const emailParam = searchParams.get('email') || ''
  
  const [email, setEmail] = useState(emailParam)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    // Build submission data object
    const submissionData: Record<string, string> = {
      'form-name': 'unsubscribe',
      email: email,
      reason: reason,
      feedback: feedback || ''
    }
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
    
    try {
      let response: Response
      
      if (isDevelopment) {
        // In development, simulate a successful submission
        console.log('📝 [DEV MODE] Unsubscribe request simulated:', {
          email,
          reason,
          data: submissionData
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
      } else {
        setSubmitError('Something went wrong. Please try again or email us at support@acdrainwiz.com')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="unsubscribe-container">
        <div className="unsubscribe-wrapper">
          <div className="unsubscribe-content">
            <div className="unsubscribe-success-card">
              <div className="unsubscribe-success-icon-wrapper">
                <CheckCircleIcon className="unsubscribe-success-icon" />
              </div>
              <h1 className="unsubscribe-success-title">You've Been Unsubscribed</h1>
              <p className="unsubscribe-success-message">
                You will no longer receive marketing emails from AC Drain Wiz.
              </p>
              <p className="unsubscribe-success-note">
                We're sorry to see you go! You'll still receive important emails about your orders and account.
              </p>
              
              <div className="unsubscribe-success-actions">
                <button
                  onClick={() => navigate('/email-preferences')}
                  className="unsubscribe-button unsubscribe-button-primary"
                >
                  Manage Email Preferences
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="unsubscribe-button unsubscribe-button-secondary"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="unsubscribe-container">
      <div className="unsubscribe-wrapper">
        <div className="unsubscribe-content">
          {/* Header Section */}
          <div className="unsubscribe-header">
            <div className="unsubscribe-icon-wrapper">
              <EnvelopeIcon className="unsubscribe-icon" />
            </div>
            <h1 className="unsubscribe-title">Unsubscribe from Our Emails</h1>
            <p className="unsubscribe-subtitle">
              We're sorry to see you go. Let us know why you're leaving.
            </p>
          </div>

          {/* Alternative Option Card */}
          <div className="unsubscribe-alternative-card">
            <h3 className="unsubscribe-alternative-title">
              Don't want to unsubscribe from everything?
            </h3>
            <p className="unsubscribe-alternative-description">
              You can manage your email preferences and choose which types of emails you want to receive.
            </p>
            <button
              onClick={() => navigate('/email-preferences')}
              className="unsubscribe-button unsubscribe-button-secondary"
            >
              Manage Preferences Instead
            </button>
          </div>

          {/* Unsubscribe Form */}
          <div className="unsubscribe-form-container">
            <form 
              onSubmit={handleSubmit}
              name="unsubscribe"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              noValidate
            >
              {/* Hidden Fields for Netlify */}
              <input type="hidden" name="form-name" value="unsubscribe" />
              <input type="hidden" name="form-type" value="unsubscribe" />
              
              {/* Honeypot field */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>

              {/* Email Input Field */}
              <div className="unsubscribe-email-field">
                <label htmlFor="unsubscribe-email" className="unsubscribe-email-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="unsubscribe-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="unsubscribe-email-input"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Unsubscribe Reason Field */}
              <div className="unsubscribe-reason-field">
                <label htmlFor="unsubscribe-reason" className="unsubscribe-reason-label">
                  Why are you unsubscribing? (Optional)
                </label>
                <select
                  id="unsubscribe-reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="unsubscribe-reason-select"
                >
                  <option value="">Select a reason</option>
                  <option value="too-many-emails">Too many emails</option>
                  <option value="not-relevant">Content not relevant</option>
                  <option value="never-signed-up">I never signed up</option>
                  <option value="spam">Emails look like spam</option>
                  <option value="privacy-concerns">Privacy concerns</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Feedback Field */}
              <div className="unsubscribe-feedback-field">
                <label htmlFor="unsubscribe-feedback" className="unsubscribe-feedback-label">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  id="unsubscribe-feedback"
                  name="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="unsubscribe-feedback-textarea"
                  placeholder="Help us improve by sharing your thoughts..."
                />
                <p className="unsubscribe-feedback-help">
                  Your feedback helps us serve our customers better
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="unsubscribe-message unsubscribe-message-error">
                  <XCircleIcon className="unsubscribe-message-icon" />
                  <p className="unsubscribe-message-text">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="unsubscribe-button unsubscribe-button-submit"
              >
                {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe from All Marketing Emails'}
              </button>

              <p className="unsubscribe-form-note">
                You'll still receive important emails about your orders and account
              </p>
            </form>
          </div>

          {/* Support Link */}
          <div className="unsubscribe-support">
            <p className="unsubscribe-support-text">
              Having trouble? <button onClick={() => navigate('/contact')} className="unsubscribe-support-link">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

