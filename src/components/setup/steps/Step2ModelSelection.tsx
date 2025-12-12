import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

type SensorModel = 'battery' | 'dc' | null

interface Step2ModelSelectionProps {
  onSelect: (model: SensorModel) => void
}

export function Step2ModelSelection({ onSelect }: Step2ModelSelectionProps) {
  const [selectedModel, setSelectedModel] = useState<SensorModel>(null)

  const handleSelect = (model: 'battery' | 'dc') => {
    setSelectedModel(model)
    onSelect(model)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Sensor Model</h2>
        <p className="text-gray-600">
          Choose the model that matches your sensor. Check your sensor box - if you see a connection cable, select DC model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Battery Model */}
        <button
          onClick={() => handleSelect('battery')}
          className={`
            bg-white rounded-lg border-2 p-6 text-left transition-all
            ${selectedModel === 'battery'
              ? 'border-primary-600 shadow-lg ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Battery-Only Model</h3>
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2
                ${selectedModel === 'battery'
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-300'
                }
              `}>
                {selectedModel === 'battery' && <CheckCircleIcon className="h-4 w-4 text-white" />}
              </div>
            </div>
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🔋</span>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>No connection cable</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Battery powered (~2 years)</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Wi-Fi alerts only</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>SMS/Email notifications</span>
            </li>
          </ul>
        </button>

        {/* DC Model */}
        <button
          onClick={() => handleSelect('dc')}
          className={`
            bg-white rounded-lg border-2 p-6 text-left transition-all
            ${selectedModel === 'dc'
              ? 'border-primary-600 shadow-lg ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">DC + Battery Model</h3>
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2
                ${selectedModel === 'dc'
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-300'
                }
              `}>
                {selectedModel === 'dc' && <CheckCircleIcon className="h-4 w-4 text-white" />}
              </div>
            </div>
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🔌</span>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Includes connection cable</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>DC primary + backup battery</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Wi-Fi alerts + AC shutoff</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Automatic AC protection</span>
            </li>
          </ul>
        </button>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Tip</p>
            <p className="text-sm text-blue-800">
              Check your sensor box. If you see a connection cable, select the DC model. If there's no cable, select the Battery model.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

