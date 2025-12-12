import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Step4WiFiLoginProps {
  onComplete: (data: { wifiConnected: boolean; loggedIn: boolean }) => void
}

export function Step4WiFiLogin({ onComplete }: Step4WiFiLoginProps) {
  const [currentSubStep, setCurrentSubStep] = useState<'connect' | 'wifi' | 'login'>('connect')
  const [showPassword, setShowPassword] = useState(false)
  const [wifiPassword, setWifiPassword] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')

  // Mock networks - in real app, this would come from the sensor's captive portal
  const availableNetworks = [
    { name: 'HomeNetwork_2.4G', signal: 85 },
    { name: 'HomeNetwork_5G', signal: 75 },
    { name: 'NeighborWiFi', signal: 45 }
  ]

  const handleConnectToSensor = () => {
    // In real app, this would guide user to device Wi-Fi settings
    setCurrentSubStep('wifi')
    onComplete({ wifiConnected: true, loggedIn: false })
  }

  const handleSelectNetwork = (networkName: string) => {
    setSelectedNetwork(networkName)
  }

  const handleConnectToWiFi = async () => {
    if (!selectedNetwork || !wifiPassword) {
      setError('Please select a network and enter the password')
      return
    }

    setIsConnecting(true)
    setError('')

    // Simulate connection - in real app, this would call the sensor's API
    setTimeout(() => {
      setIsConnecting(false)
      setCurrentSubStep('login')
      onComplete({ wifiConnected: true, loggedIn: false })
    }, 2000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoggingIn(true)
    setError('')

    // Simulate login - in real app, this would authenticate with ACDW Monitor
    setTimeout(() => {
      setIsLoggingIn(false)
      onComplete({ wifiConnected: true, loggedIn: true })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to Wi-Fi & Login</h2>
        <p className="text-gray-600">
          Connect your sensor to the homeowner's Wi-Fi network and log in to your ACDW Monitor account.
        </p>
      </div>

      {/* Sub-step 4.1: Connect to Sensor */}
      {currentSubStep === 'connect' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4.1: Connect to Sensor Wi-Fi</h3>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Go to your device's Wi-Fi settings and connect to:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold text-gray-900">ACDW Sensor (ID)</p>
                  <p className="text-sm text-gray-600 mt-1">Sensor's pairing network</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('ACDW Sensor (ID)')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Troubleshooting</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Can't see the network? Make sure LED is blinking red</li>
                    <li>• Connection keeps dropping? Move closer to the sensor</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleConnectToSensor}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              I'm connected to sensor Wi-Fi
            </button>
          </div>
        </div>
      )}

      {/* Sub-step 4.2: Select Home Wi-Fi */}
      {currentSubStep === 'wifi' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4.2: Connect Sensor to Home Wi-Fi</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Networks</label>
              <div className="space-y-2">
                {availableNetworks.map((network) => (
                  <button
                    key={network.name}
                    onClick={() => handleSelectNetwork(network.name)}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${selectedNetwork === network.name
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{network.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`
                                  w-2 h-2 rounded-full
                                  ${i < Math.floor(network.signal / 20)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                  }
                                `}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">{network.signal}% signal</span>
                        </div>
                      </div>
                      {selectedNetwork === network.name && (
                        <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wi-Fi Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Enter Wi-Fi password"
                  className="input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              onClick={handleConnectToWiFi}
              disabled={isConnecting || !selectedNetwork || !wifiPassword}
              className={`
                w-full py-3 px-4 rounded-md font-medium transition-colors
                ${isConnecting || !selectedNetwork || !wifiPassword
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }
              `}
            >
              {isConnecting ? 'Connecting...' : 'Connect to Wi-Fi'}
            </button>
          </div>
        </div>
      )}

      {/* Sub-step 4.3: Login */}
      {currentSubStep === 'login' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4.3: Login to ACDW Sensor Admin</h3>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !email || !password}
              className={`
                w-full py-3 px-4 rounded-md font-medium transition-colors
                ${isLoggingIn || !email || !password
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }
              `}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Don't have an account?{' '}
                <a
                  href="https://monitor.acdrainwiz.com/sign-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 underline"
                >
                  Sign up at monitor.acdrainwiz.com
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

