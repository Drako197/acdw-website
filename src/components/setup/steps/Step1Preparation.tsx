import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export function Step1Preparation() {
  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">1</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="sensor-setup-step-hero-image-wrapper">
        <img
          src="/images/setup/step1-hero.png"
          alt="ACDW Sensor and Mini together"
          className="sensor-setup-step-hero-image"
        />
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Preparation</h2>
        <p className="sensor-setup-step-subtitle">
          Before you begin, make sure you have everything you need
        </p>
      </div>

      {/* Prerequisites Callout */}
      <div className="sensor-setup-prerequisites-callout">
        <div className="sensor-setup-prerequisites-callout-content">
          <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
          <div className="sensor-setup-prerequisites-callout-text">
            <h3 className="sensor-setup-prerequisites-callout-title">Prerequisites</h3>
            <div className="sensor-setup-prerequisites-callout-items">
              <div className="sensor-setup-prerequisites-callout-item">
                <CheckCircleIcon className="sensor-setup-prerequisites-callout-item-icon" />
                <div className="sensor-setup-prerequisites-callout-item-content">
                  <p className="sensor-setup-prerequisites-callout-item-title">ACDW Mini Installed</p>
                  <p className="sensor-setup-prerequisites-callout-item-description">The sensor requires an ACDW Mini to be installed first.</p>
                  <a
                    href="/mini-setup"
                    className="sensor-setup-prerequisites-callout-item-link"
                  >
                    View Mini Setup Guide →
                  </a>
                </div>
              </div>
              <div className="sensor-setup-prerequisites-callout-item">
                <CheckCircleIcon className="sensor-setup-prerequisites-callout-item-icon" />
                <div className="sensor-setup-prerequisites-callout-item-content">
                  <p className="sensor-setup-prerequisites-callout-item-title">ACDW Sensor Admin Account</p>
                  <p className="sensor-setup-prerequisites-callout-item-description">You need an active contractor account to register and manage sensors.</p>
                  <a
                    href="https://monitor.acdrainwiz.com/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sensor-setup-prerequisites-callout-item-link"
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
      <div className="sensor-setup-model-identification">
        <h3 className="sensor-setup-model-identification-title">Identify Your Sensor Model</h3>
        <p className="sensor-setup-model-identification-description">
          Check your sensor box to identify which model you have. The setup process is the same for both.
        </p>
        
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
              No connection cable included
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
              Includes connection cable
            </p>
          </div>
        </div>
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
              <p className="sensor-setup-what-you-need-item-title">Battery or DC Cable</p>
              <p className="sensor-setup-what-you-need-item-description">Depending on model</p>
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
