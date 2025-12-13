import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

export function Step3AssignCustomer() {
  const navigate = useNavigate()

  const substeps = [
    {
      number: 1,
      title: 'View Customer List',
      description: 'After logging in, you\'ll be presented with a list of your existing customers. This list includes all clients you\'ve created in your account.',
      image: '/images/setup/step3-1-customer-list.png',
      alt: 'Customer list screen'
    },
    {
      number: 2,
      title: 'Select Customer',
      description: 'Tap on the customer name where you\'re installing the sensor. This will open the customer details page.',
      image: '/images/setup/step3-2-select-customer.png',
      alt: 'Selecting a customer from the list'
    },
    {
      number: 3,
      title: 'Select Address (if multiple)',
      description: 'If the customer has multiple addresses on file, you\'ll be asked to select which address this sensor will be assigned to. Choose the correct location.',
      image: '/images/setup/step3-3-select-address.png',
      alt: 'Address selection screen'
    },
    {
      number: 4,
      title: 'Sensor Assigned',
      description: 'The sensor will be automatically assigned to your selected customer. You\'ll see a confirmation message when the assignment is complete.',
      image: '/images/setup/step3-4-complete.png',
      alt: 'Assignment complete confirmation'
    }
  ]

  return (
    <div className="sensor-setup-step-container">
      {/* Step Number Badge */}
      <div className="sensor-setup-step-badge-wrapper">
        <div className="sensor-setup-step-badge sensor-setup-step-badge-complete">
          <CheckCircleIcon className="sensor-setup-step-badge-icon" />
        </div>
      </div>

      {/* Step Title */}
      <div className="sensor-setup-step-title-section">
        <h2 className="sensor-setup-step-title">Assign Sensor to Customer</h2>
        <p className="sensor-setup-step-subtitle">
          Link the sensor to your customer's account
        </p>
      </div>

      {/* Assignment Steps */}
      <div className="sensor-setup-assignment-steps">
        {substeps.map((substep) => (
          <div key={substep.number} className="sensor-setup-assignment-step-card">
            <div className="sensor-setup-assignment-step-content">
              {/* Step Number */}
              <div className="sensor-setup-assignment-step-number-wrapper">
                <div className="sensor-setup-assignment-step-number-badge">
                  <span className="sensor-setup-assignment-step-number">{substep.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="sensor-setup-assignment-step-details">
                <h3 className="sensor-setup-assignment-step-title">{substep.title}</h3>
                <p className="sensor-setup-assignment-step-description">{substep.description}</p>
                
                {/* Screenshot Image */}
                <div className="sensor-setup-assignment-step-image-wrapper">
                  <img
                    src={substep.image}
                    alt={substep.alt}
                    className="sensor-setup-assignment-step-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Message */}
      <div className="sensor-setup-assignment-success">
        <div className="sensor-setup-assignment-success-icon-wrapper">
          <CheckCircleIcon className="sensor-setup-assignment-success-icon" />
        </div>
        <h3 className="sensor-setup-assignment-success-title">Installation and Setup Complete!</h3>
        <p className="sensor-setup-assignment-success-message">
          Your sensor is now installed, connected, and assigned to your customer. 
          You can monitor it from your dashboard and set up alerts as needed.
        </p>
      </div>

      {/* Next Steps */}
      <div className="sensor-setup-assignment-next-steps">
        <h3 className="sensor-setup-assignment-next-steps-title">What's Next?</h3>
        <ul className="sensor-setup-assignment-next-steps-list">
          <li className="sensor-setup-assignment-next-steps-item">
            <span className="sensor-setup-assignment-next-steps-item-text">Configure alert thresholds in your dashboard</span>
          </li>
          <li className="sensor-setup-assignment-next-steps-item">
            <span className="sensor-setup-assignment-next-steps-item-text">Set up additional sensors</span>
          </li>
          <li className="sensor-setup-assignment-next-steps-item">
            <span className="sensor-setup-assignment-next-steps-item-text">Need help? Contact our support team</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="sensor-setup-assignment-actions">
        <button
          onClick={() => navigate('/contact?type=support')}
          className="sensor-setup-assignment-button sensor-setup-assignment-button-primary"
        >
          Contact Support
        </button>
        
        <button
          onClick={() => navigate('/sensor-setup')}
          className="sensor-setup-assignment-button sensor-setup-assignment-button-secondary"
        >
          Setup Another Sensor
        </button>
      </div>
    </div>
  )
}

