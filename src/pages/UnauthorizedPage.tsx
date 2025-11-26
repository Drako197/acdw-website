/**
 * Unauthorized Page
 * 
 * Shown when a user tries to access a page they don't have permission for.
 */

import { useNavigate } from 'react-router-dom'
import { 
  ShieldExclamationIcon, 
  ArrowLeftIcon,
  HomeIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="unauthorized-page-container">
      <div className="unauthorized-page-wrapper">
        <div className="unauthorized-page-content">
          {/* Icon */}
          <div className="unauthorized-page-icon-wrapper">
            <ShieldExclamationIcon className="unauthorized-page-icon" />
          </div>

          {/* Title */}
          <h1 className="unauthorized-page-title">
            Access Denied
          </h1>

          {/* Message */}
          <div className="unauthorized-page-message">
            <p className="unauthorized-page-text">
              You don't have permission to access this page.
            </p>
            {user && (
              <p className="unauthorized-page-role-info">
                Your current account type: <strong>{user.role.replace('_', ' ')}</strong>
              </p>
            )}
            <p className="unauthorized-page-help-text">
              If you believe this is an error, please contact support or sign in with a different account.
            </p>
          </div>

          {/* Actions */}
          <div className="unauthorized-page-actions">
            <button
              onClick={() => navigate('/dashboard')}
              className="unauthorized-page-button-primary"
            >
              <HomeIcon className="unauthorized-page-button-icon" />
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/contact?type=support')}
              className="unauthorized-page-button-secondary"
            >
              <EnvelopeIcon className="unauthorized-page-button-icon" />
              Contact Support
            </button>

            <button
              onClick={() => {
                logout()
                navigate('/auth/signin')
              }}
              className="unauthorized-page-button-link"
            >
              <ArrowLeftIcon className="unauthorized-page-button-icon" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

