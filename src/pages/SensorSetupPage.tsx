import { useState } from 'react'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1CreateAccount } from '../components/setup/steps/Step1CreateAccount'
import { Step2SensorSetup } from '../components/setup/steps/Step2SensorSetup'
import { Step3AssignCustomer } from '../components/setup/steps/Step3AssignCustomer'

const TOTAL_STEPS = 3

export function SensorSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CreateAccount />
      case 2:
        return <Step2SensorSetup />
      case 3:
        return <Step3AssignCustomer />
      default:
        return null
    }
  }

  return (
    <SetupWizard
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      continueLabel={currentStep === TOTAL_STEPS ? 'Finish' : 'Continue'}
    >
      {renderStep()}
    </SetupWizard>
  )
}
