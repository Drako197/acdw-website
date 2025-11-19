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
        response = await fetch('/', {
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
      <div className="unsubscribe-page">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="heading-1 mb-4">You've Been Unsubscribed</h1>
              <p className="text-large text-gray-600 mb-6">
                You will no longer receive marketing emails from AC Drain Wiz.
              </p>
              <p className="text-gray-600 mb-8">
                We're sorry to see you go! You'll still receive important emails about your orders and account.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/email-preferences')}
                  className="btn-primary w-full sm:w-auto"
                >
                  Manage Email Preferences
                </button>
                <br />
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary w-full sm:w-auto"
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
    <div className="unsubscribe-page">
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <EnvelopeIcon className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="heading-1 mb-4">Unsubscribe from Our Emails</h1>
            <p className="text-large text-gray-600">
              We're sorry to see you go. Let us know why you're leaving.
            </p>
          </div>

          {/* Alternative Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">
              Don't want to unsubscribe from everything?
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              You can manage your email preferences and choose which types of emails you want to receive.
            </p>
            <button
              onClick={() => navigate('/email-preferences')}
              className="btn-secondary"
            >
              Manage Preferences Instead
            </button>
          </div>

          {/* Unsubscribe Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
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

              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Reason */}
              <div className="mb-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you unsubscribing? (Optional)
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input"
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

              {/* Additional Feedback */}
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Help us improve by sharing your thoughts..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your feedback helps us serve our customers better
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe from All Marketing Emails'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You'll still receive important emails about your orders and account
              </p>
            </form>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Having trouble? <button onClick={() => navigate('/contact')} className="text-primary-600 hover:text-primary-700 underline">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

