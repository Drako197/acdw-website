import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

function DashboardContent() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  {user?.role.replace('_', ' ')} Account
                </p>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn btn-primary">
                  View Products
                </button>
                <button className="w-full btn btn-outline">
                  Bulk Order
                </button>
                <button className="w-full btn btn-outline">
                  Request Demo
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">{user?.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{user?.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="ml-2 text-gray-600">{user?.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-sm text-gray-600">
                <p>No recent activity</p>
                <p className="mt-2">Start by exploring our products!</p>
              </div>
            </div>
          </div>

          {/* Professional Features */}
          {user?.role === 'HVAC_PROFESSIONAL' && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Bulk Pricing</h3>
                  <p className="text-sm text-gray-600">Access professional pricing for large orders</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Technical Support</h3>
                  <p className="text-sm text-gray-600">Get priority support for installation and troubleshooting</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Installation Guides</h3>
                  <p className="text-sm text-gray-600">Download detailed installation and maintenance guides</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">ICC Compliance</h3>
                  <p className="text-sm text-gray-600">Access code compliance documentation</p>
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
