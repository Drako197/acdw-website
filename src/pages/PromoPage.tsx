import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export function PromoPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    // Prepare form data for Netlify
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    // Build submission data object
    const submissionData: Record<string, string> = {
      'form-name': 'promo-signup',
      firstName: firstName,
      lastName: lastName,
      email: email,
      consent: formData.get('consent') ? 'yes' : 'no'
    }
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'
    
    try {
      let response: Response
      
      if (isDevelopment) {
        // In development, simulate a successful submission
        console.log('📝 [DEV MODE] Promo signup simulated:', {
          email,
          firstName,
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
        setIsSubmitted(true)
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="promo-page-container">
        <div className="promo-success-container">
          <div className="promo-success-content">
            <div className="promo-success-icon">
              <CheckIcon className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="promo-success-title">Check Your Email{firstName ? `, ${firstName}` : ''}!</h1>
            <p className="promo-success-message">
              We've sent your discount code to <strong>{email}</strong>
            </p>
            <p className="promo-success-subtitle">
              Check your inbox to see if you received 10% off or won the 50% off code! 
              Use your code at checkout to save on your AC Drain Wiz Mini purchase.
            </p>
            <div className="promo-success-actions">
              <button 
                onClick={() => navigate('/products?product=mini')}
                className="promo-success-cta"
              >
                Shop Now
                <ArrowRightIcon className="promo-success-cta-icon" />
              </button>
              <button 
                onClick={() => navigate('/')}
                className="promo-success-link"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="promo-page-container">
      {/* Hero Section */}
      <div className="promo-hero-section">
        <div className="promo-hero-content">
          <div className="promo-badge">Limited Time Offer</div>
          <h1 className="promo-hero-title">
            Get Up To 50% Off Your ACDW Mini Purchase
          </h1>
          <p className="promo-hero-subtitle">
            Register for our email list and receive a discount code for your AC Drain Wiz Mini purchase. Every subscriber gets 10% off their ACDW Mini, 
            and 1 in 10 randomly selected subscribers will receive a 50% off code for their ACDW Mini. 
            Plus, get expert maintenance tips, product updates, and special offers delivered to your inbox.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="promo-main-content">
        <div className="promo-content-wrapper">
          {/* Email Registration Card */}
          <div className="promo-registration-card">
            <div className="promo-registration-header">
              <EnvelopeIcon className="promo-registration-icon" />
              <h2 className="promo-registration-title">Get Your ACDW Mini Discount Code</h2>
              <p className="promo-registration-subtitle">
                Register with your email to receive your discount code for the AC Drain Wiz Mini. You'll get 10% off your ACDW Mini guaranteed, 
                with a 1 in 10 chance to receive 50% off your ACDW Mini (randomly selected).
              </p>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="promo-registration-form"
              name="promo-signup"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              noValidate
            >
              {/* Hidden Fields for Netlify */}
              <input type="hidden" name="form-name" value="promo-signup" />
              <input type="hidden" name="form-type" value="promo" />
              
              {/* Honeypot field for spam protection */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>
              
              <div className="promo-form-group">
                <label htmlFor="promo-firstName" className="promo-form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="promo-firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="promo-form-input"
                  placeholder="John"
                  required
                />
              </div>

              <div className="promo-form-group">
                <label htmlFor="promo-lastName" className="promo-form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="promo-lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="promo-form-input"
                  placeholder="Smith"
                  required
                />
              </div>
              
              <div className="promo-form-group">
                <label htmlFor="promo-email" className="promo-form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="promo-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="promo-form-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="promo-form-group">
                <label className="promo-form-checkbox-label">
                  <input 
                    type="checkbox"
                    name="consent"
                    className="promo-form-checkbox"
                    required
                  />
                  <span>
                    I agree to the <button type="button" onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</button> and consent to receive marketing emails from AC Drain Wiz. You can <button type="button" onClick={() => navigate('/email-preferences')} className="text-primary-600 hover:text-primary-700 underline">unsubscribe</button> at any time.
                  </span>
                </label>
              </div>
              
              {/* Error Message */}
              {submitError && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="text-sm text-red-700">{submitError}</div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="promo-form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Get My Code (10% Off Guaranteed)'}
                <ArrowRightIcon className="promo-form-submit-icon" />
              </button>
            </form>
          </div>

          {/* Benefits Grid */}
          <div className="promo-benefits-grid">
            <div className="promo-benefit-card">
              <div className="promo-benefit-icon">
                <CheckIcon className="h-8 w-8" />
              </div>
              <h3 className="promo-benefit-title">10% Off ACDW Mini Guaranteed</h3>
              <p className="promo-benefit-description">
                Every email subscriber receives a 10% off discount code for their ACDW Mini purchase. Plus, 1 in 10 randomly selected subscribers will receive a 50% off code for their ACDW Mini.
              </p>
            </div>

            <div className="promo-benefit-card">
              <div className="promo-benefit-icon">
                <CheckIcon className="h-8 w-8" />
              </div>
              <h3 className="promo-benefit-title">Maintenance Tips</h3>
              <p className="promo-benefit-description">
                Receive expert advice on keeping your AC system running smoothly year-round.
              </p>
            </div>

            <div className="promo-benefit-card">
              <div className="promo-benefit-icon">
                <CheckIcon className="h-8 w-8" />
              </div>
              <h3 className="promo-benefit-title">Product Updates</h3>
              <p className="promo-benefit-description">
                Be the first to know about new products, features, and special offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Highlight */}
      <div className="promo-product-section">
        <div className="promo-product-content">
          <h2 className="promo-product-title">What You'll Get</h2>
          <div className="promo-product-grid">
            <div className="promo-product-card">
              <h3 className="promo-product-card-title">AC Drain Wiz Mini</h3>
              <p className="promo-product-card-price">$99.99</p>
              <p className="promo-product-card-description">
                Compact, DIY-friendly solution for proactive AC drain line maintenance. 
                Installs in 5 minutes or less and protects your home from costly water damage.
              </p>
              <ul className="promo-product-features">
                <li>✓ Installs in 5 minutes or less</li>
                <li>✓ Clear inspection window</li>
                <li>✓ Works with 3/4" PVC drain lines</li>
                <li>✓ Made in USA</li>
              </ul>
              <button 
                onClick={() => navigate('/products?product=mini')}
                className="promo-product-cta"
              >
                Learn More
                <ArrowRightIcon className="promo-product-cta-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

