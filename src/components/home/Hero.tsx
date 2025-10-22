import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ShieldCheckIcon, WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline'

export function Hero() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/customer-selection')
  }

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Prevent Water Damage',
      description: 'Proactively clear clogs before they cause costly property damage'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Easy Installation',
      description: 'Tool-free setup in under 30 minutes for any skill level'
    },
    {
      icon: ClockIcon,
      title: 'Save Time & Money',
      description: 'Reduce service calls and increase HVAC technician efficiency'
    }
  ]

  return (
    <div className="hero-main-container">
      {/* Background Pattern */}
      <div 
        className="hero-background-pattern" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="hero-content-wrapper">
        <div className="hero-layout-grid">
          {/* Content */}
          <div className="hero-text-content">
            <h1 className="hero-main-heading">
              Prevent Costly Water Damage with{' '}
              <span className="hero-brand-highlight">AC Drain Wiz</span>
            </h1>
            
            <p className="hero-description-text">
              Professional-grade AC drain line maintenance solutions that proactively clear clogs, 
              prevent water damage, and streamline HVAC service operations for professionals and homeowners.
            </p>
            
            <div className="hero-cta-buttons">
              <button 
                onClick={handleGetStarted}
                className="hero-primary-button"
              >
                Get Started
                <ArrowRightIcon className="hero-button-icon" />
              </button>
              
              <button 
                onClick={() => navigate('/products')}
                className="hero-secondary-button"
              >
                View Products
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="hero-trust-indicators">
              <div className="hero-trust-item">
                <ShieldCheckIcon className="hero-trust-icon" />
                <span className="hero-trust-text">ICC Code Compliant</span>
              </div>
              <div className="hero-trust-item">
                <WrenchScrewdriverIcon className="hero-trust-icon" />
                <span className="hero-trust-text">Professional Grade</span>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="hero-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="hero-feature-card">
                <div className="hero-feature-content">
                  <div className="hero-feature-icon-wrapper">
                    <feature.icon className="hero-feature-icon" />
                  </div>
                  <div className="hero-feature-text">
                    <h3 className="hero-feature-title">
                      {feature.title}
                    </h3>
                    <p className="hero-feature-description">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
