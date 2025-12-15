import { useEffect, useState } from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PrerequisiteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrerequisiteModal({ isOpen, onClose }: PrerequisiteModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleUnderstand = () => {
    // Store in sessionStorage so it doesn't show again this session
    sessionStorage.setItem('sensor-setup-prerequisite-acknowledged', 'true')
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleUnderstand()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleUnderstand])

  if (!isOpen) return null

  return (
    <div className="sensor-setup-prerequisite-modal-overlay">
      <div 
        className={`sensor-setup-prerequisite-modal ${isVisible ? 'sensor-setup-prerequisite-modal-visible' : ''}`}
      >
        <div className="sensor-setup-prerequisite-modal-content">
          {/* Close button (optional - can remove if you want to force acknowledgment) */}
          <button
            onClick={handleUnderstand}
            className="sensor-setup-prerequisite-modal-close"
            aria-label="Close"
          >
            <XMarkIcon className="sensor-setup-prerequisite-modal-close-icon" />
          </button>

          {/* Icon */}
          <div className="sensor-setup-prerequisite-modal-icon-wrapper">
            <ExclamationTriangleIcon className="sensor-setup-prerequisite-modal-icon" />
          </div>

          {/* Title */}
          <h2 className="sensor-setup-prerequisite-modal-title">
            Important: Complete Account Setup First
          </h2>

          {/* Message */}
          <div className="sensor-setup-prerequisite-modal-message">
            <p className="sensor-setup-prerequisite-modal-text">
              Before you visit a customer's home to install an AC Drain Wiz Sensor, you must complete your account setup.
            </p>
            <p className="sensor-setup-prerequisite-modal-text">
              This includes:
            </p>
            <ul className="sensor-setup-prerequisite-modal-list">
              <li className="sensor-setup-prerequisite-modal-list-item">
                Creating your user account
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Verifying your email
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Setting up your company profile
              </li>
              <li className="sensor-setup-prerequisite-modal-list-item">
                Creating a customer profile for the installation location
              </li>
            </ul>
            <p className="sensor-setup-prerequisite-modal-text sensor-setup-prerequisite-modal-text-emphasis">
              Having your account and customer profile ready will make the installation process much smoother and faster.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUnderstand}
            className="sensor-setup-prerequisite-modal-button"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

