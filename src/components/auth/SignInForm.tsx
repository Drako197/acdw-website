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

      // Log the result for debugging (especially useful for Safari issues)
      console.log('Sign in result:', {
        status: result.status,
        createdSessionId: result.createdSessionId,
        supportedFirstFactors: result.supportedFirstFactors,
        supportedSecondFactors: result.supportedSecondFactors,
      })

      if (result.status === 'complete') {
        // Session created successfully
        if (result.createdSessionId) {
          try {
            await setActive({ session: result.createdSessionId })
            // Small delay to ensure session is fully set (helps with Safari cookie/storage issues)
            await new Promise(resolve => setTimeout(resolve, 500))
            // Redirect - DashboardPage will handle role-based redirects if needed
            // If there's a saved path, use it; otherwise go to dashboard
            const savedPath = location.state?.from?.pathname
            navigate(savedPath || '/dashboard', { replace: true })
          } catch (setActiveError: any) {
            console.error('Error setting active session:', setActiveError)
            // Safari-specific: Sometimes setActive fails due to cookie issues
            // Try to reload the page to let Clerk handle the session
            if (setActiveError.message?.includes('cookie') || 
                setActiveError.message?.includes('storage') ||
                setActiveError.message?.includes('session')) {
              // Safari workaround: Reload page to let Clerk handle session via cookies
              console.log('Attempting Safari workaround: reloading page')
              window.location.href = '/dashboard'
            } else {
              setError(setActiveError.message || 'Failed to activate session. Please try again.')
            }
          }
        } else {
          setError('Session ID missing. Please try again.')
        }
      } else if (result.status === 'needs_first_factor') {
        // MFA or other first factor required
        setError('Additional verification required. Please check your email or use your authenticator app.')
      } else if (result.status === 'needs_second_factor') {
        // 2FA is enabled on this account but we don't support it in the UI
        // User needs to disable 2FA in Clerk Dashboard or use Clerk's hosted UI
        setError('Two-factor authentication is enabled on this account. Please disable 2FA in your account settings or contact support.')
      } else if (result.status === 'needs_new_password') {
        // Password reset required
        setError('Password reset required. Please check your email for reset instructions.')
      } else {
        // Other statuses - provide more helpful error
        console.warn('Unexpected sign-in status:', result.status)
        setError(`Sign in incomplete (status: ${result.status}). Please try again or contact support if the issue persists.`)
      }
    } catch (err: any) {
      console.error('Sign in error:', {
        message: err.message,
        errors: err.errors,
        status: err.status,
        code: err.code,
      })
      
      // Provide more specific error messages
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message
        // Check for Safari-specific issues
        if (errorMessage.includes('cookie') || errorMessage.includes('storage') || errorMessage.includes('session')) {
          setError('Browser storage issue detected. Please enable cookies and try again, or use a different browser.')
        } else {
          setError(errorMessage)
        }
      } else {
        setError(err.message || 'Invalid email or password. Please try again.')
      }
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
