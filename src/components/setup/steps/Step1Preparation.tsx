import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function Step1Preparation() {
  return (
    <div className="space-y-8">
      {/* Step Number Badge */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">1</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full">
        <img
          src="/images/setup/step1-hero.png"
          alt="ACDW Sensor and Mini together"
          className="w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '600px', objectFit: 'contain' }}
        />
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Preparation</h2>
        <p className="text-lg text-gray-600">
          Before you begin, make sure you have everything you need
        </p>
      </div>

      {/* Prerequisites Callout */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Prerequisites</h3>
            <div className="space-y-2 text-amber-800">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">ACDW Mini Installed</p>
                  <p className="text-sm">The sensor requires an ACDW Mini to be installed first.</p>
                  <a
                    href="/mini-setup"
                    className="text-sm text-amber-700 hover:text-amber-900 underline mt-1 inline-block"
                  >
                    View Mini Setup Guide →
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2 pt-2">
                <CheckCircleIcon className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">ACDW Sensor Admin Account</p>
                  <p className="text-sm">You need an active contractor account to register and manage sensors.</p>
                  <a
                    href="https://monitor.acdrainwiz.com/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-700 hover:text-amber-900 underline mt-1 inline-block"
                  >
                    Sign up at monitor.acdrainwiz.com →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Identification */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Identify Your Sensor Model</h3>
        <p className="text-gray-700 mb-6">
          Check your sensor box to identify which model you have. The setup process is the same for both.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Battery Model */}
          <div className="text-center">
            <div className="mb-4">
              <img
                src="/images/setup/model-battery.png"
                alt="Battery-Only Model"
                className="w-full h-auto rounded-lg shadow-md mx-auto"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Battery-Only Model</h4>
            <p className="text-sm text-gray-600">
              No connection cable included
            </p>
          </div>

          {/* DC Model */}
          <div className="text-center">
            <div className="mb-4">
              <img
                src="/images/setup/model-dc.png"
                alt="DC + Battery Model"
                className="w-full h-auto rounded-lg shadow-md mx-auto"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">DC + Battery Model</h4>
            <p className="text-sm text-gray-600">
              Includes connection cable
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Need */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📦</span>
          What You'll Need
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔋</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">ACDW Sensor</p>
              <p className="text-sm text-gray-600">Unboxed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔌</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Battery or DC Cable</p>
              <p className="text-sm text-gray-600">Depending on model</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Smartphone/Tablet</p>
              <p className="text-sm text-gray-600">For setup</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📶</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Wi-Fi Password</p>
              <p className="text-sm text-gray-600">Homeowner's network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

