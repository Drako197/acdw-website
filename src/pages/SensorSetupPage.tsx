import { useState } from 'react'
import { SetupWizard } from '../components/setup/SetupWizard'
import { Step1Prerequisites } from '../components/setup/steps/Step1Prerequisites'
import { Step2ModelSelection } from '../components/setup/steps/Step2ModelSelection'
import { Step3PhysicalInstallation } from '../components/setup/steps/Step3PhysicalInstallation'
import { Step4WiFiLogin } from '../components/setup/steps/Step4WiFiLogin'
import { Step5Success } from '../components/setup/steps/Step6Success'

type SensorModel = 'battery' | 'dc' | null

interface SetupData {
  prerequisites: {
    miniInstalled: boolean
    hasAccount: boolean
  } | null
  selectedModel: SensorModel
  physicalInstallationComplete: boolean
  wifiLoginComplete: {
    wifiConnected: boolean
    loggedIn: boolean
    deviceRegistration: {
      deviceName: string
      location: string
      customerName: string
      isNewCustomer: boolean
      alerts: {
        email: boolean
        sms: boolean
        dailyReport: boolean
      }
    }
  } | null
}

const TOTAL_STEPS = 5

export function SensorSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    prerequisites: null,
    selectedModel: null,
    physicalInstallationComplete: false,
    wifiLoginComplete: null,
    deviceRegistration: null
  })

  const handleStep1Complete = (data: { miniInstalled: boolean; hasAccount: boolean }) => {
    setSetupData(prev => ({
      ...prev,
      prerequisites: data
    }))
  }

  const handleStep2Select = (model: SensorModel) => {
    setSetupData(prev => ({
      ...prev,
      selectedModel: model
    }))
  }

  const handleStep3Complete = (completed: boolean) => {
    setSetupData(prev => ({
      ...prev,
      physicalInstallationComplete: completed
    }))
  }

  const handleStep4Complete = (data: {
    wifiConnected: boolean
    loggedIn: boolean
    deviceRegistration: {
      deviceName: string
      location: string
      customerName: string
      isNewCustomer: boolean
      alerts: {
        email: boolean
        sms: boolean
        dailyReport: boolean
      }
    }
  }) => {
    setSetupData(prev => ({
      ...prev,
      wifiLoginComplete: data
    }))
    // Move to success step
    setCurrentStep(5)
  }

  const canContinueFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return setupData.prerequisites?.miniInstalled === true && 
               setupData.prerequisites?.hasAccount === true
      case 2:
        return setupData.selectedModel !== null
      case 3:
        return setupData.physicalInstallationComplete
      case 4:
        return setupData.wifiLoginComplete?.wifiConnected === true && 
               setupData.wifiLoginComplete?.loggedIn === true &&
               setupData.wifiLoginComplete?.deviceRegistration !== undefined
      case 5:
        return false // Success step, no continue
      default:
        return false
    }
  }

  const handleContinue = () => {
    if (currentStep < TOTAL_STEPS && canContinueFromStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Prerequisites onComplete={handleStep1Complete} />
      case 2:
        return <Step2ModelSelection onSelect={handleStep2Select} />
      case 3:
        return (
          <Step3PhysicalInstallation
            selectedModel={setupData.selectedModel || 'battery'}
            onComplete={handleStep3Complete}
          />
        )
      case 4:
        return <Step4WiFiLogin onComplete={handleStep4Complete} />
      case 5:
        return setupData.wifiLoginComplete?.deviceRegistration ? (
          <Step5Success deviceData={{
            deviceName: setupData.wifiLoginComplete.deviceRegistration.deviceName,
            location: setupData.wifiLoginComplete.deviceRegistration.location,
            customerName: setupData.wifiLoginComplete.deviceRegistration.customerName
          }} />
        ) : null
      default:
        return null
    }
  }

  return (
    <SetupWizard
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      canGoBack={currentStep > 1}
      canContinue={canContinueFromStep(currentStep) && currentStep < TOTAL_STEPS}
      onContinue={handleContinue}
      onBack={handleBack}
      continueLabel="Continue"
    >
      {renderStep()}
    </SetupWizard>
  )
}

