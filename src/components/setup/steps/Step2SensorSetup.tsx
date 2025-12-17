import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { 
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Battery100Icon,
  BoltIcon,
  DevicePhoneMobileIcon,
  WifiIcon
} from '@heroicons/react/24/outline'

interface Step2SensorSetupProps {
  onWifiInteraction?: () => void
}

export interface Step2SensorSetupHandle {
  handleContinueClick: () => boolean // Returns true if handled, false if should proceed normally
}

export const Step2SensorSetup = forwardRef<Step2SensorSetupHandle, Step2SensorSetupProps>(
  ({ onWifiInteraction }, ref) => {
  const [expandedSection, setExpandedSection] = useState<'physical' | 'wifi' | null>(null)
  const [physicalHasBeenOpened, setPhysicalHasBeenOpened] = useState(false)
  const [wifiHasBeenOpened, setWifiHasBeenOpened] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const physicalAccordionContentRef = useRef<HTMLDivElement>(null)
  const wifiAccordionContentRef = useRef<HTMLDivElement>(null)

  // Expose handleContinueClick method to parent
  useImperativeHandle(ref, () => ({
    handleContinueClick: () => {
      // If Physical Setup is open, open WiFi and scroll to it
      if (expandedSection === 'physical') {
        setExpandedSection('wifi')
        setPhysicalHasBeenOpened(true)
        
        // Track WiFi interaction
        if (!wifiHasBeenOpened) {
          setWifiHasBeenOpened(true)
          if (onWifiInteraction) {
            onWifiInteraction()
          }
        }
        
        // Scroll to WiFi accordion content after a brief delay to allow DOM update
        setTimeout(() => {
          if (wifiAccordionContentRef.current) {
            wifiAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 150)
        
        return true // Handled, don't proceed to next step
      }
      return false // Not handled, proceed normally
    }
  }))

  const toggleSection = (section: 'physical' | 'wifi') => {
    // Prevent WiFi from opening if Physical hasn't been opened first
    if (section === 'wifi' && !physicalHasBeenOpened) {
      // Open Physical Setup accordion
      setExpandedSection('physical')
      setPhysicalHasBeenOpened(true)
      // Show notification message
      setShowNotification(true)
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      
      // Scroll to notification message instead of top
      setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    // Normal accordion behavior: clicking the same section toggles it
    // If clicking a different section, expand it (and collapse the current one)
    if (expandedSection === section) {
      // Toggle: if clicking the expanded section, collapse it
      setExpandedSection(null)
    } else {
      // Expand the clicked section (other will automatically collapse)
      setExpandedSection(section)
    }

    // Track when Physical section is opened for the first time
    if (section === 'physical' && !physicalHasBeenOpened) {
      setPhysicalHasBeenOpened(true)
    }

    // Track when WiFi section is opened for the first time
    if (section === 'wifi' && !wifiHasBeenOpened) {
      setWifiHasBeenOpened(true)
      if (onWifiInteraction) {
        onWifiInteraction()
      }
    }
  }

  // Also trigger when WiFi section becomes expanded (in case it's opened programmatically)
  useEffect(() => {
    if (expandedSection === 'wifi' && !wifiHasBeenOpened) {
      setWifiHasBeenOpened(true)
      if (onWifiInteraction) {
        onWifiInteraction()
      }
    }
  }, [expandedSection, wifiHasBeenOpened, onWifiInteraction])

  // Scroll to accordion content when it opens
  useEffect(() => {
    if (expandedSection === 'physical' && physicalAccordionContentRef.current) {
      // Small delay to allow DOM to update
      setTimeout(() => {
        if (physicalAccordionContentRef.current) {
          physicalAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    } else if (expandedSection === 'wifi' && wifiAccordionContentRef.current) {
      // Small delay to allow DOM to update
      setTimeout(() => {
        if (wifiAccordionContentRef.current) {
          wifiAccordionContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }
  }, [expandedSection])

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
      description: 'For battery models: Insert the battery and close the battery door. For DC models: Insert the backup battery, then connect the DC cable to the AC power source insert once you have completed the verification of the LED status and complete the wifi set up.',
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
        <div className="sensor-setup-step-badge sensor-setup-step-badge-step2">
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

      {/* What You'll Need */}
      <div className="sensor-setup-what-you-need">
        <h3 className="sensor-setup-what-you-need-title">What You'll Need</h3>
        <div className="sensor-setup-what-you-need-grid">
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <Battery100Icon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">ACDW Sensor</p>
              <p className="sensor-setup-what-you-need-item-description">Unboxed</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <BoltIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Battery or DC Power</p>
              <p className="sensor-setup-what-you-need-item-description">DC cable attached for DC model</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <DevicePhoneMobileIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Smartphone / Tablet</p>
              <p className="sensor-setup-what-you-need-item-description">For setup</p>
            </div>
          </div>
          <div className="sensor-setup-what-you-need-item">
            <div className="sensor-setup-what-you-need-item-icon-wrapper">
              <WifiIcon className="sensor-setup-what-you-need-item-icon" />
            </div>
            <div className="sensor-setup-what-you-need-item-content">
              <p className="sensor-setup-what-you-need-item-title">Wi-Fi Password</p>
              <p className="sensor-setup-what-you-need-item-description">Homeowner's network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      {showNotification && (
        <div ref={notificationRef} className="sensor-setup-notification">
          <div className="sensor-setup-notification-content">
            <ExclamationTriangleIcon className="sensor-setup-notification-icon" />
            <p className="sensor-setup-notification-message">
              Your sensor setup experience requires you to start with the physical setup first.
            </p>
          </div>
        </div>
      )}

      {/* Physical Setup Accordion Section */}
      <div className={`sensor-setup-accordion-section ${expandedSection === 'physical' ? 'sensor-setup-accordion-section-expanded' : 'sensor-setup-accordion-section-collapsed'} ${!physicalHasBeenOpened ? 'sensor-setup-accordion-section-pulsating' : ''}`}>
        <button
          onClick={() => toggleSection('physical')}
          className="sensor-setup-accordion-header"
        >
          <div className="sensor-setup-accordion-header-content">
            <div className="sensor-setup-accordion-header-left">
              <div className="sensor-setup-accordion-status-icon sensor-setup-accordion-status-icon-pending" />
              <h3 className="sensor-setup-accordion-title">Physical Setup</h3>
              {!physicalHasBeenOpened && (
                <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-next-step">Next Step</span>
              )}
            </div>
            <div className="sensor-setup-accordion-header-right">
              {expandedSection === 'physical' ? (
                <ChevronUpIcon className="sensor-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="sensor-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'physical' && (
          <div ref={physicalAccordionContentRef} className="sensor-setup-accordion-content">
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
                      
                      {/* Image - Skip for step 2 (model identification) */}
                      {step.number !== 2 && (
                        <div className="sensor-setup-installation-step-image-wrapper">
                          <img
                            src={step.image}
                            alt={step.alt}
                            className="sensor-setup-installation-step-image"
                          />
                        </div>
                      )}

                      {/* Model Comparison - Only for step 2 */}
                      {step.number === 2 && (
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedSection !== 'physical' && (
          <div className="sensor-setup-accordion-preview">
            <p className="sensor-setup-accordion-preview-text">
              {physicalSteps.length} steps to complete
            </p>
          </div>
        )}
      </div>

      {/* WiFi Connection Accordion Section */}
      <div className={`sensor-setup-accordion-section ${expandedSection === 'wifi' ? 'sensor-setup-accordion-section-expanded' : 'sensor-setup-accordion-section-collapsed'} ${physicalHasBeenOpened && !wifiHasBeenOpened ? 'sensor-setup-accordion-section-pulsating' : ''}`}>
        <button
          onClick={() => toggleSection('wifi')}
          className="sensor-setup-accordion-header"
        >
          <div className="sensor-setup-accordion-header-content">
            <div className="sensor-setup-accordion-header-left">
              <div className="sensor-setup-accordion-status-icon sensor-setup-accordion-status-icon-pending" />
              <h3 className="sensor-setup-accordion-title">WiFi Connection</h3>
              {physicalHasBeenOpened && !wifiHasBeenOpened && (
                <span className="sensor-setup-accordion-badge sensor-setup-accordion-badge-next-step">Next Step</span>
              )}
            </div>
            <div className="sensor-setup-accordion-header-right">
              {expandedSection === 'wifi' ? (
                <ChevronUpIcon className="sensor-setup-accordion-chevron" />
              ) : (
                <ChevronDownIcon className="sensor-setup-accordion-chevron" />
              )}
            </div>
          </div>
        </button>

        {expandedSection === 'wifi' && (
          <div ref={wifiAccordionContentRef} className="sensor-setup-accordion-content">
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
          </div>
        )}

        {expandedSection !== 'wifi' && (
          <div className="sensor-setup-accordion-preview">
            <p className="sensor-setup-accordion-preview-text">
              {wifiSteps.length} steps to connect your sensor to WiFi
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

Step2SensorSetup.displayName = 'Step2SensorSetup'

