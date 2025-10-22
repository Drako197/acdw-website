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
    <div className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-6">
            Choose Your Experience
          </h2>
          <p className="text-large max-w-3xl mx-auto">
            Get a personalized experience tailored to your specific needs. 
            Whether you're a homeowner, HVAC professional, or city official, 
            we have solutions designed for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {customerTypes.map((config) => {
            const Icon = icons[config.type]
            
            return (
              <div
                key={config.type}
                className="card cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary-300"
                onClick={() => handleSelect(config.type)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    config.type === 'homeowner' ? 'bg-blue-100 text-blue-600' :
                    config.type === 'hvac-professional' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="heading-3 ml-4">{config.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{config.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {config.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`btn w-full ${
                  config.pricing === 'retail' ? 'btn-primary' :
                  config.pricing === 'pro' ? 'btn-outline' :
                  'btn-secondary'
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
