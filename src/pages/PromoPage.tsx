import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export function PromoPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="promo-page-container">
        <div className="promo-success-container">
          <div className="promo-success-content">
            <div className="promo-success-icon">
              <CheckIcon className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="promo-success-title">Check Your Email!</h1>
            <p className="promo-success-message">
              We've sent your exclusive discount code to <strong>{email}</strong>
            </p>
            <p className="promo-success-subtitle">
              Use it at checkout to save on your AC Drain Wiz Mini purchase.
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
          <div className="promo-badge">Special Offer</div>
          <h1 className="promo-hero-title">
            Get Exclusive Savings on AC Drain Wiz Mini
          </h1>
          <p className="promo-hero-subtitle">
            Join our email list and receive a special discount code for homeowners. 
            Stay updated on maintenance tips, product updates, and exclusive offers.
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
              <h2 className="promo-registration-title">Claim Your Discount</h2>
              <p className="promo-registration-subtitle">
                Enter your email to receive your exclusive discount code
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="promo-registration-form">
              <div className="promo-form-group">
                <label htmlFor="promo-email" className="promo-form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="promo-email"
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
                    className="promo-form-checkbox"
                    required
                  />
                  <span>
                    I agree to receive marketing emails from AC Drain Wiz. 
                    You can unsubscribe at any time.
                  </span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="promo-form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Get My Discount Code'}
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
              <h3 className="promo-benefit-title">Exclusive Discount</h3>
              <p className="promo-benefit-description">
                Save on your AC Drain Wiz Mini purchase with a special code just for email subscribers.
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
              <p className="promo-product-card-price">$49.99</p>
              <p className="promo-product-card-description">
                Compact, DIY-friendly solution for proactive AC drain line maintenance. 
                Install in 30 minutes and protect your home from costly water damage.
              </p>
              <ul className="promo-product-features">
                <li>✓ 30-minute installation</li>
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

