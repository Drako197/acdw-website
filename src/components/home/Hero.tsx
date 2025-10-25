import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, ClockIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export function Hero() {
  const navigate = useNavigate()

  const products = [
    {
      id: 'mini',
      name: 'ACDW Mini',
      status: 'Coming Soon',
      statusColor: 'bg-blue-100 text-blue-800',
      description: 'Our flagship compact maintenance solution with versatile attachment system',
      keyBenefits: [
        '5" compact form factor',
        'Bayonet port system',
        'Bi-directional valve',
        'All service attachments'
      ],
      cta: 'Learn More',
      ctaAction: () => navigate('/products?product=mini'),
      featured: true
    },
    {
      id: 'sensor',
      name: 'ACDW Sensor',
      status: 'Coming Soon',
      statusColor: 'bg-purple-100 text-purple-800',
      description: 'Smart monitoring with Wi-Fi connectivity and proactive alerts',
      keyBenefits: [
        'No-contact sensing',
        'Wi-Fi connectivity',
        'SMS/Email alerts',
        'AC shutoff capability'
      ],
      cta: 'Learn More',
      ctaAction: () => navigate('/products?product=sensor'),
      featured: false
    },
    {
      id: 'core',
      name: 'AC Drain Wiz 1.0',
      status: 'Available Now',
      statusColor: 'bg-green-100 text-green-800',
      description: 'Proven foundation solution for reliable maintenance access',
      keyBenefits: [
        'Proven reliability',
        '30-minute installation',
        'Clear visual inspection',
        'IMC compliant'
      ],
      cta: 'Shop Now',
      ctaAction: () => navigate('/products?product=core'),
      featured: false
    }
  ]

  return (
    <>
      {/* Hero Section - Mini Focus */}
      <div className="hero-main-container">
        {/* Background Image for Mini */}
        <div className="hero-background-image">
          {/* Product image will be added as background */}
        </div>
        
        <div className="hero-content-wrapper">
          {/* Hero Header */}
          <div className="hero-header-section">
            <h1 className="hero-main-heading">
              Prevent Drain Line Clogs and{' '}
              <span className="hero-brand-highlight">Expensive Water Damage</span>
            </h1>
            
            <h2 className="hero-subtitle">
              Fast & Easy AC Drain Line Cleaning System
            </h2>
            
            <div className="hero-cta-buttons">
              <button 
                onClick={() => navigate('/products?product=mini')}
                className="hero-primary-button"
              >
                Buy Now
                <ArrowRightIcon className="hero-button-icon" />
              </button>
              
              <button 
                onClick={() => navigate('/products?product=mini&action=demo')}
                className="hero-secondary-button"
              >
                See How It Works
              </button>
            </div>
            
            <p className="hero-description-text">
              Keep your AC running smoothly with the<br />
              AC Drain Wiz™ Mini
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="trust-section-container">
        <div className="trust-section-content">
          <div className="trust-badge">
            <img 
              src="/images/100-seal-595x554.png" 
              alt="100% Customer Satisfaction Guaranteed" 
              className="trust-badge-image"
            />
          </div>
          
          <div className="trust-main-text">
            <h2 className="trust-title">Trusted By Homeowners & AC Contractors Nationwide</h2>
          </div>
          
          <div className="trust-badge">
            <img 
              src="/images/Made-in-USA-logo-transparent.png" 
              alt="Made in USA" 
              className="trust-badge-image"
            />
          </div>
        </div>
      </div>

      {/* Product Showcase Section */}
      <div className="product-showcase-container">
        <div className="product-showcase-header">
          <h2 className="product-showcase-title">Complete AC Maintenance Solutions</h2>
          <p className="product-showcase-subtitle">
            From smart monitoring to proven reliability, we have the perfect solution for your needs
          </p>
        </div>

        <div className="product-showcase-grid-three">
          {/* Sensor Card */}
          <div className="product-showcase-card product-showcase-card-sensor">
            <div className="product-showcase-card-background">
              {/* Sensor product image background */}
            </div>
            
            <div className="product-showcase-card-content">
              <div className="product-showcase-card-header">
                <h3 className="product-showcase-card-title">ACDW Sensor</h3>
                <span className="product-showcase-card-status">Coming Soon</span>
              </div>
              
              <h4 className="product-showcase-card-headline">Smart. Monitoring.</h4>
              
              <p className="product-showcase-card-description">
                Revolutionary no-contact sensing technology that prevents problems before they happen.
              </p>
              
              <div className="product-showcase-card-ctas">
                <button 
                  onClick={() => navigate('/products?product=sensor')}
                  className="product-showcase-card-cta-primary"
                >
                  Learn More
                </button>
                <button 
                  onClick={() => navigate('/products?product=sensor&action=buy')}
                  className="product-showcase-card-cta-secondary"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Core 1.0 Card */}
          <div className="product-showcase-card product-showcase-card-core">
            <div className="product-showcase-card-background">
              {/* Core 1.0 product image background */}
            </div>
            
            <div className="product-showcase-card-content">
              <div className="product-showcase-card-header">
                <h3 className="product-showcase-card-title">AC Drain Wiz 1.0</h3>
                <span className="product-showcase-card-status available">Available Now</span>
              </div>
              
              <h4 className="product-showcase-card-headline">Proven. Reliable.</h4>
              
              <p className="product-showcase-card-description">
                The foundation solution that started it all. Trusted by professionals nationwide.
              </p>
              
              <div className="product-showcase-card-ctas">
                <button 
                  onClick={() => navigate('/products?product=core')}
                  className="product-showcase-card-cta-primary"
                >
                  Learn More
                </button>
                <button 
                  onClick={() => navigate('/products?product=core&action=buy')}
                  className="product-showcase-card-cta-secondary"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

                  {/* Mini + Sensor Combined Card - Spans 2 columns */}
                  <div className="product-showcase-card product-showcase-card-mini">
                    <div className="product-showcase-card-background">
                      {/* HVAC tech with Mini and Sensor products */}
                    </div>
                    
                    <div className="product-showcase-card-content">
                      <div className="product-showcase-card-header">
                        <h3 className="product-showcase-card-title">Maximum Protection</h3>
                        <span className="product-showcase-card-status">Mini + Sensor</span>
                      </div>
                      
                      <h4 className="product-showcase-card-headline">Complete AC Protection</h4>
                      
                      <p className="product-showcase-card-description">
                        Combine the Mini's proactive cleaning with the Sensor's smart monitoring for maximum protection against water damage. HVAC professionals nationwide trust this powerful combination.
                      </p>
                      
                      <div className="product-showcase-card-ctas">
                        <button 
                          onClick={() => navigate('/products?product=mini&product=sensor')}
                          className="product-showcase-card-cta-primary"
                        >
                          Learn About the Bundle
                        </button>
                        <button 
                          onClick={() => navigate('/contact')}
                          className="product-showcase-card-cta-secondary"
                        >
                          Contact HVAC Pro
                        </button>
                      </div>
                    </div>
                  </div>
            </div>
          </div>

          {/* Why Choose AC Drain Wiz Section */}
      <div className="benefits-section-container">
        <div className="benefits-section-content">
          <h2 className="benefits-section-title">Why Choose AC Drain Wiz</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">IMC Code Compliant</h3>
              <p className="benefit-description">Professional-grade solution that meets International Mechanical Code standards for reliable, safe operation.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">Quick 30-Minute Installation</h3>
              <p className="benefit-description">Get up and running fast with our simple installation process that takes just 30 minutes to complete.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="benefit-title">Prevent Water Damage</h3>
              <p className="benefit-description">Protect your home from costly water damage by keeping your AC drain lines clean and clog-free year-round.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="benefit-title">Made in USA</h3>
              <p className="benefit-description">Quality you can trust with products manufactured right here in the United States using premium materials.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
