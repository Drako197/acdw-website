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
    
    // Prepare form data for Netlify
    const form = e.target as HTMLFormElement
    const netlifyData = new FormData(form)
    netlifyData.append('form-name', 'email-preferences')
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyData as any).toString()
      })
      
      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnsubscribeAll = () => {
    navigate(`/unsubscribe?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="email-preferences-page">
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <EnvelopeIcon className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="heading-1 mb-4">Email Preferences</h1>
            <p className="text-large text-gray-600">
              Manage what emails you receive from AC Drain Wiz
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form 
              onSubmit={handleSubmit}
              name="email-preferences"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
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

              {/* Email Input */}
              <div className="mb-8">
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
                <p className="text-sm text-gray-500 mt-1">
                  Enter the email address you used to sign up
                </p>
              </div>

              {/* Preferences */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Preferences</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose which types of emails you'd like to receive from us
                </p>

                <div className="space-y-4">
                  {/* Product Updates */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="productUpdates"
                      checked={preferences.productUpdates}
                      onChange={() => handlePreferenceChange('productUpdates')}
                      className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Product Updates</div>
                      <div className="text-sm text-gray-600">New product launches and feature announcements</div>
                    </div>
                  </label>

                  {/* Promotions */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="promotions"
                      checked={preferences.promotions}
                      onChange={() => handlePreferenceChange('promotions')}
                      className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Promotions & Special Offers</div>
                      <div className="text-sm text-gray-600">Exclusive discounts and promotional campaigns</div>
                    </div>
                  </label>

                  {/* Newsletter */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={preferences.newsletter}
                      onChange={() => handlePreferenceChange('newsletter')}
                      className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Newsletter</div>
                      <div className="text-sm text-gray-600">Maintenance tips, industry news, and expert advice</div>
                    </div>
                  </label>

                  {/* Order Updates */}
                  <label className="flex items-start p-4 border border-primary-200 bg-primary-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="orderUpdates"
                      checked={preferences.orderUpdates}
                      onChange={() => handlePreferenceChange('orderUpdates')}
                      disabled
                      className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded opacity-50"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Order Updates</div>
                      <div className="text-sm text-gray-600">Order confirmations, shipping updates, and receipts (required)</div>
                    </div>
                  </label>

                  {/* Support Emails */}
                  <label className="flex items-start p-4 border border-primary-200 bg-primary-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="supportEmails"
                      checked={preferences.supportEmails}
                      onChange={() => handlePreferenceChange('supportEmails')}
                      disabled
                      className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded opacity-50"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Support Communications</div>
                      <div className="text-sm text-gray-600">Responses to your support requests and account updates (required)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                  <div className="flex">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Your preferences have been updated successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Preferences'}
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribeAll}
                  className="flex-1 btn-secondary"
                >
                  Unsubscribe from All
                </button>
              </div>
            </form>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Your privacy is important to us. View our{' '}
              <button onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-700 underline">
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

