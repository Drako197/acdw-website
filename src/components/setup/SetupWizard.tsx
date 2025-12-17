import { type ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface SetupWizardProps {
  totalSteps: number
  currentStep: number
  onStepChange: (step: number) => void
  children: ReactNode
  continueLabel?: string
  backLabel?: string
  isContinueDisabled?: boolean
  onContinueClick?: () => boolean // Returns true if handled, false to proceed normally
}

export function SetupWizard({
  totalSteps,
  currentStep,
  onStepChange,
  children,
  continueLabel = 'Continue',
  backLabel = 'Back',
  isContinueDisabled = false,
  onContinueClick
}: SetupWizardProps) {
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Get color for each progress bar based on step
  const getStepColor = (step: number) => {
    if (step <= currentStep) {
      // Completed or current step
      if (step === 1) {
        return '#2563eb' // Blue
      } else if (step === 2) {
        return '#5b21b6' // Purple mix
      } else {
        return '#6b21a8' // Deep purple
      }
    }
    return '#e5e7eb' // Gray for incomplete steps
  }

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleContinue = () => {
    // Check if there's a custom Continue handler (e.g., for Step 2)
    if (onContinueClick && onContinueClick()) {
      // Handler took care of it, don't proceed to next step
      return
    }
    
    // Normal behavior: proceed to next step
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1)
    }
  }

  return (
    <div className="sensor-setup-wizard-container">
      {/* Header */}
      <div className="sensor-setup-wizard-header">
        <div className="sensor-setup-wizard-header-content">
          {/* Back to Support Link */}
          <div className="sensor-setup-wizard-header-back-link">
            <Link to="/support" className="sensor-setup-wizard-header-back-link-content">
              <ArrowLeftIcon className="sensor-setup-wizard-header-back-link-icon" />
              <span>Back to Support</span>
            </Link>
          </div>

          <div className="sensor-setup-wizard-header-top">
            <div className="sensor-setup-wizard-header-brand">
              <Link to="/" className="sensor-setup-wizard-header-logo-link">
                <img 
                  src="/images/ac-drain-wiz-logo.png" 
                  alt="AC Drain Wiz" 
                  className="sensor-setup-wizard-header-logo"
                />
              </Link>
              <h1 className="sensor-setup-wizard-header-title">Sensor Setup</h1>
            </div>
            <div className="sensor-setup-wizard-header-step-indicator">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bars - 3 separate bars matching content width */}
          <div className="sensor-setup-wizard-progress-bars-container">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="sensor-setup-wizard-progress-bar"
                style={{ 
                  backgroundColor: getStepColor(step)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content with Fade Transition */}
      <div className="sensor-setup-wizard-content">
        <div 
          key={currentStep}
          className="sensor-setup-wizard-content-inner"
        >
          {children}
        </div>
      </div>

      {/* Navigation - Show on all steps, but only back button on final step */}
      <div className="sensor-setup-wizard-navigation">
        <div className="sensor-setup-wizard-navigation-content">
          <div className="sensor-setup-wizard-navigation-buttons">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`sensor-setup-wizard-navigation-button sensor-setup-wizard-navigation-button-back ${currentStep > 1 ? 'sensor-setup-wizard-navigation-button-enabled' : 'sensor-setup-wizard-navigation-button-disabled'}`}
            >
              <ChevronLeftIcon className="sensor-setup-wizard-navigation-button-icon" />
              <span>{backLabel}</span>
            </button>

            {/* Only show continue button if not on final step */}
            {currentStep < totalSteps && (
              <button
                onClick={handleContinue}
                disabled={isContinueDisabled}
                className={`sensor-setup-wizard-navigation-button sensor-setup-wizard-navigation-button-continue ${isContinueDisabled ? 'sensor-setup-wizard-navigation-button-disabled' : 'sensor-setup-wizard-navigation-button-enabled'}`}
              >
                <span>{continueLabel}</span>
                <ChevronRightIcon className="sensor-setup-wizard-navigation-button-icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
