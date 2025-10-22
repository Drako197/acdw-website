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
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative container section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="heading-1 mb-6 text-white">
              Prevent Costly Water Damage with{' '}
              <span className="text-accent-400">AC Drain Wiz</span>
            </h1>
            
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Professional-grade AC drain line maintenance solutions that proactively clear clogs, 
              prevent water damage, and streamline HVAC service operations for professionals and homeowners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleGetStarted}
                className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 flex items-center justify-center"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              
              <button 
                onClick={() => navigate('/products')}
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-700"
              >
                View Products
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-primary-200">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">ICC Code Compliant</span>
              </div>
              <div className="flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Professional Grade</span>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-accent-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-primary-100">
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
