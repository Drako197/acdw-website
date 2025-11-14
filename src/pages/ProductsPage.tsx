import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  CheckIcon, 
  ClockIcon, 
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon,
  HomeIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function ProductsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const isContractor = isAuthenticated && user?.role === 'HVAC_PROFESSIONAL'
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openProductTab, setOpenProductTab] = useState<{ [key: string]: string | null }>({
    mini: 'benefits', // Default first drawer open
    sensor: 'benefits', // Default first drawer open
    'mini-sensor': 'benefits' // Default first drawer open
  })

  const products = [
    {
      id: 'mini',
      name: 'ACDW Mini',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      description: 'Our flagship compact maintenance manifold (~5" length) with a single snap-to-lock bayonet port and a bi-directional valve.',
      keyBenefits: [
        'Flagship product with versatile attachment system',
        'One port for all services (flush, air, vacuum, sensor)',
        'Bi-directional valve supports outward flush or inward vacuum',
        'Clear body for fast visual checks',
        'Supports code-compliant maintenance access'
      ],
      compatibility: '3/4" PVC (most residential condensate lines)',
      installationTime: '30 minutes',
      size: '5" × 3" × 2"',
      pricing: {
        msrp: '$49.99',
        contractor: 'Sign in for pricing',
        distributor: 'Contact for pricing'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1'],
      contractorOnly: false
    },
    {
      id: 'sensor',
      name: 'ACDW Sensor',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      contractorOnly: true,
      description: 'First-of-its-kind, no-contact capacitive water-level sensor that snaps into the ACDW Mini\'s bayonet port.',
      keyBenefits: [
        'Smart monitoring with Wi-Fi connectivity',
        'No moving parts; no direct water contact',
        'Avoids biofilm-related failures common to float switches',
        'Wi-Fi alerts (SMS/email) with daily reporting',
        'Two models: Alert-only (battery) or Alert + AC shutoff (DC + battery)'
      ],
      compatibility: 'Integrates with ACDW Mini',
      installationTime: '15 minutes',
      size: '2" × 3" × 1.5"',
      pricing: {
        msrp: 'Pricing available on sign in',
        contractor: 'Sign in for pricing',
        distributor: 'Contact for pricing'
      },
      compliance: ['IMC 307.2.3']
    },
    {
      id: 'mini-sensor',
      name: 'Mini + Sensor',
      status: 'GA',
      statusText: 'Available Now',
      statusColorClass: 'products-card-status-available',
      contractorOnly: true,
      description: 'Complete protection system combining the Mini\'s proactive cleaning with the Sensor\'s smart monitoring for maximum protection against water damage.',
      keyBenefits: [
        'Maximum protection with proactive cleaning and smart monitoring',
        '24/7 smart alerts + manual access',
        'Complete solution for HVAC contractors',
        'Reduce callbacks and increase customer satisfaction',
        'Differentiate your services with premium maintenance packages'
      ],
      compatibility: '3/4" PVC + Mini integration',
      installationTime: '45 minutes total',
      size: '5" × 3" × 2" (Mini) + Sensor',
      pricing: {
        msrp: 'Pricing available on sign in',
        contractor: 'Sign in for pricing',
        distributor: 'Contact for pricing'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1', 'IMC 307.2.3']
    }
  ]

  const solutions = [
    {
      id: 'residential',
      title: 'Residential HVAC',
      description: 'Perfect for single-family homes, condominiums, and apartments with 3/4" condensate lines.',
      icon: HomeIcon,
      features: [
        'One-time installation eliminates repeated cutting',
        'Clear visual inspection of drain lines',
        '30-minute professional installation',
        'Prevents costly water damage',
        'Increases home value and peace of mind'
      ],
      benefits: [
        'Reduced maintenance costs',
        'Improved system efficiency',
        'Professional installation support',
        'IMC code compliance'
      ],
      pricing: 'Starting at $49.99 MSRP',
      status: 'Available Now'
    },
    {
      id: 'commercial',
      title: 'Light Commercial',
      description: 'Scalable solutions for select commercial installations including small offices and retail spaces.',
      icon: BuildingOfficeIcon,
      features: [
        'Scalable installation across multiple units',
        'Bulk pricing for commercial projects',
        'Professional contractor support',
        'Compliance documentation',
        'Custom installation planning'
      ],
      benefits: [
        'Reduced maintenance overhead',
        'Improved tenant satisfaction',
        'Professional project management',
        'Bulk purchasing discounts'
      ],
      pricing: 'Volume pricing available',
      status: 'Available Now'
    },
    {
      id: 'municipal',
      title: 'Municipal & Code Compliance',
      description: 'Comprehensive solutions for city officials and code compliance with proper documentation and approvals.',
      icon: ShieldCheckIcon,
      features: [
        'IMC code compliance (307.2.5, 307.2.2, 307.2.1.1)',
        'Approved disposal location references',
        'Maintenance access documentation',
        'Code official training materials',
        'Compliance reporting tools'
      ],
      benefits: [
        'Streamlined permit approval',
        'Reduced compliance issues',
        'Professional documentation',
        'Training and support programs'
      ],
      pricing: 'Contact for municipal pricing',
      status: 'Available Now'
    }
  ]

  const faqs = [
    {
      question: "What products does AC Drain Wiz offer?",
      answer: "We offer three main products: ACDW Mini (available to everyone), ACDW Sensor (contractor-only), and the Mini + Sensor complete protection system (contractor-only). Each product is designed for different needs and use cases."
    },
    {
      question: "Can homeowners purchase the Sensor?",
      answer: "The Sensor is available through authorized HVAC contractors only. If you're interested in Sensor installation, use our contractor finder to locate a certified installer in your area. Contractors can purchase Sensor directly or sign in for contractor pricing."
    },
    {
      question: "What's the difference between Mini and Sensor?",
      answer: "Mini is our flagship compact solution for proactive drain line cleaning—available for direct purchase by homeowners. Sensor adds smart monitoring and 24/7 alerts, but is available through authorized HVAC contractors only. See our product comparison above for details."
    },
    {
      question: "Do I need both Mini and Sensor, or can I use them separately?",
      answer: "Each product works independently, but they're designed to work together for maximum protection. Mini handles proactive cleaning; Sensor adds 24/7 monitoring. You can start with Mini and add Sensor later through an authorized contractor."
    },
    {
      question: "Will AC Drain Wiz work with my existing AC system?",
      answer: "AC Drain Wiz works with standard 3/4\" PVC drain lines used in most residential and light commercial systems. If your system uses a different size, contact us for guidance."
    },
    {
      question: "What kind of warranty do you offer?",
      answer: "All AC Drain Wiz products come with our satisfaction guarantee and industry-leading warranty. See our warranty section for full details."
    },
    {
      question: "Do you offer professional contractor pricing?",
      answer: "Yes! HVAC professionals and contractors qualify for special bulk pricing and support. Contractors can view retail pricing or sign in for contractor pricing. Sign in to view contractor pricing or contact us at (561) 654-5237."
    },
    {
      question: "Is AC Drain Wiz approved by building inspectors and code officials?",
      answer: "AC Drain Wiz meets International Mechanical Code (IMC) standards and is approved for use in municipalities nationwide. We provide compliance documentation for inspectors."
    }
  ]

  const handleProductCTA = (productId: string, isContractorOnly: boolean) => {
    if (isContractorOnly) {
      if (!isAuthenticated) {
        navigate('/auth/signin')
      } else {
        if (productId === 'mini-sensor') {
          navigate('/products?product=mini&product=sensor')
        } else {
          navigate(`/products?product=${productId}`)
        }
      }
    } else {
      navigate(`/products?product=${productId}`)
    }
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const toggleProductTab = (productId: string, tabName: string) => {
    setOpenProductTab(prev => ({
      ...prev,
      [productId]: prev[productId] === tabName ? null : tabName
    }))
  }

  return (
    <div className="unified-products-page">
      {/* Hero Section */}
      <div className="unified-products-hero">
        <div className="unified-products-hero-content">
          <h1 className="unified-products-hero-title">
            A smarter AC maintenance starts with AC Drain Wiz
          </h1>
          <p className="unified-products-hero-subtitle">
            Professional-grade solutions that prevent costly water damage and streamline HVAC service operations. 
            From basic maintenance access to smart monitoring systems.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="unified-products-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Our Products</h2>
            <p className="unified-section-subtitle">
              Everything you need to keep your AC drain lines clean and your systems running smoothly
            </p>
          </div>

          <div className="unified-products-stacked">
            {products.map((product, index) => (
              <div key={product.id} className={`unified-product-stacked-item ${index % 2 === 0 ? 'unified-product-stacked-left' : 'unified-product-stacked-right'}`}>
                {/* Product Shot Card */}
                <div className="unified-product-shot-card">
                  <div className="unified-product-shot-container">
                    <div className={`unified-product-shot-gradient unified-product-shot-gradient-${product.id === 'mini-sensor' ? 'minisensor' : product.id}`}>
                      {/* Gradient placeholder for product image */}
                    </div>
                  </div>
                </div>

                {/* Product Information Card */}
                <div className="unified-product-info-card">
                  <div className="unified-product-info-header">
                    <div className="unified-product-info-title-section">
                      <h3 className="unified-product-info-title">{product.name}</h3>
                      <div className="unified-product-info-badges">
                        <span className={`unified-product-info-status ${product.statusColorClass}`}>
                          {product.statusText}
                        </span>
                        {product.contractorOnly && (
                          <span className="unified-product-info-badge-contractor">
                            Contractor Only
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="unified-product-info-description">{product.description}</p>
                  </div>

                  {/* Drawers for Product Details */}
                  <div className="unified-product-tabs">
                    <button
                      onClick={() => toggleProductTab(product.id, 'benefits')}
                      className={`unified-product-drawer-button ${openProductTab[product.id] === 'benefits' ? 'unified-product-drawer-button-active' : ''}`}
                    >
                      <div className="unified-product-drawer-button-content">
                        <span>Key Benefits</span>
                        <span className="unified-product-drawer-badge hidden">5</span>
                      </div>
                    </button>
                    {openProductTab[product.id] === 'benefits' && (
                      <div className="unified-product-drawer-content">
                        <ul className="unified-product-tab-content-list">
                          {product.keyBenefits.map((benefit, index) => (
                            <li key={index} className="unified-product-tab-content-item">
                              <CheckIcon className="unified-product-tab-content-icon" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => toggleProductTab(product.id, 'specs')}
                      className={`unified-product-drawer-button ${openProductTab[product.id] === 'specs' ? 'unified-product-drawer-button-active' : ''}`}
                    >
                      <div className="unified-product-drawer-button-content">
                        <span>Specifications</span>
                        <span className="unified-product-drawer-badge hidden">3</span>
                      </div>
                    </button>
                    {openProductTab[product.id] === 'specs' && (
                      <div className="unified-product-drawer-content">
                        <div className="unified-product-tab-content-specs">
                          <div className="unified-product-tab-content-spec-item">
                            <WrenchScrewdriverIcon className="unified-product-tab-content-spec-icon" />
                            <span><strong>Compatibility:</strong> {product.compatibility}</span>
                          </div>
                          <div className="unified-product-tab-content-spec-item">
                            <ClockIcon className="unified-product-tab-content-spec-icon" />
                            <span><strong>Installation:</strong> {product.installationTime}</span>
                          </div>
                          {product.size && (
                            <div className="unified-product-tab-content-spec-item">
                              <WrenchScrewdriverIcon className="unified-product-tab-content-spec-icon" />
                              <span><strong>Size:</strong> {product.size}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => toggleProductTab(product.id, 'pricing')}
                      className={`unified-product-drawer-button ${openProductTab[product.id] === 'pricing' ? 'unified-product-drawer-button-active' : ''}`}
                    >
                      <div className="unified-product-drawer-button-content">
                        <span>Pricing</span>
                        <span className="unified-product-drawer-badge hidden">1</span>
                      </div>
                    </button>
                    {openProductTab[product.id] === 'pricing' && (
                      <div className="unified-product-drawer-content">
                        <div className="unified-product-tab-content-pricing">
                          <div className="unified-product-tab-content-pricing-item">
                            <strong>MSRP:</strong> {product.pricing.msrp}
                          </div>
                          {isContractor && (
                            <>
                              <div className="unified-product-tab-content-pricing-item">
                                <strong>Contractor:</strong> {product.pricing.contractor}
                              </div>
                              <div className="unified-product-tab-content-pricing-item">
                                <strong>Distributor:</strong> {product.pricing.distributor}
                              </div>
                            </>
                          )}
                          {!isContractor && product.contractorOnly && (
                            <div className="unified-product-tab-content-pricing-note">
                              Sign in for contractor pricing
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => toggleProductTab(product.id, 'compliance')}
                      className={`unified-product-drawer-button ${openProductTab[product.id] === 'compliance' ? 'unified-product-drawer-button-active' : ''}`}
                    >
                      <div className="unified-product-drawer-button-content">
                        <span>Compliance</span>
                        <span className="unified-product-drawer-badge hidden">{product.compliance.length}</span>
                      </div>
                    </button>
                    {openProductTab[product.id] === 'compliance' && (
                      <div className="unified-product-drawer-content">
                        <div className="unified-product-tab-content-compliance">
                          <div className="unified-product-tab-content-compliance-badges">
                            {product.compliance.map((code, index) => (
                              <span key={index} className="unified-product-tab-content-compliance-badge">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="unified-product-info-cta">
                    {product.status === 'GA' ? (
                      <button 
                        onClick={() => handleProductCTA(product.id, product.contractorOnly || false)}
                        className="unified-product-info-cta-button"
                      >
                        {product.contractorOnly && !isAuthenticated 
                          ? 'Sign In to Buy' 
                          : product.id === 'mini-sensor' && !isContractor
                          ? 'Sign In for Pricing'
                          : 'View Details & Pricing'
                        }
                        <ArrowRightIcon className="unified-product-info-cta-icon" />
                      </button>
                    ) : (
                      <button className="unified-product-info-cta-button-disabled">
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions by Use Case */}
      <div className="unified-solutions-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Solutions for Every Need</h2>
            <p className="unified-section-subtitle">
              From residential homes to commercial buildings and municipal systems
            </p>
          </div>

          <div className="unified-solutions-grid">
            {solutions.map((solution) => (
              <div key={solution.id} className="unified-solution-card">
                <div className="unified-solution-card-icon-wrapper">
                  <solution.icon className="unified-solution-card-icon" />
                </div>
                <h3 className="unified-solution-card-title">{solution.title}</h3>
                <p className="unified-solution-card-description">{solution.description}</p>
                
                <div className="unified-solution-card-features">
                  <h4 className="unified-solution-card-features-title">Key Features</h4>
                  <ul className="unified-solution-card-features-list">
                    {solution.features.map((feature, index) => (
                      <li key={index} className="unified-solution-card-feature-item">
                        <CheckIcon className="unified-solution-card-feature-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="unified-solution-card-benefits">
                  <h4 className="unified-solution-card-benefits-title">Benefits</h4>
                  <ul className="unified-solution-card-benefits-list">
                    {solution.benefits.map((benefit, index) => (
                      <li key={index} className="unified-solution-card-benefit-item">
                        <CheckIcon className="unified-solution-card-benefit-icon" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="unified-solution-card-footer">
                  <div className="unified-solution-card-pricing">
                    <strong>Pricing:</strong> {solution.pricing}
                  </div>
                  <button 
                    onClick={() => navigate(`/contact?type=${solution.id}`)}
                    className="unified-solution-card-cta"
                  >
                    Learn More
                    <ArrowRightIcon className="unified-solution-card-cta-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="unified-how-it-works-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Install Once, Clean Anytime</h2>
            <p className="unified-section-subtitle">
              Three simple steps to worry-free AC maintenance
            </p>
          </div>

          <div className="unified-how-it-works-steps">
            <div className="unified-how-it-works-step">
              <div className="unified-how-it-works-step-icon">
                <WrenchScrewdriverIcon className="unified-how-it-works-icon" />
              </div>
              <h3 className="unified-how-it-works-step-title">Install</h3>
              <p className="unified-how-it-works-step-description">
                Cut your existing drain line, solvent-weld AC Drain Wiz in place (about 30 minutes). 
                Works with 3/4" PVC drain lines.
              </p>
            </div>

            <div className="unified-how-it-works-step">
              <div className="unified-how-it-works-step-icon">
                <svg className="unified-how-it-works-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="unified-how-it-works-step-title">Clean</h3>
              <p className="unified-how-it-works-step-description">
                When it's time for maintenance, snap in your preferred attachment: air, water, or vacuum. 
                Bayonet mount ensures perfect seal every time.
              </p>
            </div>

            <div className="unified-how-it-works-step">
              <div className="unified-how-it-works-step-icon">
                <ShieldCheckIcon className="unified-how-it-works-icon" />
              </div>
              <h3 className="unified-how-it-works-step-title">Monitor</h3>
              <p className="unified-how-it-works-step-description">
                Add AC Drain Wiz Sensor for 24/7 monitoring and automated alerts. 
                Get SMS/email alerts before overflow happens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility & Technical Specs */}
      <div className="unified-compatibility-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Compatibility & Technical Specifications</h2>
            <p className="unified-section-subtitle">
              Works seamlessly with your existing systems
            </p>
          </div>

          <div className="unified-compatibility-grid">
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>Fits standard 3/4" PVC drain lines</span>
            </div>
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>Works with residential and commercial systems</span>
            </div>
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>Compatible with transfer pumps</span>
            </div>
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>Operating range: -40°F to 200°F</span>
            </div>
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>Pressure rated to 100 PSI</span>
            </div>
            <div className="unified-compatibility-item">
              <CheckIcon className="unified-compatibility-icon" />
              <span>No electrical connection required</span>
            </div>
          </div>

          <div className="unified-compatibility-footer">
            <p>
              Not sure if it works with your system?{' '}
              <button 
                onClick={() => navigate('/contact')}
                className="unified-compatibility-link"
              >
                See full specifications →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose AC Drain Wiz */}
      <div className="unified-why-choose-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Why Choose AC Drain Wiz</h2>
          </div>

          <div className="unified-why-choose-grid">
            <div className="unified-why-choose-card">
              <div className="unified-why-choose-icon">
                <ShieldCheckIcon className="unified-why-choose-icon-svg" />
              </div>
              <h3 className="unified-why-choose-title">IMC Code Compliant</h3>
              <p className="unified-why-choose-description">
                Professional-grade solution meeting International Mechanical Code standards for reliable, safe operation.
              </p>
            </div>

            <div className="unified-why-choose-card">
              <div className="unified-why-choose-icon">
                <ClockIcon className="unified-why-choose-icon-svg" />
              </div>
              <h3 className="unified-why-choose-title">Quick 30-Minute Installation</h3>
              <p className="unified-why-choose-description">
                Get up and running fast with our simple installation process that takes just 30 minutes to complete.
              </p>
            </div>

            <div className="unified-why-choose-card">
              <div className="unified-why-choose-icon">
                <HomeIcon className="unified-why-choose-icon-svg" />
              </div>
              <h3 className="unified-why-choose-title">Prevent Water Damage</h3>
              <p className="unified-why-choose-description">
                Protect your home from costly water damage by keeping your AC drain lines clean and clog-free year-round.
              </p>
            </div>

            <div className="unified-why-choose-card">
              <div className="unified-why-choose-icon">
                <WrenchScrewdriverIcon className="unified-why-choose-icon-svg" />
              </div>
              <h3 className="unified-why-choose-title">Made in USA</h3>
              <p className="unified-why-choose-description">
                Quality you can trust with products manufactured right here in the United States using premium materials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="unified-faq-section">
        <div className="unified-products-content">
          <div className="unified-section-header">
            <h2 className="unified-section-title">Frequently Asked Questions</h2>
            <p className="unified-section-subtitle">
              Get answers to the most common questions about AC Drain Wiz
            </p>
          </div>

          <div className="unified-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="unified-faq-item">
                <button
                  onClick={() => toggleFaq(index)}
                  className="unified-faq-question"
                >
                  <span className="unified-faq-question-text">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="unified-faq-chevron" />
                  ) : (
                    <ChevronDownIcon className="unified-faq-chevron" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="unified-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="unified-faq-footer">
            <p>
              Still have questions?{' '}
              <button 
                onClick={() => navigate('/contact')}
                className="unified-faq-link"
              >
                Contact Support →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
