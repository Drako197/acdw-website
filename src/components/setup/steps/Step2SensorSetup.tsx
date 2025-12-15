import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Step2SensorSetup() {
  const physicalSteps = [
    {
      number: 1,
      title: 'Unbox Sensor',
      description: 'Remove the sensor from its packaging. Check that all components are included.',
      image: '/images/setup/step2-1-unbox.png',
      alt: 'Unboxing the sensor'
    },
    {
      number: 2,
      title: 'Identify Your Sensor Model',
      description: 'Check your sensor to identify which model you have. Battery-only models have no cable. DC models have the cable attached to the sensor unit.',
      image: '/images/setup/step2-2-model-identification.png',
      alt: 'Sensor model comparison'
    },
    {
      number: 3,
      title: 'Power Up the Sensor',
      description: 'For battery models: Insert the battery and close the battery door. For DC models: Insert the backup battery. Once you have completed verification that the sensor is active and you have connected it to the local Wifi network, then connect the DC cable to the AC power source insert.',
      image: '/images/setup/step2-3-power.png',
      alt: 'Powering up the sensor'
    },
    {
      number: 4,
      title: 'Verify LED Status',
      description: 'The LED should be blinking RED. This indicates the sensor is in pairing mode and ready for Wi-Fi setup.',
      image: '/images/setup/step2-4-led.png',
      alt: 'LED blinking red in pairing mode'
    }
  ]

  const wifiSteps = [
    {
      number: 5,
      title: 'Connect to Sensor Wi-Fi',
      description: 'On your phone or tablet, go to Wi-Fi settings and connect to the network named "ACDW Sensor (ID)" or "Sensor (ID)". Once connected, you\'ll be redirected automatically.',
      image: '/images/setup/step2-5-wifi-settings.png',
      alt: 'Phone Wi-Fi settings showing ACDW Sensor network'
    },
    {
      number: 6,
      title: 'Select Home Wi-Fi Network',
      description: 'You\'ll see a setup page with available Wi-Fi networks. Select the homeowner\'s Wi-Fi network and enter the password.',
      image: '/images/setup/step2-6-network-selection.png',
      alt: 'Captive portal showing Wi-Fi network selection'
    },
    {
      number: 7,
      title: 'Login to ACDW Monitor',
      description: 'After the sensor connects to Wi-Fi, you\'ll see a login screen. Enter your ACDW Monitor account email and password.',
      image: '/images/setup/step2-7-login.png',
      alt: 'ACDW Monitor login screen'
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
        <h2 className="sensor-setup-step-title">Set up Sensor and Connect to WiFi</h2>
        <p className="sensor-setup-step-subtitle">
          Follow these steps to physically install and connect your sensor
        </p>
      </div>

      {/* Prerequisites Callout */}
      <div className="sensor-setup-prerequisites-callout">
        <div className="sensor-setup-prerequisites-callout-content">
          <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
          <div className="sensor-setup-prerequisites-callout-text">
            <h3 className="sensor-setup-prerequisites-callout-title">Prerequisite</h3>
            <p className="sensor-setup-prerequisites-callout-item-description">
              The ACDW Mini must already be installed before setting up the sensor. 
              <a
                href="/mini-setup"
                className="sensor-setup-prerequisites-callout-item-link"
              >
                View Mini Setup Guide →
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Physical Setup Section */}
      <div className="sensor-setup-section-divider">
        <h3 className="sensor-setup-section-divider-title">Physical Setup</h3>
      </div>

      <div className="sensor-setup-installation-steps">
        {physicalSteps.map((step) => (
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

      {/* Model Comparison (if step 2) */}
      <div className="sensor-setup-model-identification">
        <div className="sensor-setup-model-comparison">
          {/* Battery Model */}
          <div className="sensor-setup-model-card">
            <div className="sensor-setup-model-card-image-wrapper">
              <img
                src="/images/setup/model-battery.png"
                alt="Battery-Only Model"
                className="sensor-setup-model-card-image"
              />
            </div>
            <h4 className="sensor-setup-model-card-title">Battery-Only Model</h4>
            <p className="sensor-setup-model-card-description">
              No connection cable
            </p>
          </div>

          {/* DC Model */}
          <div className="sensor-setup-model-card">
            <div className="sensor-setup-model-card-image-wrapper">
              <img
                src="/images/setup/model-dc.png"
                alt="DC + Battery Model"
                className="sensor-setup-model-card-image"
              />
            </div>
            <h4 className="sensor-setup-model-card-title">DC + Battery Model</h4>
            <p className="sensor-setup-model-card-description">
              DC cable attached to sensor unit
            </p>
          </div>
        </div>
      </div>

      {/* WiFi Connection Section */}
      <div className="sensor-setup-section-divider">
        <h3 className="sensor-setup-section-divider-title">WiFi Connection</h3>
      </div>

      <div className="sensor-setup-wifi-steps">
        {wifiSteps.map((step) => (
          <div key={step.number} className="sensor-setup-wifi-step-card">
            <div className="sensor-setup-wifi-step-content">
              {/* Step Number */}
              <div className="sensor-setup-wifi-step-number-wrapper">
                <div className="sensor-setup-wifi-step-number-badge">
                  <span className="sensor-setup-wifi-step-number">{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-wifi-step-details">
                <h3 className="sensor-setup-wifi-step-title">{step.title}</h3>
                <p className="sensor-setup-wifi-step-description">{step.description}</p>
                
                {/* Phone Screenshot Image */}
                <div className="sensor-setup-wifi-step-image-wrapper">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="sensor-setup-wifi-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What You'll Need */}
      <div className="sensor-setup-what-you-need">
        <h3 className="sensor-setup-what-you-need-title">
          <span className="sensor-setup-what-you-need-icon">📦</span>
          What You'll Need
        </h3>
        <div className="sensor-setup-what-you-need-grid">
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">🔋</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">ACDW Sensor</p>
              <p className="sensor-setup-what-you-need-item-description">Unboxed</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">🔌</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Battery or DC Power</p>
              <p className="sensor-setup-what-you-need-item-description">DC cable attached for DC model</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">📱</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Smartphone/Tablet</p>
              <p className="sensor-setup-what-you-need-item-description">For setup</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <span className="sensor-setup-what-you-need-item-icon">📶</span>
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Wi-Fi Password</p>
              <p className="sensor-setup-what-you-need-item-description">Homeowner's network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

