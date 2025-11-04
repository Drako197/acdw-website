import { CheckIcon, ClockIcon, WrenchScrewdriverIcon, SquaresPlusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProductsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const isContractor = isAuthenticated && user?.role === 'HVAC_PROFESSIONAL'

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
        msrp: '$79.99',
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

  return (
    <div className="products-page-container">
      <div className="products-page-content">
        {/* Header */}
        <div className="products-page-header">
          <h1 className="products-page-title">AC Drain Wiz Product Ecosystem</h1>
          <p className="products-page-subtitle">
            Professional-grade AC drain line maintenance solutions designed to make maintenance easier, 
            faster, and more profitable. From basic maintenance access to smart monitoring systems.
          </p>
        </div>

        {/* Products Grid */}
        <div className="products-page-grid">
          {products.map((product) => (
            <div key={product.id} className="products-card">
              {/* Product Header */}
              <div className="products-card-header">
                <div className="products-card-title-section">
                  <h3 className="products-card-title">{product.name}</h3>
                  <div className="products-card-badges">
                    <span className={`products-card-status ${product.statusColorClass}`}>
                      {product.statusText}
                    </span>
                    {product.contractorOnly && (
                      <span className="products-card-badge-contractor">
                        Contractor Only
                      </span>
                    )}
                  </div>
                </div>
                <p className="products-card-description">{product.description}</p>
              </div>

              {/* Key Benefits */}
              <div className="products-card-benefits">
                <h4 className="products-card-benefits-title">Key Benefits</h4>
                <ul className="products-card-benefits-list">
                  {product.keyBenefits.map((benefit, index) => (
                    <li key={index} className="products-card-benefit-item">
                      <CheckIcon className="products-card-benefit-icon" />
                      <span className="products-card-benefit-text">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="products-card-specs">
                <div className="products-card-specs-grid">
                  <div className="products-card-spec-item">
                    <WrenchScrewdriverIcon className="products-card-spec-icon" />
                    <span className="products-card-spec-text">
                      <strong>Compatibility:</strong> {product.compatibility}
                    </span>
                  </div>
                  <div className="products-card-spec-item">
                    <ClockIcon className="products-card-spec-icon" />
                    <span className="products-card-spec-text">
                      <strong>Installation:</strong> {product.installationTime}
                    </span>
                  </div>
                  {product.size && (
                    <div className="products-card-spec-item">
                      <WrenchScrewdriverIcon className="products-card-spec-icon" />
                      <span className="products-card-spec-text">
                        <strong>Size:</strong> {product.size}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="products-card-pricing">
                  <h5 className="products-card-pricing-title">Pricing</h5>
                  <div className="products-card-pricing-list">
                    <div className="products-card-pricing-item"><strong>MSRP:</strong> {product.pricing.msrp}</div>
                    {isContractor && (
                      <>
                        <div className="products-card-pricing-item"><strong>Contractor:</strong> {product.pricing.contractor}</div>
                        <div className="products-card-pricing-item"><strong>Distributor:</strong> {product.pricing.distributor}</div>
                      </>
                    )}
                    {!isContractor && product.contractorOnly && (
                      <div className="products-card-pricing-note">
                        Sign in for contractor pricing
                      </div>
                    )}
                  </div>
                </div>

                {/* Compliance */}
                <div className="products-card-compliance">
                  <h5 className="products-card-compliance-title">Compliance</h5>
                  <div className="products-card-compliance-badges">
                    {product.compliance.map((code, index) => (
                      <span key={index} className="products-card-compliance-badge">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="products-card-cta">
                {product.status === 'GA' ? (
                  <button 
                    onClick={() => handleProductCTA(product.id, product.contractorOnly || false)}
                    className="products-card-cta-button"
                  >
                    {product.contractorOnly && !isAuthenticated 
                      ? 'Sign In to Buy' 
                      : product.id === 'mini-sensor' && !isContractor
                      ? 'Sign In for Pricing'
                      : 'View Details & Pricing'
                    }
                  </button>
                ) : (
                  <button className="products-card-cta-button-disabled">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Product Evolution */}
        <div className="products-page-evolution">
          <h2 className="products-page-evolution-title">Product Evolution</h2>
          <div className="products-page-evolution-timeline">
            <div className="products-page-evolution-item">
              <div className="products-page-evolution-icon products-page-evolution-icon-core">
                <CheckIcon className="products-page-evolution-icon-svg" />
              </div>
              <h3 className="products-page-evolution-item-title">Core 1.0</h3>
              <p className="products-page-evolution-item-description">Heritage product</p>
              <span className="products-page-evolution-item-status products-page-evolution-item-status-deprecated">Deprecated</span>
            </div>
            <div className="products-page-evolution-divider"></div>
            <div className="products-page-evolution-item">
              <div className="products-page-evolution-icon products-page-evolution-icon-mini">
                <WrenchScrewdriverIcon className="products-page-evolution-icon-svg" />
              </div>
              <h3 className="products-page-evolution-item-title">Mini</h3>
              <p className="products-page-evolution-item-description">Flagship compact design</p>
              <span className="products-page-evolution-item-status">Available Now</span>
            </div>
            <div className="products-page-evolution-divider"></div>
            <div className="products-page-evolution-item">
              <div className="products-page-evolution-icon products-page-evolution-icon-sensor">
                <ClockIcon className="products-page-evolution-icon-svg" />
              </div>
              <h3 className="products-page-evolution-item-title">Sensor</h3>
              <p className="products-page-evolution-item-description">Smart monitoring</p>
              <span className="products-page-evolution-item-status">Available Now</span>
            </div>
            <div className="products-page-evolution-divider"></div>
            <div className="products-page-evolution-item">
              <div className="products-page-evolution-icon products-page-evolution-icon-combo">
                <SquaresPlusIcon className="products-page-evolution-icon-svg" />
              </div>
              <h3 className="products-page-evolution-item-title">Mini + Sensor</h3>
              <p className="products-page-evolution-item-description">Complete protection system</p>
              <span className="products-page-evolution-item-status">Available Now</span>
            </div>
          </div>
          <div className="products-page-evolution-footer">
            <p className="products-page-evolution-footer-text">
              Core 1.0 was our foundation product that pioneered AC drain line maintenance. 
              It's now deprecated in favor of the more compact and versatile Mini. 
              Existing Core 1.0 customers continue to receive full support.
            </p>
            <button 
              onClick={() => navigate('/contact?type=core-1.0-support')}
              className="products-page-evolution-footer-link"
            >
              Contact Support for Core 1.0 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
