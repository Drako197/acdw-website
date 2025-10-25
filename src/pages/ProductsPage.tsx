import { CheckIcon, ClockIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export function ProductsPage() {
  const products = [
    {
      id: 'mini',
      name: 'ACDW Mini',
      status: 'Pre-launch',
      statusText: 'Coming Soon',
      statusColor: 'bg-blue-100 text-blue-800',
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
      pricing: {
        msrp: 'TBD',
        contractor: 'TBD',
        distributor: 'TBD'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1']
    },
    {
      id: 'sensor',
      name: 'ACDW Sensor',
      status: 'Pre-launch',
      statusText: 'Coming Soon',
      statusColor: 'bg-purple-100 text-purple-800',
      description: 'First-of-its-kind, no-contact capacitive water-level sensor that snaps into the ACDW Mini\'s bayonet port.',
      keyBenefits: [
        'Smart monitoring with Wi-Fi connectivity',
        'No moving parts; no direct water contact',
        'Avoids biofilm-related failures common to float switches',
        'Wi-Fi alerts (SMS/email) with daily reporting',
        'Two models: Alert-only (battery) or Alert + AC shutoff (DC + battery)'
      ],
      compatibility: 'Integrates with ACDW Mini',
      installationTime: '30 minutes + sensor setup',
      pricing: {
        msrp: 'TBD',
        contractor: 'TBD',
        distributor: 'TBD'
      },
      compliance: ['IMC 307.2.3']
    },
    {
      id: 'core-1-0',
      name: 'AC Drain Wiz (Core 1.0)',
      status: 'GA',
      statusText: 'Available Now',
      statusColor: 'bg-green-100 text-green-800',
      description: 'Proven foundation solution - one-time installed drain line maintenance access/cleanout device that enables fast, repeatable service without cutting lines.',
      keyBenefits: [
        'Proven, reliable foundation solution',
        'One-time install; ongoing access without cutting',
        'Proactive, faster cleanouts; fewer emergency calls',
        'Clear visual inspection of water/flow',
        'Increases technician efficiency and daily job count'
      ],
      compatibility: '3/4 in (typical residential)',
      installationTime: '30 minutes',
      pricing: {
        msrp: '$59.99',
        contractor: 'From $35.75',
        distributor: 'From $22.34'
      },
      compliance: ['IMC 307.2.5', 'IMC 307.2.2', 'IMC 307.2.1.1']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-6">AC Drain Wiz Product Ecosystem</h1>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Professional-grade AC drain line maintenance solutions designed to make maintenance easier, 
            faster, and more profitable. From basic maintenance access to smart monitoring systems.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Product Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.statusColor}`}>
                    {product.statusText}
                  </span>
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Key Benefits */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {product.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      <strong>Compatibility:</strong> {product.compatibility}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      <strong>Installation:</strong> {product.installationTime}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Pricing</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>MSRP:</strong> {product.pricing.msrp}</div>
                    <div><strong>Contractor:</strong> {product.pricing.contractor}</div>
                    <div><strong>Distributor:</strong> {product.pricing.distributor}</div>
                  </div>
                </div>

                {/* Compliance */}
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Compliance</h5>
                  <div className="flex flex-wrap gap-1">
                    {product.compliance.map((code, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="p-6 border-t border-gray-200">
                {product.status === 'GA' ? (
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View Details & Pricing
                  </button>
                ) : (
                  <button className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Product Evolution */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="heading-2 mb-6 text-center">Product Evolution</h2>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Mini</h3>
              <p className="text-sm text-gray-600">Flagship compact design</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Sensor</h3>
              <p className="text-sm text-gray-600">Smart monitoring</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Core 1.0</h3>
              <p className="text-sm text-gray-600">Proven foundation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
