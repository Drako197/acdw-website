import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

function DashboardContent() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-content-wrapper">
        <div className="dashboard-main-content">
          {/* Header */}
          <div className="dashboard-header-card">
            <div className="dashboard-header-content">
              <div className="dashboard-welcome-section">
                <h1 className="dashboard-welcome-title">
                  Welcome back, {user?.name}!
                </h1>
                <p className="dashboard-welcome-subtitle">
                  {user?.role.replace('_', ' ')} Account
                </p>
              </div>
              <button
                onClick={logout}
                className="dashboard-signout-button"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="dashboard-cards-grid">
            {/* Quick Actions */}
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Quick Actions</h2>
              <div className="dashboard-quick-actions">
                <button className="dashboard-action-button-primary">
                  View Products
                </button>
                <button className="dashboard-action-button-outline">
                  Bulk Order
                </button>
                <button className="dashboard-action-button-outline">
                  Request Demo
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Account Information</h2>
              <div className="dashboard-account-info">
                <div className="dashboard-account-item">
                  <span className="dashboard-account-label">Name:</span>
                  <span className="dashboard-account-value">{user?.name}</span>
                </div>
                <div className="dashboard-account-item">
                  <span className="dashboard-account-label">Email:</span>
                  <span className="dashboard-account-value">{user?.email}</span>
                </div>
                <div className="dashboard-account-item">
                  <span className="dashboard-account-label">Role:</span>
                  <span className="dashboard-account-value">{user?.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Recent Activity</h2>
              <div className="dashboard-activity-content">
                <p className="dashboard-activity-empty">No recent activity</p>
                <p className="dashboard-activity-message">Start by exploring our products!</p>
              </div>
            </div>
          </div>

          {/* Professional Features */}
          {user?.role === 'HVAC_PROFESSIONAL' && (
            <div className="dashboard-professional-features">
              <h2 className="dashboard-professional-title">Professional Features</h2>
              <div className="dashboard-professional-grid">
                <div className="dashboard-professional-feature">
                  <h3 className="dashboard-professional-feature-title">Bulk Pricing</h3>
                  <p className="dashboard-professional-feature-description">Access professional pricing for large orders</p>
                </div>
                <div className="dashboard-professional-feature">
                  <h3 className="dashboard-professional-feature-title">Technical Support</h3>
                  <p className="dashboard-professional-feature-description">Get priority support for installation and troubleshooting</p>
                </div>
                <div className="dashboard-professional-feature">
                  <h3 className="dashboard-professional-feature-title">Installation Guides</h3>
                  <p className="dashboard-professional-feature-description">Download detailed installation and maintenance guides</p>
                </div>
                <div className="dashboard-professional-feature">
                  <h3 className="dashboard-professional-feature-title">ICC Compliance</h3>
                  <p className="dashboard-professional-feature-description">Access code compliance documentation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
