import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Use saved location or default to dashboard (DashboardPage handles role-based redirects)
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!signIn) {
        throw new Error('Sign in not available')
      }

      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        // Redirect - DashboardPage will handle role-based redirects if needed
        // If there's a saved path, use it; otherwise go to dashboard
        const savedPath = location.state?.from?.pathname
        navigate(savedPath || '/dashboard', { replace: true })
      } else {
        setError('Sign in incomplete. Please try again.')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    'Exclusive Contractor Pricing – Save on Mini, Sensor, and bundle purchases',
    'Bulk Ordering & Volume Discounts – Special pricing for larger orders',
    'Priority Support – Direct access to technical resources and expert assistance',
    'Contractor Partner Program – Access to marketing materials and co-branding opportunities'
  ]

  return (
    <div className="signin-form-page-container">
      <div className="signin-form-page-wrapper">
        <div className="signin-form-card">
          <div className="signin-form-layout">
            {/* Left Side - Form */}
            <div className="signin-form-section">
              <div className="signin-form-header-section">
                <div className="signin-form-title-wrapper">
                  <ShieldCheckIcon className="signin-form-header-icon" />
                  <h1 className="signin-form-title">
                    Sign In
                  </h1>
                </div>
                <p className="signin-form-subtitle">
                  Access your contractor account and exclusive pricing
                </p>
              </div>
              
              <form className="signin-form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="signin-form-field">
                  <label htmlFor="email" className="signin-form-field-label">
                    <div className="signin-form-label-content">
                      <EnvelopeIcon className="signin-form-label-icon" />
                      Email Address
                    </div>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="signin-form-input"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="signin-form-field">
                  <label htmlFor="password" className="signin-form-field-label">
                    <div className="signin-form-label-content">
                      <LockClosedIcon className="signin-form-label-icon" />
                      Password
                    </div>
                  </label>
                  <div className="signin-form-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="signin-form-input signin-form-password-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="signin-form-password-toggle-button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="signin-form-password-toggle-icon" />
                      ) : (
                        <EyeIcon className="signin-form-password-toggle-icon" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="signin-form-error">
                    <p className="signin-form-error-message">
                      <XCircleIcon className="signin-form-error-icon" />
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="signin-form-submit-button"
                >
                  {isLoading ? (
                    <div className="signin-form-submit-loading">
                      <div className="signin-form-submit-spinner"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <CheckBadgeIcon className="signin-form-submit-icon" />
                      Sign In
                    </>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="signin-form-signup-link">
                  <p className="signin-form-signup-link-text">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/auth/signup')}
                      className="signin-form-signup-link-button"
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Benefits */}
            <div className="signin-form-benefits-section">
              <div className="signin-form-benefits-content">
                <div className="signin-form-benefits-header">
                  <h2 className="signin-form-benefits-title">Contractor Benefits</h2>
                  <p className="signin-form-benefits-description">
                    Access exclusive pricing and professional resources
                  </p>
                </div>
                
                <ul className="signin-form-benefits-list">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="signin-form-benefits-item">
                      <CheckCircleIcon className="signin-form-benefit-icon" />
                      <span className="signin-form-benefits-item-text">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="signin-form-cta-section">
                  <button
                    type="button"
                    onClick={() => navigate('/auth/signup')}
                    className="signin-form-cta-button"
                  >
                    Create Your Account
                    <ArrowRightIcon className="signin-form-cta-icon" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="signin-form-trust-section">
                  <div className="signin-form-trust-list">
                    <div className="signin-form-trust-item">
                      <ShieldCheckIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Secure & Encrypted</span>
                    </div>
                    <div className="signin-form-trust-item">
                      <CheckBadgeIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Trusted by 1000+ Professionals</span>
                    </div>
                    <div className="signin-form-trust-item">
                      <LockClosedIcon className="signin-form-trust-icon" />
                      <span className="signin-form-trust-text">Your data is protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
