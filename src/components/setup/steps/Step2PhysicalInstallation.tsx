export function Step2PhysicalInstallation() {
  const steps = [
    {
      number: 1,
      title: 'Remove Protective Cap',
      description: 'Remove the protective cap from the Mini\'s bayonet port. The cap should come off easily with a quarter-turn.',
      image: '/images/setup/step2-1-remove-cap.png',
      alt: 'Remove protective cap from Mini'
    },
    {
      number: 2,
      title: 'Power the Sensor',
      description: 'For battery models: Insert the battery and close the battery door. For DC models: Connect the DC cable to the sensor and power source, then insert the backup battery.',
      image: '/images/setup/step2-2-power.png',
      alt: 'Power the sensor'
    },
    {
      number: 3,
      title: 'Attach Sensor to Mini',
      description: 'Align the sensor with the Mini\'s bayonet port. Push in and turn 90° clockwise. You\'ll hear a click when it\'s locked.',
      image: '/images/setup/step2-3-attach.png',
      alt: 'Attach sensor to Mini bayonet port'
    },
    {
      number: 4,
      title: 'Verify LED Status',
      description: 'The LED should be blinking RED. This indicates the sensor is in pairing mode and ready for Wi-Fi setup.',
      image: '/images/setup/step2-4-led.png',
      alt: 'LED blinking red in pairing mode'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Step Number Badge */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">2</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Physical Installation</h2>
        <p className="text-lg text-gray-600">
          Follow these steps to physically install your sensor
        </p>
      </div>

      {/* Step-by-Step Images */}
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
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
                
                {/* Image */}
                <div className="w-full">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Once complete:</strong> The sensor LED should be blinking red. If it's not, check that the battery is inserted correctly or the DC power is connected.
        </p>
      </div>
    </div>
  )
}

