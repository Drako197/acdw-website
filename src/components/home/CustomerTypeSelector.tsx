import { useNavigate } from 'react-router-dom'

// Define types locally to avoid import issues
type CustomerType = 'homeowner' | 'hvac-professional' | 'city-official'

interface CustomerTypeConfig {
  type: CustomerType
  title: string
  description: string
  features: string[]
  cta: string
  pricing: 'retail' | 'pro' | 'contact'
}
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline'

const customerTypes: CustomerTypeConfig[] = [
  {
    type: 'homeowner',
    title: 'Homeowner',
    description: 'Protect your home from costly water damage with easy-to-install AC drain solutions.',
    features: [
      'Easy DIY installation',
      'Prevents water damage',
      'Clear visual monitoring',
      '30-minute setup',
      'Retail pricing available'
    ],
    cta: 'Shop Products',
    pricing: 'retail'
  },
  {
    type: 'hvac-professional',
    title: 'HVAC Professional',
    description: 'Streamline your service calls and increase efficiency with professional-grade tools and bulk pricing.',
    features: [
      'Bulk ordering available',
      'Professional pricing',
      'Installation guides',
      'Technical support',
      'ICC code compliance docs'
    ],
    cta: 'Access Pro Portal',
    pricing: 'pro'
  },
  {
    type: 'city-official',
    title: 'City & Code Official',
    description: 'Manage municipal AC systems with centralized monitoring and compliance solutions.',
    features: [
      'Centralized monitoring',
      'Compliance reporting',
      'Bulk system management',
      'Custom solutions',
      'Demo scheduling'
    ],
    cta: 'Request Demo',
    pricing: 'contact'
  }
]

const icons = {
  homeowner: HomeIcon,
  'hvac-professional': WrenchScrewdriverIcon,
  'city-official': BuildingOfficeIcon
}

export function CustomerTypeSelector() {
  const navigate = useNavigate()

  const handleSelect = (type: CustomerType) => {
    // Store selection in localStorage for session persistence
    localStorage.setItem('customerType', type)
    
    // Navigate based on customer type
    switch (type) {
      case 'homeowner':
        navigate('/products?type=homeowner')
        break
      case 'hvac-professional':
        navigate('/auth/signin', { state: { from: { pathname: '/products', search: '?type=hvac-professional' } } })
        break
      case 'city-official':
        navigate('/contact?type=demo-request')
        break
    }
  }

  return (
    <div className="customer-selector-main-container">
      <div className="customer-selector-content-wrapper">
        <div className="customer-selector-header">
          <h2 className="customer-selector-title">
            Choose Your Experience
          </h2>
          <p className="customer-selector-description">
            Get a personalized experience tailored to your specific needs. 
            Whether you're a homeowner, HVAC professional, or city official, 
            we have solutions designed for you.
          </p>
        </div>
        
        <div className="customer-selector-cards-grid">
          {customerTypes.map((config) => {
            const Icon = icons[config.type]
            
            return (
              <div
                key={config.type}
                className="customer-type-card"
                onClick={() => handleSelect(config.type)}
              >
                <div className="customer-type-card-header">
                  <div className={`customer-type-icon-wrapper ${
                    config.type === 'homeowner' ? 'customer-type-icon-homeowner' :
                    config.type === 'hvac-professional' ? 'customer-type-icon-hvac' :
                    'customer-type-icon-city'
                  }`}>
                    <Icon className="customer-type-icon" />
                  </div>
                  <h3 className="customer-type-title">{config.title}</h3>
                </div>
                
                <p className="customer-type-description">{config.description}</p>
                
                <ul className="customer-type-features-list">
                  {config.features.map((feature, index) => (
                    <li key={index} className="customer-type-feature-item">
                      <svg className="customer-type-feature-checkmark" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`customer-type-cta-button ${
                  config.pricing === 'retail' ? 'customer-type-cta-primary' :
                  config.pricing === 'pro' ? 'customer-type-cta-outline' :
                  'customer-type-cta-secondary'
                }`}>
                  {config.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
