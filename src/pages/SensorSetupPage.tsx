import { useState } from 'react'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1Preparation } from '../components/setup/steps/Step1Preparation'
import { Step2PhysicalInstallation } from '../components/setup/steps/Step2PhysicalInstallation'
import { Step3WiFiSetup } from '../components/setup/steps/Step3WiFiSetup'
import { Step4Success } from '../components/setup/steps/Step4Success'

const TOTAL_STEPS = 4

export function SensorSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Preparation />
      case 2:
        return <Step2PhysicalInstallation />
      case 3:
        return <Step3WiFiSetup />
      case 4:
        return <Step4Success />
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
