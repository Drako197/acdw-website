import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1CreateAccount } from '../components/setup/steps/Step1CreateAccount'
import { Step2SensorSetup, type Step2SensorSetupHandle } from '../components/setup/steps/Step2SensorSetup'
import { Step3AssignCustomer } from '../components/setup/steps/Step3AssignCustomer'

const TOTAL_STEPS = 3

export function SensorSetupPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [wifiInteracted, setWifiInteracted] = useState(false)
  const step2Ref = useRef<Step2SensorSetupHandle>(null)

  // Read step from URL on mount and when URL changes (browser back/forward)
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const step = parseInt(stepParam, 10)
      // Validate step number
      if (step >= 1 && step <= TOTAL_STEPS) {
        setCurrentStep(step)
        // Reset WiFi interaction state when leaving step 2
        if (step !== 2) {
          setWifiInteracted(false)
        }
      } else {
        // Invalid step number, redirect to step 1
        setSearchParams({ step: '1' }, { replace: true })
        setCurrentStep(1)
      }
    } else {
      // No step parameter, default to step 1 and add it to URL
      setSearchParams({ step: '1' }, { replace: true })
      setCurrentStep(1)
    }
  }, [searchParams, setSearchParams])

  const handleStepChange = (step: number) => {
    // Validate step number
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step)
      // Update URL with new step (pushes to history for browser back button)
      setSearchParams({ step: step.toString() }, { replace: false })
      // Reset WiFi interaction state when leaving step 2
      if (step !== 2) {
        setWifiInteracted(false)
      }
    }
  }

  const handleWifiInteraction = () => {
    setWifiInteracted(true)
  }

  const handleContinueClick = (): boolean => {
    // On Step 2, check if Step2SensorSetup wants to handle the Continue click
    if (currentStep === 2 && step2Ref.current) {
      return step2Ref.current.handleContinueClick()
    }
    return false // Proceed normally
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CreateAccount />
      case 2:
        return <Step2SensorSetup ref={step2Ref} onWifiInteraction={handleWifiInteraction} />
      case 3:
        return <Step3AssignCustomer />
      default:
        return null
    }
  }

  // Disable continue button on step 2 if WiFi hasn't been interacted with
  const isContinueDisabled = currentStep === 2 && !wifiInteracted

  return (
    <SetupWizard
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      continueLabel={currentStep === TOTAL_STEPS ? 'Finish' : 'Continue'}
      isContinueDisabled={isContinueDisabled}
      onContinueClick={handleContinueClick}
    >
      {renderStep()}
    </SetupWizard>
  )
}
