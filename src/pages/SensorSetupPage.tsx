import { useState } from 'react'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1CreateAccount } from '../components/setup/steps/Step1CreateAccount'
import { Step2SensorSetup } from '../components/setup/steps/Step2SensorSetup'
import { Step3AssignCustomer } from '../components/setup/steps/Step3AssignCustomer'

const TOTAL_STEPS = 3

export function SensorSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [wifiInteracted, setWifiInteracted] = useState(false)

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
    // Reset WiFi interaction state when leaving step 2
    if (step !== 2) {
      setWifiInteracted(false)
    }
  }

  const handleWifiInteraction = () => {
    setWifiInteracted(true)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CreateAccount />
      case 2:
        return <Step2SensorSetup onWifiInteraction={handleWifiInteraction} />
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
    >
      {renderStep()}
    </SetupWizard>
  )
}
