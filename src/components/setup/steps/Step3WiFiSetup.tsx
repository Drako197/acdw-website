export function Step3WiFiSetup() {
  const steps = [
    {
      number: 1,
      title: 'Connect to Sensor Wi-Fi',
      description: 'On your phone or tablet, go to Wi-Fi settings and connect to the network named "ACDW Sensor (ID)". Once connected, you\'ll be redirected automatically.',
      image: '/images/setup/step3-1-wifi-settings.png',
      alt: 'Phone Wi-Fi settings showing ACDW Sensor network'
    },
    {
      number: 2,
      title: 'Select Home Wi-Fi Network',
      description: 'You\'ll see a setup page with available Wi-Fi networks. Select the homeowner\'s Wi-Fi network and enter the password.',
      image: '/images/setup/step3-2-network-selection.png',
      alt: 'Captive portal showing Wi-Fi network selection'
    },
    {
      number: 3,
      title: 'Login to ACDW Monitor',
      description: 'After the sensor connects to Wi-Fi, you\'ll see a login screen. Enter your ACDW Monitor account email and password.',
      image: '/images/setup/step3-3-login.png',
      alt: 'ACDW Monitor login screen'
    },
    {
      number: 4,
      title: 'Register Your Device',
      description: 'Enter the device name, location, and assign it to a customer. Set your alert preferences (Email, SMS, Daily reports).',
      image: '/images/setup/step3-4-registration.png',
      alt: 'Device registration screen'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Step Number Badge */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">3</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Wi-Fi & Account Setup</h2>
        <p className="text-lg text-gray-600">
          Complete these steps on your phone or tablet
        </p>
      </div>

      {/* Step-by-Step Phone Screenshots */}
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-700">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 mb-4">{step.description}</p>
                
                {/* Phone Screenshot Image */}
                <div className="w-full max-w-md mx-auto md:mx-0">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-200"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>What happens automatically:</strong>
        </p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>The sensor will connect to the home Wi-Fi network</li>
          <li>It will automatically register to your contractor account</li>
          <li>You'll be able to manage it from your dashboard</li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Don't have an account?</strong>{' '}
          <a
            href="https://monitor.acdrainwiz.com/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            Sign up at monitor.acdrainwiz.com
          </a>
        </p>
      </div>
    </div>
  )
}

