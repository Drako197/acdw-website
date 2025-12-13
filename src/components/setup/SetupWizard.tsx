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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/ac-drain-wiz-logo.png" 
                alt="AC Drain Wiz" 
                className="h-8 w-auto"
              />
              <h1 className="text-lg font-semibold text-gray-900">Sensor Setup</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content with Fade Transition */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div 
          key={currentStep}
          className="animate-fade-in"
        >
          {children}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors
                ${currentStep > 1
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>{backLabel}</span>
            </button>

            <button
              onClick={handleContinue}
              disabled={currentStep >= totalSteps}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors
                ${currentStep < totalSteps
                  ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span>{continueLabel}</span>
              {currentStep < totalSteps && <ChevronRightIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
