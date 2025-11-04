import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function AboutPage() {
  const markets = [
    'Residential HVAC',
    'Condominiums/Apartments', 
    'Light Commercial (select installs)'
  ]

  const audiences = [
    'HVAC Contractors',
    'HVAC Distributors/Wholesalers',
    'City/Code Officials (AHJs)',
    'Homeowners (via contractors)'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-6">About AC Drain Wiz</h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Making AC maintenance easier, faster, and more profitable with innovative 
            one-time installed solutions that proactively keep condensate drain lines clear.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="heading-2 mb-6 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 mb-6">
              Make AC maintenance easier, faster, and more profitable with a one-time installed solution 
              that proactively keeps condensate drain lines clear.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easier</h3>
                <p className="text-sm text-gray-600">One-time installation eliminates repeated cutting and reconnection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Faster</h3>
                <p className="text-sm text-gray-600">35% faster cleanouts with streamlined maintenance process</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">More Profitable</h3>
                <p className="text-sm text-gray-600">Increased technician efficiency and upsell opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Markets & Audiences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="heading-2 mb-6">Primary Markets</h2>
            <ul className="space-y-3">
              {markets.map((market, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{market}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="heading-2 mb-6">Target Audiences</h2>
            <ul className="space-y-3">
              {audiences.map((audience, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leadership */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="heading-2 mb-8 text-center">Leadership</h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon className="h-12 w-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">Alan Riddle</h3>
                <p className="text-lg text-blue-600 mb-4">Founder & CEO</p>
                <p className="text-gray-600 mb-4">
                  Leading the development of innovative AC drain line maintenance solutions 
                  that revolutionize how HVAC professionals approach condensate line maintenance.
                </p>
                <div className="flex items-center space-x-4">
                  <a 
                    href="mailto:ariddle@acdrainwiz.com" 
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">ariddle@acdrainwiz.com</span>
                  </a>
                  <a 
                    href="tel:+15616545237" 
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">(561) 654-5237</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="heading-2 mb-6 text-center">Company Information</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                <p className="text-gray-600">AC Drain Wiz</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Catalog Version</h3>
                <p className="text-gray-600">2025-10-22</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Product Status</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">• Mini: Pre-launch (spec draft)</p>
                  <p className="text-gray-600">• Sensor: Pre-launch (spec draft)</p>
                  <p className="text-gray-500 italic">• Core 1.0: Deprecated (legacy product - full support for existing customers)</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compliance</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">• IMC 307.2.5</p>
                  <p className="text-gray-600">• IMC 307.2.2</p>
                  <p className="text-gray-600">• IMC 307.2.1.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
