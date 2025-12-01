/**
 * ACDW Mini Product Landing Page
 * 
 * Apple-inspired product showcase page with:
 * - Hero section with product imagery
 * - Feature highlights
 * - Image gallery
 * - Quantity selector (1-10)
 * - Stripe checkout integration
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { StripeCheckout } from '../components/checkout/StripeCheckout'
import {
  CheckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export function MiniProductPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Product images (placeholder paths - update with actual images)
  const productImages = [
    '/images/ACDW-Mini-Cap-blk.png', // Main product image
    '/images/acdw-mini-hero-background.png', // Alternative angle
    '/images/ACDW-Mini-Cap-blk.png', // Detail shot (placeholder)
  ]

  // Product features
  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: '5-Minute Installation',
      description: 'Tool-free setup that takes less time than a coffee break'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Prevents Water Damage',
      description: 'Proactive clog clearing before backups cause costly damage'
    },
    {
      icon: CheckIcon,
      title: 'Clear Visual Monitoring',
      description: 'See water flow and detect issues at a glance'
    },
    {
      icon: ClockIcon,
      title: 'Code Compliant',
      description: 'Meets IMC standards for maintenance access requirements'
    }
  ]

  // Key specifications
  const specifications = [
    { label: 'Dimensions', value: '5" × 3" × 2"' },
    { label: 'Connection Size', value: '3/4" PVC' },
    { label: 'Installation Time', value: '5 minutes or less' },
    { label: 'Material', value: 'UV-resistant clear PVC' },
    { label: 'Compatibility', value: 'Most residential AC systems' }
  ]

  // Compliance badges
  const complianceCodes = [
    'IMC 307.2.5',
    'IMC 307.2.2',
    'IMC 307.2.1.1'
  ]

  const price = 99.99
  const totalPrice = price * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
      setCheckoutError(null)
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="mini-product-page">
      {/* Back Navigation */}
      <div className="mini-product-back-nav">
        <button
          onClick={() => navigate('/products')}
          className="mini-product-back-button"
        >
          <ArrowLeftIcon className="mini-product-back-icon" />
          Back to Products
        </button>
      </div>

      {/* Hero Section */}
      <section className="mini-product-hero">
        <div className="mini-product-hero-content">
          <div className="mini-product-hero-text">
            <h1 className="mini-product-hero-title">
              AC Drain Wiz Mini
            </h1>
            <p className="mini-product-hero-subtitle">
              Prevent costly water damage with our flagship compact maintenance solution. 
              Proactive cleaning, clear visibility, and code-compliant access—all in one compact design.
            </p>
            <div className="mini-product-hero-price">
              <span className="mini-product-price-amount">${price.toFixed(2)}</span>
              <span className="mini-product-price-label">per unit</span>
            </div>
          </div>
          
          <div className="mini-product-hero-image-container">
            <div className="mini-product-hero-image-wrapper">
              <img
                src={productImages[selectedImageIndex]}
                alt="AC Drain Wiz Mini"
                className="mini-product-hero-image"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="mini-product-image-nav mini-product-image-nav-left"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="mini-product-image-nav-icon" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="mini-product-image-nav mini-product-image-nav-right"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="mini-product-image-nav-icon" />
                  </button>
                  <div className="mini-product-image-indicators">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`mini-product-image-indicator ${selectedImageIndex === index ? 'active' : ''}`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features Section */}
      <section className="mini-product-features">
        <div className="mini-product-features-content">
          <h2 className="mini-product-section-title">Why Choose AC Drain Wiz Mini</h2>
          <div className="mini-product-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="mini-product-feature-card">
                <feature.icon className="mini-product-feature-icon" />
                <h3 className="mini-product-feature-title">{feature.title}</h3>
                <p className="mini-product-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Section - Sticky on Scroll */}
      <section className="mini-product-purchase-section">
        <div className="mini-product-purchase-content">
          <div className="mini-product-purchase-card">
            <div className="mini-product-purchase-header">
              <h2 className="mini-product-purchase-title">Order AC Drain Wiz Mini</h2>
              <div className="mini-product-purchase-price">
                <span className="mini-product-purchase-price-amount">${price.toFixed(2)}</span>
                <span className="mini-product-purchase-price-label">per unit</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mini-product-quantity-section">
              <label className="mini-product-quantity-label">
                Quantity
              </label>
              <div className="mini-product-quantity-controls">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="mini-product-quantity-button"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    handleQuantityChange(Math.max(1, Math.min(10, val)))
                  }}
                  className="mini-product-quantity-input"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="mini-product-quantity-button"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="mini-product-quantity-help">
                Select 1-10 units for direct purchase
              </p>
            </div>

            {/* Total Price */}
            <div className="mini-product-total-section">
              <div className="mini-product-total-row">
                <span className="mini-product-total-label">Subtotal</span>
                <span className="mini-product-total-value">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="mini-product-total-row mini-product-total-row-final">
                <span className="mini-product-total-label">Total</span>
                <span className="mini-product-total-value">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mini-product-checkout-section">
              {!isAuthenticated ? (
                <div className="mini-product-checkout-auth-prompt">
                  <p className="mini-product-checkout-auth-text">
                    Sign in or create an account to purchase
                  </p>
                  <div className="mini-product-checkout-auth-buttons">
                    <button
                      onClick={() => navigate('/auth/signin?redirect=/products/mini')}
                      className="mini-product-checkout-auth-button"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/auth/signup?redirect=/products/mini')}
                      className="mini-product-checkout-auth-button mini-product-checkout-auth-button-secondary"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : user?.role === 'homeowner' ? (
                <>
                  {checkoutError && (
                    <div className="mini-product-checkout-error">
                      <p>{checkoutError}</p>
                    </div>
                  )}
                  <StripeCheckout
                    product="mini"
                    quantity={quantity}
                    onError={setCheckoutError}
                    buttonText="Buy Now"
                    className="mini-product-buy-button"
                  />
                </>
              ) : (
                <div className="mini-product-checkout-role-message">
                  <p>
                    {user?.role === 'hvac_pro' 
                      ? 'HVAC Pros: Visit your catalog for bulk pricing and additional products'
                      : 'Contact us for pricing and bulk ordering options'}
                  </p>
                  <button
                    onClick={() => {
                      if (user?.role === 'hvac_pro') {
                        navigate('/business/pro/catalog')
                      } else {
                        navigate('/contact?type=sales')
                      }
                    }}
                    className="mini-product-checkout-role-button"
                  >
                    {user?.role === 'hvac_pro' ? 'View Pro Catalog' : 'Contact Sales'}
                  </button>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mini-product-trust-section">
              <div className="mini-product-trust-item">
                <ShieldCheckIcon className="mini-product-trust-icon" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="mini-product-trust-item">
                <CheckIcon className="mini-product-trust-icon" />
                <span>Free Shipping on Orders Over $50</span>
              </div>
              <div className="mini-product-trust-item">
                <SparklesIcon className="mini-product-trust-icon" />
                <span>Made in USA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="mini-product-specs">
        <div className="mini-product-specs-content">
          <h2 className="mini-product-section-title">Specifications</h2>
          <div className="mini-product-specs-grid">
            {specifications.map((spec, index) => (
              <div key={index} className="mini-product-spec-item">
                <span className="mini-product-spec-label">{spec.label}</span>
                <span className="mini-product-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="mini-product-compliance">
        <div className="mini-product-compliance-content">
          <h2 className="mini-product-section-title">Code Compliant</h2>
          <p className="mini-product-compliance-description">
            AC Drain Wiz Mini meets International Mechanical Code (IMC) standards and is approved 
            for use in municipalities nationwide.
          </p>
          <div className="mini-product-compliance-badges">
            {complianceCodes.map((code, index) => (
              <div key={index} className="mini-product-compliance-badge">
                {code}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="mini-product-gallery">
        <div className="mini-product-gallery-content">
          <h2 className="mini-product-section-title">See It In Action</h2>
          <div className="mini-product-gallery-grid">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="mini-product-gallery-item"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`AC Drain Wiz Mini - View ${index + 1}`}
                  className="mini-product-gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

