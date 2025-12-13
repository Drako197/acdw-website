import { type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface SetupWizardProps {
  totalSteps: number
  currentStep: number
  onStepChange: (step: number) => void
  children: ReactNode
  continueLabel?: string
  backLabel?: string
}

export function SetupWizard({
  totalSteps,
  currentStep,
  onStepChange,
  children,
  continueLabel = 'Continue',
  backLabel = 'Back'
}: SetupWizardProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  // Calculate gradient based on current step
  // Step 1: Blue (#2563eb - primary-600)
  // Step 2: Mix of blue and purple (transitioning)
  // Step 3: Deep purple (#6b21a8 - purple-800)
  const getProgressGradient = () => {
    if (currentStep === 1) {
      // Step 1: Solid blue
      return 'linear-gradient(to right, #2563eb, #2563eb)'
    } else if (currentStep === 2) {
      // Step 2: Blue transitioning to purple mix
      return 'linear-gradient(to right, #2563eb 0%, #5b21b6 50%, #7c3aed 100%)'
    } else {
      // Step 3: Full gradient from blue to deep purple
      return 'linear-gradient(to right, #2563eb 0%, #5b21b6 50%, #6b21a8 100%)'
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1)
    }
  }

  return (
    <div className="sensor-setup-wizard-container">
      {/* Header */}
      <div className="sensor-setup-wizard-header">
        <div className="sensor-setup-wizard-header-content">
          <div className="sensor-setup-wizard-header-top">
            <div className="sensor-setup-wizard-header-brand">
              <img 
                src="/images/ac-drain-wiz-logo.png" 
                alt="AC Drain Wiz" 
                className="sensor-setup-wizard-header-logo"
              />
              <h1 className="sensor-setup-wizard-header-title">Sensor Setup</h1>
            </div>
            <div className="sensor-setup-wizard-header-step-indicator">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="sensor-setup-wizard-progress-bar-wrapper">
            <div
              className="sensor-setup-wizard-progress-bar"
              style={{ 
                width: `${progressPercentage}%`,
                background: getProgressGradient()
              }}
            />
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

      {/* Navigation */}
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

            <button
              onClick={handleContinue}
              disabled={currentStep >= totalSteps}
              className={`sensor-setup-wizard-navigation-button sensor-setup-wizard-navigation-button-continue ${currentStep < totalSteps ? 'sensor-setup-wizard-navigation-button-enabled' : 'sensor-setup-wizard-navigation-button-disabled'}`}
            >
              <span>{continueLabel}</span>
              {currentStep < totalSteps && <ChevronRightIcon className="sensor-setup-wizard-navigation-button-icon" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
