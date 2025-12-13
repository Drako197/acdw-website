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
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">2</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Physical Installation</h2>
        <p className="sensor-setup-step-subtitle">
          Follow these steps to physically install your sensor
        </p>
      </div>

      {/* Step-by-Step Images */}
      <div className="sensor-setup-installation-steps">
        {steps.map((step) => (
          <div key={step.number} className="sensor-setup-installation-step-card">
            <div className="sensor-setup-installation-step-content">
              {/* Step Number */}
              <div className="sensor-setup-installation-step-number-wrapper">
                <div className="sensor-setup-installation-step-number-badge">
                  <span className="sensor-setup-installation-step-number">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-installation-step-details">
                <h3 className="sensor-setup-installation-step-title">{step.title}</h3>
                <p className="sensor-setup-installation-step-description">{step.description}</p>
                
                {/* Image */}
                <div className="sensor-setup-installation-step-image-wrapper">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="sensor-setup-installation-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Note */}
      <div className="sensor-setup-installation-note">
        <p className="sensor-setup-installation-note-text">
          <strong>Once complete:</strong> The sensor LED should be blinking red. If it's not, check that the battery is inserted correctly or the DC power is connected.
        </p>
      </div>
    </div>
  )
}
