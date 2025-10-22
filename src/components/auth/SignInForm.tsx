import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        navigate(from, { replace: true })
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signin-page-container">
      <div className="signin-form-wrapper">
        <div className="signin-form-header">
          <h2 className="signin-form-title">
            Sign in to your account
          </h2>
          <p className="signin-form-subtitle">
            Access professional pricing and bulk ordering
          </p>
        </div>
        
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-form-inputs">
            <div>
              <label htmlFor="email" className="signin-form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="signin-form-email-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="signin-form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="signin-form-password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="signin-form-error">
              <div className="signin-form-error-text">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="signin-form-submit-button"
            >
              {isLoading ? (
                <div className="signin-form-loading">
                  <div className="signin-form-spinner"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="signin-form-footer">
            <p className="signin-form-footer-text">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/signup')}
                className="signin-form-signup-link"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
