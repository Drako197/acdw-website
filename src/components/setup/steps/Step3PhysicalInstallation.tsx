import { useState, useEffect } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

type SensorModel = 'battery' | 'dc'

interface Step3PhysicalInstallationProps {
  selectedModel: SensorModel
  onComplete: (completed: boolean) => void
}

export function Step3PhysicalInstallation({ selectedModel, onComplete }: Step3PhysicalInstallationProps) {
  const [step1Complete, setStep1Complete] = useState(false)
  const [step2Complete, setStep2Complete] = useState(false)
  const [step3Complete, setStep3Complete] = useState(false)
  const [step4Complete, setStep4Complete] = useState(false)

  const allStepsComplete = step1Complete && step2Complete && step3Complete && step4Complete

  // Update parent when all steps complete
  useEffect(() => {
    onComplete(allStepsComplete)
  }, [allStepsComplete, onComplete])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Physical Installation</h2>
        <p className="text-gray-600">
          Follow these steps to physically install your sensor. Complete each step before proceeding.
        </p>
      </div>

      {/* Step 3.1: Prepare Mini */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step1Complete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {step1Complete ? <CheckCircleIcon className="h-6 w-6" /> : '1'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prepare Mini</h3>
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">[Image: Mini with protective cap]</span>
            </div>
            <p className="text-gray-700 mb-4">
              Remove the protective cap from the Mini's bayonet port. The cap should come off easily with a quarter-turn.
            </p>
            <button
              onClick={() => setStep1Complete(!step1Complete)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${step1Complete
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <CheckCircleIcon className={`h-5 w-5 ${step1Complete ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{step1Complete ? 'Step completed' : 'I\'ve removed the cap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3.2: Power the Sensor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step2Complete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {step2Complete ? <CheckCircleIcon className="h-6 w-6" /> : '2'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Power the Sensor</h3>
            {selectedModel === 'battery' ? (
              <>
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">[Image: Inserting battery]</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                  <li>Open the battery door on the sensor</li>
                  <li>Insert the battery (observe polarity)</li>
                  <li>Close the battery door securely</li>
                </ol>
              </>
            ) : (
              <>
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">[Image: Connecting DC cable]</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                  <li>Connect the DC cable to the sensor</li>
                  <li>Connect the other end to your power source</li>
                  <li>Insert the backup battery (if included)</li>
                </ol>
              </>
            )}
            <button
              onClick={() => setStep2Complete(!step2Complete)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${step2Complete
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <CheckCircleIcon className={`h-5 w-5 ${step2Complete ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{step2Complete ? 'Step completed' : 'Power connected'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3.3: Attach Sensor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step3Complete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {step3Complete ? <CheckCircleIcon className="h-6 w-6" /> : '3'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attach Sensor to Mini</h3>
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">[Image: Sensor snapping into bayonet]</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
              <li>Align the sensor with the Mini's bayonet port</li>
              <li>Push the sensor in and turn 90° clockwise</li>
              <li>You'll hear a click when it's locked</li>
              <li>The sensor should be securely attached</li>
            </ol>
            <button
              onClick={() => setStep3Complete(!step3Complete)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${step3Complete
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <CheckCircleIcon className={`h-5 w-5 ${step3Complete ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{step3Complete ? 'Step completed' : 'Sensor attached'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3.4: Verify LED */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step4Complete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {step4Complete ? <CheckCircleIcon className="h-6 w-6" /> : '4'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify LED Status</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <span className="text-white text-xs">LED</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">LED should be blinking RED</p>
                <p className="text-sm text-gray-600">This indicates the sensor is in pairing mode</p>
              </div>
            </div>
            <button
              onClick={() => setStep4Complete(!step4Complete)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${step4Complete
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <CheckCircleIcon className={`h-5 w-5 ${step4Complete ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{step4Complete ? 'Step completed' : 'LED is blinking red'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {allStepsComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Physical installation complete! Ready to connect to Wi-Fi.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

