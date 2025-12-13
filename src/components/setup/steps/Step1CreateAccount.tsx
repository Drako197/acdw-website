import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function Step1CreateAccount() {
  const substeps = [
    {
      number: 1,
      title: 'Create User Account',
      description: 'Go to monitor.acdrainwiz.com/sign-up and fill out the registration form with your first name, last name, email, and password.',
      image: '/images/setup/step1-1-signup.png',
      alt: 'ACDW Monitor sign-up form'
    },
    {
      number: 2,
      title: 'Verify Your Email',
      description: 'Check your email inbox for a verification link from AC Drain Wiz. Click the link to verify your email address and activate your account.',
      image: '/images/setup/step1-2-verify-email.png',
      alt: 'Email verification message'
    },
    {
      number: 3,
      title: 'Create Company Profile',
      description: 'After email verification, you\'ll be prompted to create your company profile. Enter your contracting company details.',
      image: '/images/setup/step1-3-company-profile.png',
      alt: 'Company profile creation form'
    },
    {
      number: 4,
      title: 'Create Client',
      description: 'Create a client profile for the customer where you\'ll be installing the sensor. Enter their name and contact information.',
      image: '/images/setup/step1-4-create-client.png',
      alt: 'Client creation form'
    }
  ]

  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge">
          <span className="sensor-setup-step-badge-number">1</span>
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Create Account</h2>
        <p className="sensor-setup-step-subtitle">
          Set up your account before installing the sensor at a customer's home
        </p>
      </div>

      {/* Important Note */}
      <div className="sensor-setup-prerequisites-callout">
        <div className="sensor-setup-prerequisites-callout-content">
          <ExclamationTriangleIcon className="sensor-setup-prerequisites-callout-icon" />
          <div className="sensor-setup-prerequisites-callout-text">
            <h3 className="sensor-setup-prerequisites-callout-title">Important</h3>
            <p className="sensor-setup-prerequisites-callout-item-description">
              This account setup must be completed before you visit the customer's home to install the sensor. 
              Having your account and client profile ready will make the installation process much smoother.
            </p>
          </div>
        </div>
      </div>

      {/* Account Setup Steps */}
      <div className="sensor-setup-account-steps">
        {substeps.map((substep) => (
          <div key={substep.number} className="sensor-setup-account-step-card">
            <div className="sensor-setup-account-step-content">
              {/* Step Number */}
              <div className="sensor-setup-account-step-number-wrapper">
                <div className="sensor-setup-account-step-number-badge">
                  <span className="sensor-setup-account-step-number">{substep.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-account-step-details">
                <h3 className="sensor-setup-account-step-title">{substep.title}</h3>
                <p className="sensor-setup-account-step-description">{substep.description}</p>
                
                {/* Screenshot Image */}
                <div className="sensor-setup-account-step-image-wrapper">
                  <img
                    src={substep.image}
                    alt={substep.alt}
                    className="sensor-setup-account-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Link */}
      <div className="sensor-setup-account-quick-link">
        <a
          href="https://monitor.acdrainwiz.com/sign-up"
          target="_blank"
          rel="noopener noreferrer"
          className="sensor-setup-account-quick-link-button"
        >
          Go to Sign Up Page →
        </a>
      </div>
    </div>
  )
}

