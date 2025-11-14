import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon, GiftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { VideoModal } from './VideoModal'
import { CustomerTypeSelector } from './CustomerTypeSelector'

export function Hero() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  
  // Check if user is a contractor
  const isContractor = isAuthenticated && user?.role === 'HVAC_PROFESSIONAL'

  // Handler for Sensor CTA - checks authentication before navigating
  const handleSensorCTA = () => {
    if (!isAuthenticated) {
      navigate('/auth/signin')
    } else {
      navigate('/products?product=sensor')
    }
  }
  
  // Refs for sections that should change background on scroll
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const productShowcaseRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const proofStackRef = useRef<HTMLDivElement>(null)
  const techSpecsRef = useRef<HTMLDivElement>(null)
  const riskReversalRef = useRef<HTMLDivElement>(null)
  const socialProofRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaBandsRef = useRef<HTMLDivElement>(null)
  const heritageRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll-based background changes
  // Similar to Google Home's approach: sections change background when prominently in viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Activate when section is in center 60% of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for smoother transitions
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Add active class when section is prominently in viewport (at least 25% visible in center)
        // This mimics Google Home's smooth background transitions
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          entry.target.classList.add('section-active')
        } else {
          entry.target.classList.remove('section-active')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = [
      howItWorksRef.current,
      productShowcaseRef.current,
      benefitsRef.current,
      comparisonRef.current,
      proofStackRef.current,
      techSpecsRef.current,
      riskReversalRef.current,
      socialProofRef.current,
      faqRef.current,
      ctaBandsRef.current,
      heritageRef.current
    ].filter(Boolean) as HTMLDivElement[]

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What causes AC drain line clogs?",
      answer: "The most common causes include algae growth, dirt and debris, mold buildup, and mineral deposits from hard water. AC Drain Wiz prevents these clogs through proactive cleaning before they become blockages."
    },
    {
      question: "Can I install AC Drain Wiz myself?",
      answer: "Yes! Most homeowners complete installation in about 30 minutes using basic tools. We provide step-by-step guides, installation videos, and free support if you get stuck."
    },
    {
      question: "Will AC Drain Wiz work with my existing AC system?",
      answer: "AC Drain Wiz works with standard 3/4\" PVC drain lines used in most residential and light commercial systems. If your system uses a different size, contact us for guidance."
    },
    {
      question: "What's the difference between Mini and Sensor?",
      answer: "Mini is our flagship compact solution for proactive drain line cleaning—available for direct purchase by homeowners. Sensor adds smart monitoring and 24/7 alerts, but is available through authorized HVAC contractors only. See our product comparison table above for details."
    },
    {
      question: "Can homeowners purchase the Sensor?",
      answer: "The Sensor is available through authorized HVAC contractors only. If you're interested in Sensor installation, use our contractor finder to locate a certified installer in your area. Contractors can purchase Sensor directly or sign in for contractor pricing."
    },
    {
      question: "Do I need both Mini and Sensor, or can I use them separately?",
      answer: "Each product works independently, but they're designed to work together for maximum protection. Mini handles proactive cleaning; Sensor adds 24/7 monitoring. You can start with Mini and add Sensor later through an authorized contractor."
    },
    {
      question: "How often do I need to clean my drain line with AC Drain Wiz?",
      answer: "We recommend checking your drain line every 3-6 months. If you have the Sensor, it will alert you when maintenance is needed. The Mini's bayonet port makes cleaning quick and mess-free."
    },
    {
      question: "What kind of warranty do you offer?",
      answer: "All AC Drain Wiz products come with our satisfaction guarantee and industry-leading warranty. See our warranty section above for full details."
    },
    {
      question: "Do you offer professional contractor pricing?",
      answer: "Yes! HVAC professionals and contractors qualify for special bulk pricing and support. Contractors can view retail pricing or sign in for contractor pricing. Sign in to view contractor pricing or contact us at (561) 654-5237."
    },
    {
      question: "Is AC Drain Wiz approved by building inspectors and code officials?",
      answer: "AC Drain Wiz meets International Mechanical Code (IMC) standards and is approved for use in municipalities nationwide. We provide compliance documentation for inspectors."
    },
    {
      question: "What happened to Core 1.0?",
      answer: "Core 1.0 was our foundation product that pioneered the AC drain line maintenance category. It's now deprecated in favor of the more compact and versatile Mini. Existing Core 1.0 customers continue to receive full support. Contact us if you need replacement parts or have questions about your Core 1.0 installation."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We offer a 60-day satisfaction guarantee with full refund, no questions asked. See our return policy section above for details."
    }
  ]

  return (
    <>
      {/* Promo Banner - Special offer for homeowners */}
      <div className="homeowner-banner">
        <div className="homeowner-banner-content">
          <span className="homeowner-banner-text">
            <strong>Special Offer:</strong> Get an exclusive discount when you join our email list
          </span>
          <button 
            onClick={() => navigate('/promo')}
            className="homeowner-banner-cta"
          >
            Claim Your Discount
            <ArrowRightIcon className="homeowner-banner-icon" />
          </button>
        </div>
      </div>

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
              Prevent AC Drain Line Clogs And{' '}
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
                onClick={() => setIsVideoModalOpen(true)}
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

      {/* Customer Type Selector */}
      <CustomerTypeSelector />

      {/* Product Showcase Section */}
      <div ref={productShowcaseRef} className="product-showcase-container">
        <div className="product-showcase-header">
          <h2 className="product-showcase-title">Code Mandated Float Switch Replacement</h2>
          <p className="product-showcase-subtitle">
            Smart monitoring and complete protection systems designed for HVAC professionals. Boost efficiency and deliver premium service to your customers.
          </p>
        </div>
      </div>

      {/* Sensor Card - Full Width, Contractor Only */}
      <div className="product-showcase-card product-showcase-card-sensor product-showcase-card-full-width">
        <div className="product-showcase-card-background">
          {/* Sensor product image background */}
        </div>
        
        <div className="product-showcase-card-content">
          <div className="product-showcase-card-header">
            <h3 className="product-showcase-card-title">ACDW Sensor</h3>
            <span className="product-showcase-card-status available">Contractor Only</span>
          </div>
          
          <h4 className="product-showcase-card-headline">Smart. Monitoring.</h4>
          
          <p className="product-showcase-card-description">
            Revolutionary no-contact sensing technology that prevents problems before they happen. Get 24/7 alerts before overflow starts. Available exclusively to HVAC contractors—help your customers protect their homes while growing your service offerings.
          </p>
          
          <div className="product-showcase-card-ctas">
            {isContractor ? (
              <>
                {/* Signed-in contractors see contractor pricing and can buy */}
                <button 
                  onClick={() => navigate('/products?product=sensor&action=buy')}
                  className="product-showcase-card-cta-primary"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => navigate('/products?product=sensor')}
                  className="product-showcase-card-cta-secondary"
                >
                  View Contractor Pricing
                </button>
              </>
            ) : (
              <>
                {/* Non-contractors (homeowners, unauthenticated contractors, etc.) */}
                {/* Sensor is contractor-only, so direct to contractor finder */}
                <button 
                  onClick={() => navigate('/find-contractor')}
                  className="product-showcase-card-cta-primary"
                >
                  Find a Contractor
                </button>
                <button 
                  onClick={() => navigate('/auth/signin')}
                  className="product-showcase-card-cta-secondary"
                >
                  Sign In for Contractor Pricing
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Separator Between Cards */}
      <div className="product-showcase-separator">
        <div className="product-showcase-separator-content">
          <h3 className="product-showcase-separator-title">Complete Protection System</h3>
          <p className="product-showcase-separator-subtitle">
            Combine both products for maximum customer satisfaction and increased service value
          </p>
        </div>
      </div>

      {/* Mini + Sensor Combined Card - Full Width */}
      <div className="product-showcase-card product-showcase-card-mini product-showcase-card-full-width">
        <div className="product-showcase-card-background">
          {/* HVAC tech with Mini and Sensor products */}
        </div>
        
        <div className="product-showcase-card-content">
          <div className="product-showcase-card-header">
            <h3 className="product-showcase-card-title">Maximum Protection</h3>
            <span className="product-showcase-card-status">Mini + Sensor</span>
          </div>
          
          <h4 className="product-showcase-card-headline">Complete AC Protection System</h4>
          
          <p className="product-showcase-card-description">
            Combine the Mini's proactive cleaning with the Sensor's smart monitoring for maximum protection. The ultimate solution for HVAC contractors looking to offer premium maintenance packages. Reduce callbacks, increase customer satisfaction, and differentiate your services.
          </p>
          
          <div className="product-showcase-card-ctas">
            {isContractor ? (
              <>
                {/* Signed-in contractors can buy bundle and see pricing */}
                <button 
                  onClick={() => navigate('/products?product=mini&product=sensor&action=buy')}
                  className="product-showcase-card-cta-primary"
                >
                  Buy Bundle
                </button>
                <button 
                  onClick={() => navigate('/products?product=mini&product=sensor')}
                  className="product-showcase-card-cta-secondary"
                >
                  View Contractor Pricing
                </button>
              </>
            ) : (
              <>
                {/* Non-contractors: bundle includes Sensor (contractor-only), so direct to contractor finder */}
                <button 
                  onClick={() => navigate('/find-contractor')}
                  className="product-showcase-card-cta-primary"
                >
                  Find a Contractor
                </button>
                <button 
                  onClick={() => navigate('/auth/signin')}
                  className="product-showcase-card-cta-secondary"
                >
                  Sign In for Contractor Pricing
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="how-it-works-container">
        <div className="how-it-works-content">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">Install Once, Clean Anytime</h2>
            <p className="how-it-works-subtitle">Three simple steps to worry-free AC maintenance</p>
          </div>
          
          <div className="how-it-works-steps">
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Install</h3>
              <p className="how-it-works-step-description">
                Cut your existing drain line, solvent-weld AC Drain Wiz in place (about 30 minutes). Works with 3/4" PVC drain lines.
              </p>
            </div>
            
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Clean</h3>
              <p className="how-it-works-step-description">
                When it's time for maintenance, snap in your preferred attachment: air, water, or vacuum. Bayonet mount ensures perfect seal every time.
              </p>
            </div>
            
            <div className="how-it-works-step">
              <div className="how-it-works-step-icon">
                <svg className="how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="how-it-works-step-title">Monitor</h3>
              <p className="how-it-works-step-description">
                Add AC Drain Wiz Sensor for 24/7 monitoring and automated alerts. Get SMS/email alerts before overflow happens.
              </p>
            </div>
          </div>
          
          <div className="how-it-works-ctas">
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="how-it-works-cta-primary"
            >
              Watch Installation Video
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="how-it-works-cta-secondary"
            >
              Download Guide
            </button>
          </div>
        </div>
      </div>

          {/* Why Choose AC Drain Wiz Section */}
      <div ref={benefitsRef} className="benefits-section-container">
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
              <p className="benefit-description">Professional-grade solution meeting International Mechanical Code standards for reliable, safe operation.</p>
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

      {/* Product Comparison Section */}
      <div ref={comparisonRef} className="product-comparison-container">
        <div className="product-comparison-content">
          <div className="product-comparison-header">
            <h2 className="product-comparison-title">Find Your Perfect AC Drain Solution</h2>
            <p className="product-comparison-subtitle">Compare features, prices, and use cases</p>
          </div>

          {/* Desktop Table */}
          <div className="product-comparison-table-wrapper hidden md:block">
            <table className="product-comparison-table">
              <thead>
                <tr>
                  <th className="product-comparison-th sticky left-0 z-10">Feature</th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Mini</div>
                      <div className="text-sm text-blue-600">Most Popular</div>
                    </div>
                  </th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Sensor</div>
                      <div className="text-sm text-orange-600 font-semibold">Contractor Only</div>
                    </div>
                  </th>
                  <th className="product-comparison-th">
                    <div className="product-comparison-product-header">
                      <div className="font-bold text-lg">Mini + Sensor</div>
                      <div className="text-sm text-purple-600 font-semibold">Complete System</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Status</td>
                  <td className="product-comparison-td"><span className="text-green-600 font-semibold">Available Now</span></td>
                  <td className="product-comparison-td">
                    <span className="text-green-600 font-semibold">Available Now</span>
                    <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Contractor Only</span>
                  </td>
                  <td className="product-comparison-td">
                    <span className="text-green-600 font-semibold">Available Now</span>
                    <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Contractor Only</span>
                  </td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Best For</td>
                  <td className="product-comparison-td">Space-constrained, all-in-one</td>
                  <td className="product-comparison-td">Early warning, existing setups</td>
                  <td className="product-comparison-td">Maximum protection & monitoring</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Size</td>
                  <td className="product-comparison-td">5" × 3" × 2"</td>
                  <td className="product-comparison-td">2" × 3" × 1.5"</td>
                  <td className="product-comparison-td">5" × 3" × 2" (Mini) + Sensor</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Installation</td>
                  <td className="product-comparison-td">30 min</td>
                  <td className="product-comparison-td">15 min</td>
                  <td className="product-comparison-td">45 min total</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Key Benefit</td>
                  <td className="product-comparison-td">Compact versatility</td>
                  <td className="product-comparison-td">Smart monitoring</td>
                  <td className="product-comparison-td">Complete protection system</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Price (MSRP)</td>
                  <td className="product-comparison-td font-bold text-lg">$49.99</td>
                  <td className="product-comparison-td text-sm text-gray-600 italic">Pricing available on sign in</td>
                  <td className="product-comparison-td text-sm text-gray-600 italic">Pricing available on sign in</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Monitoring</td>
                  <td className="product-comparison-td">Manual inspection</td>
                  <td className="product-comparison-td">24/7 smart alerts</td>
                  <td className="product-comparison-td">24/7 smart alerts + manual access</td>
                </tr>
                <tr>
                  <td className="product-comparison-td sticky left-0 bg-white">Compatibility</td>
                  <td className="product-comparison-td">3/4" PVC</td>
                  <td className="product-comparison-td">Bayonet mount accessory</td>
                  <td className="product-comparison-td">3/4" PVC + Mini integration</td>
                </tr>
                <tr className="product-comparison-action-row">
                  <td className="product-comparison-td sticky left-0 bg-white"></td>
                  <td className="product-comparison-td">
                    <button onClick={() => navigate('/products?product=mini')} className="product-comparison-btn-primary">
                      Buy Now
                    </button>
                  </td>
                  <td className="product-comparison-td">
                    <button onClick={handleSensorCTA} className="product-comparison-btn-primary">
                      Sign In to Buy
                    </button>
                  </td>
                  <td className="product-comparison-td">
                    {isContractor ? (
                      <button onClick={() => navigate('/products?product=mini&product=sensor')} className="product-comparison-btn-primary">
                        View Pricing
                      </button>
                    ) : (
                      <button onClick={() => navigate('/auth/signin')} className="product-comparison-btn-primary">
                        Sign In for Pricing
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="product-comparison-mobile md:hidden">
            {/* Mini Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mini</h3>
                  <span className="text-sm text-blue-600">Most Popular</span>
                </div>
                <button onClick={() => navigate('/products?product=mini')} className="product-comparison-btn-primary">
                  Buy Now
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="font-bold">$49.99</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>5" × 3" × 2"</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Space-constrained</span></div>
              </div>
            </div>

            {/* Sensor Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Sensor</h3>
                  <span className="text-sm text-orange-600 font-semibold">Contractor Only</span>
                </div>
                <button onClick={handleSensorCTA} className="product-comparison-btn-primary">
                  Sign In to Buy
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="text-gray-600 italic">Pricing available on sign in</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>2" × 3" × 1.5"</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Early warning</span></div>
              </div>
            </div>

            {/* Mini + Sensor Combo Card */}
            <div className="product-comparison-mobile-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Mini + Sensor</h3>
                  <span className="text-sm text-purple-600 font-semibold">Complete System</span>
                </div>
                {isContractor ? (
                  <button onClick={() => navigate('/products?product=mini&product=sensor')} className="product-comparison-btn-primary">
                    View Pricing
                  </button>
                ) : (
                  <button onClick={() => navigate('/auth/signin')} className="product-comparison-btn-primary">
                    Sign In for Pricing
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">Status:</span> <span className="text-green-600">Available Now</span></div>
                <div className="flex justify-between"><span className="font-medium">Price:</span> <span className="text-gray-600 italic text-xs">Pricing available on sign in</span></div>
                <div className="flex justify-between"><span className="font-medium">Size:</span> <span>5" × 3" × 2" + Sensor</span></div>
                <div className="flex justify-between"><span className="font-medium">Best For:</span> <span className="text-right">Maximum protection</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Stack Section - Testimonials, Case Study */}
      <div ref={proofStackRef} className="proof-stack-container">
        <div className="proof-stack-content">
          <div className="proof-stack-header">
            <h2 className="proof-stack-title">Trusted by the Pros, Designed for Everyone</h2>
          </div>

          {/* Testimonials Carousel */}
          <div className="proof-stack-testimonials">
            <h3 className="proof-stack-testimonials-title">What Our Customers Say</h3>
            <div className="proof-stack-testimonials-grid">
              {/* Testimonial 1 */}
              <div className="proof-stack-testimonial-card">
                <div className="proof-stack-testimonial-rating">★★★★★</div>
                <p className="proof-stack-testimonial-text">
                  "AC Drain Wiz prevented a major water leak in my attic. The sensor alerted me two days before I even noticed a problem. Worth every penny."
                </p>
                <div className="proof-stack-testimonial-author">
                  <div className="proof-stack-testimonial-avatar">SJ</div>
                  <div>
                    <div className="proof-stack-testimonial-name">Sarah Johnson</div>
                    <div className="proof-stack-testimonial-role">Homeowner</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="proof-stack-testimonial-card">
                <div className="proof-stack-testimonial-rating">★★★★★</div>
                <p className="proof-stack-testimonial-text">
                  "I've been using AC Drain Wiz in my HVAC business for a year now. My callbacks are down 80% and my customers love it. Best investment I've made."
                </p>
                <div className="proof-stack-testimonial-author">
                  <div className="proof-stack-testimonial-avatar">MS</div>
                  <div>
                    <div className="proof-stack-testimonial-name">Mike Stevens</div>
                    <div className="proof-stack-testimonial-role">HVAC Professional</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="proof-stack-testimonial-card">
                <div className="proof-stack-testimonial-rating">★★★★★</div>
                <p className="proof-stack-testimonial-text">
                  "The clear PVC housing makes it so easy to see what's happening in the drain line. Installation was quick and the visual confirmation is priceless."
                </p>
                <div className="proof-stack-testimonial-author">
                  <div className="proof-stack-testimonial-avatar">RP</div>
                  <div>
                    <div className="proof-stack-testimonial-name">Robert Phillips</div>
                    <div className="proof-stack-testimonial-role">Property Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study Teaser */}
          <div className="proof-stack-case-study">
            <div className="proof-stack-case-study-content">
              <div className="proof-stack-case-study-text">
                <h3 className="proof-stack-case-study-title">Real Results from Real Pros</h3>
                <p className="proof-stack-case-study-subtitle">See how one mid-size HVAC contractor transformed their business</p>
                <div className="proof-stack-case-study-stats">
                  <div className="proof-stack-stat">
                    <div className="proof-stack-stat-number">85%</div>
                    <div className="proof-stack-stat-label">Fewer Callbacks</div>
                  </div>
                  <div className="proof-stack-stat">
                    <div className="proof-stack-stat-number">10X</div>
                    <div className="proof-stack-stat-label">Faster Cleanouts</div>
                  </div>
                  <div className="proof-stack-stat">
                    <div className="proof-stack-stat-number">$12K</div>
                    <div className="proof-stack-stat-label">First Year Savings</div>
                  </div>
                </div>
                <button onClick={() => navigate('/contact?type=case-study')} className="proof-stack-case-study-cta">
                  Read Full Case Study →
                </button>
              </div>
              <div className="proof-stack-case-study-image">
                <div className="proof-stack-placeholder-image">
                  <svg className="proof-stack-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="proof-stack-placeholder-text">Case Study Image<br />Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Specs / Compatibility Strip */}
      <div ref={techSpecsRef} className="tech-specs-container">
        <div className="tech-specs-content">
          <div className="tech-specs-header">
            <h2 className="tech-specs-title">Compatibility & Technical Specifications</h2>
          </div>
          
          <div className="tech-specs-grid">
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Fits standard 3/4" PVC drain lines</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Works with residential and commercial systems</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Compatible with transfer pumps</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Operating range: -40°F to 200°F</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">Pressure rated to 100 PSI</span>
            </div>
            
            <div className="tech-spec-item">
              <svg className="tech-spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="tech-spec-text">No electrical connection required</span>
            </div>
          </div>
          
          <div className="tech-specs-footer">
            <p className="tech-specs-footer-text">
              Not sure if it works with your system? 
              <button onClick={() => navigate('/contact')} className="tech-specs-footer-link">
                See full specifications →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Risk-Reversal Section */}
      <div ref={riskReversalRef} className="risk-reversal-container">
        <div className="risk-reversal-content">
          <div className="risk-reversal-header">
            <h2 className="risk-reversal-title">We Stand Behind Every Product</h2>
          </div>

          <div className="risk-reversal-grid">
            {/* Warranty Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">100% Satisfaction Guaranteed</h3>
              <p className="risk-reversal-card-description">
                If you're not satisfied with your AC Drain Wiz within 60 days, we'll refund your full purchase price—no questions asked. Plus, all products come with our industry-leading warranty.
              </p>
              <button onClick={() => navigate('/products?tab=warranty')} className="risk-reversal-card-link">
                See full warranty terms →
              </button>
            </div>

            {/* Support Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">Expert Installation Support</h3>
              <p className="risk-reversal-card-description">
                Not a DIYer? We offer free installation guidance via phone, email, and live chat. Our team helps thousands of homeowners every year. Average response time: under 2 hours.
              </p>
              <button onClick={() => navigate('/contact?type=support')} className="risk-reversal-card-link">
                View support hours →
              </button>
            </div>

            {/* Returns Card */}
            <div className="risk-reversal-card">
              <div className="risk-reversal-card-icon">
                <svg className="risk-reversal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="risk-reversal-card-title">Hassle-Free Returns</h3>
              <p className="risk-reversal-card-description">
                Changed your mind? Return any unused product within 60 days for a full refund. We'll even cover return shipping within the continental US.
              </p>
              <button onClick={() => navigate('/products?tab=returns')} className="risk-reversal-card-link">
                View return policy →
              </button>
            </div>
          </div>

          <div className="risk-reversal-footer">
            <p className="risk-reversal-footer-text">
              Still have questions? Call us at <a href="tel:+15616545237" className="risk-reversal-footer-link">(561) 654-5237</a> or chat live with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof Section - Distributor Logos */}
      <div ref={socialProofRef} className="social-proof-container">
        <div className="social-proof-content">
          <div className="social-proof-header">
            <h2 className="social-proof-title">Trusted Partners & Press Coverage</h2>
          </div>

          <div className="social-proof-grid">
            {/* Distributor Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">Johnson Supply</p>
              </div>
            </div>

            {/* Distributor Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">Ferguson Enterprises</p>
              </div>
            </div>

            {/* Distributor Placeholder */}
            <div className="social-proof-logo">
              <div className="social-proof-placeholder-logo">
                <svg className="social-proof-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="social-proof-placeholder-text">M&A Supply Co.</p>
              </div>
            </div>
          </div>

          <div className="social-proof-footer">
            <p className="social-proof-footer-text">
              Featured in leading HVAC trade publications and recommended by inspectors nationwide.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div ref={faqRef} className="faq-container">
        <div className="faq-content">
          <div className="faq-header">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">Get answers to the most common questions about AC Drain Wiz</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  onClick={() => toggleFaq(index)}
                  className="faq-question"
                >
                  <span className="faq-question-text">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="faq-chevron" />
                  ) : (
                    <ChevronDownIcon className="faq-chevron" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-footer">
            <p className="faq-footer-text">
              Still have questions? 
              <button onClick={() => navigate('/contact')} className="faq-footer-link">
                Contact Support →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Secondary CTA Bands */}
      <div ref={ctaBandsRef} className="cta-bands-container">
        {/* Talk to Sales CTA - For Pros */}
        <div className="cta-band-sales">
          <div className="cta-band-content">
            <div className="cta-band-text">
              <h3 className="cta-band-title">Looking for Bulk Pricing or Professional Support?</h3>
              <p className="cta-band-description">
                Get custom pricing for your business, access technical resources, and join our contractor partner program. Schedule a 15-minute call with our team.
              </p>
            </div>
            <div className="cta-band-buttons">
              <button onClick={() => navigate('/contact?type=sales')} className="cta-band-btn-primary">
                Schedule Sales Call
              </button>
              <button onClick={() => navigate('/auth/signin')} className="cta-band-btn-secondary">
                View Contractor Portal
              </button>
            </div>
          </div>
        </div>

        {/* Find a Contractor CTA - For Homeowners */}
        <div className="cta-band-contractor">
          <div className="cta-band-content">
            <div className="cta-band-text">
              <h3 className="cta-band-title">Prefer Professional Installation?</h3>
              <p className="cta-band-description">
                We'll connect you with certified HVAC contractors in your area who are trained in AC Drain Wiz installation.
              </p>
            </div>
            <div className="cta-band-buttons">
              <button onClick={() => navigate('/contact?type=installer')} className="cta-band-btn-primary">
                Find an Installer Near Me
              </button>
              <button onClick={() => navigate('/products')} className="cta-band-btn-secondary">
                Learn About DIY Installation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Heritage Section - Core 1.0 Historical Reference */}
      <div ref={heritageRef} className="heritage-section-container">
        <div className="heritage-section-content">
          <div className="heritage-section-header">
            <h2 className="heritage-section-title">Where It Started</h2>
            <p className="heritage-section-subtitle">Our foundation that led to the Mini</p>
          </div>
          
          <div className="heritage-section-card">
            <div className="heritage-section-text">
              <div className="heritage-section-icon">
                <svg className="heritage-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heritage-section-card-title">AC Drain Wiz Core 1.0</h3>
              <p className="heritage-section-card-description">
                The proven foundation solution that started it all. Our Core 1.0 system pioneered the AC drain line maintenance category, establishing the clear PVC design and maintenance access principles that evolved into our flagship Mini. While Core 1.0 is now deprecated in favor of the more compact and versatile Mini, it remains a testament to our commitment to innovation and reliability.
              </p>
              
              {/* Exclusive Upgrade Offer */}
              <div className="heritage-upgrade-offer">
                <div className="heritage-upgrade-badge">
                  <GiftIcon className="heritage-upgrade-badge-icon" />
                  Exclusive Loyalty Offer
                </div>
                <h4 className="heritage-upgrade-title">Free Upgrade to AC Drain Wiz Mini</h4>
                <p className="heritage-upgrade-description">
                  Thank you for being an early adopter! As a Core 1.0 customer, you're eligible for a <strong>FREE upgrade to the new Mini</strong>. Simply share a photo of your installed Core 1.0 unit, and we'll ship you a brand new Mini at no cost—you just pay $10.99 shipping.
                </p>
                <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="heritage-upgrade-cta"
                >
                  Claim Your Free Upgrade
                </button>
              </div>
              
              <p className="heritage-section-card-note">
                <strong>Need support?</strong> Your Core 1.0 system continues to be fully supported. If you need replacement parts or have questions, please contact our support team.
              </p>
              <button 
                onClick={() => navigate('/contact?type=core-1.0-support')}
                className="heritage-section-cta-secondary"
              >
                Contact Support for Core 1.0
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
      
      {/* Core 1.0 Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="upgrade-modal-overlay" onClick={() => setIsUpgradeModalOpen(false)}>
          <div className="upgrade-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="upgrade-modal-close" onClick={() => setIsUpgradeModalOpen(false)}>
              ×
            </button>
            
            <div className="upgrade-modal-content">
              <div className="upgrade-modal-header">
                <h3 className="upgrade-modal-title">Free Upgrade to AC Drain Wiz Mini</h3>
                <p className="upgrade-modal-subtitle">
                  Complete the form below to claim your free upgrade. We'll review your submission and ship your new Mini within 2-3 business days.
                </p>
              </div>
              
              <form className="upgrade-modal-form" onSubmit={(e) => {
                e.preventDefault()
                // Form will be submitted via standard form action
                alert('Thank you! Your upgrade request has been submitted. We\'ll contact you within 24 hours.')
                setIsUpgradeModalOpen(false)
              }}>
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-name">Full Name *</label>
                  <input 
                    type="text" 
                    id="upgrade-name" 
                    name="name"
                    className="upgrade-form-input" 
                    required 
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-email">Email Address *</label>
                  <input 
                    type="email" 
                    id="upgrade-email" 
                    name="email"
                    className="upgrade-form-input" 
                    required 
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="upgrade-phone" 
                    name="phone"
                    className="upgrade-form-input" 
                    required 
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-photo">Photo of Installed Core 1.0 *</label>
                  <p className="upgrade-form-helper">
                    Please upload a clear photo showing your Core 1.0 unit installed on your AC drain line.
                  </p>
                  <input 
                    type="file" 
                    id="upgrade-photo" 
                    name="photo"
                    className="upgrade-form-file" 
                    accept="image/*"
                    required 
                  />
                </div>
                
                <div className="upgrade-form-group">
                  <label className="upgrade-form-label" htmlFor="upgrade-address">Shipping Address *</label>
                  <textarea 
                    id="upgrade-address" 
                    name="address"
                    className="upgrade-form-textarea" 
                    rows={3}
                    required 
                    placeholder="123 Main Street&#10;Apt 4B&#10;City, State 12345"
                  ></textarea>
                </div>
                
                <div className="upgrade-form-acknowledgment">
                  <label className="upgrade-form-checkbox-label">
                    <input 
                      type="checkbox" 
                      name="acknowledge"
                      className="upgrade-form-checkbox" 
                      required 
                    />
                    <span>I understand that I will be charged $10.99 for shipping and handling. My new Mini will ship within 2-3 business days of approval.</span>
                  </label>
                </div>
                
                <div className="upgrade-form-actions">
                  <button type="button" onClick={() => setIsUpgradeModalOpen(false)} className="upgrade-form-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="upgrade-form-submit">
                    Submit Upgrade Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
