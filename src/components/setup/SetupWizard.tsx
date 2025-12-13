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
              style={{ width: `${progressPercentage}%` }}
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
