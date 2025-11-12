import { useAuthContext } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TestPage() {
  const { user, worker, loading } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Format timestamp for logging
  const timestamp = new Date().toISOString();

  // Prepare user data with sensitive info removed
  const safeUserData = user ? {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    metadata: user.metadata,
    providerData: user.providerData
  } : null;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <h1 className="text-2xl font-bold text-red-700">Auth Diagnostic Page</h1>
          <p className="text-red-600 mt-1">
            You're seeing this page because your user account needs attention
          </p>
        </header>

        {/* Quick Actions */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleNavigate('/login')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
            <button
              onClick={() => handleNavigate('/signup')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Signup
            </button>
          </div>
        </section>

        {/* Loading State */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Loading State</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({ loading, timestamp }, null, 2)}
            </pre>
          </div>
        </section>

        {/* User Information */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(safeUserData, null, 2)}
            </pre>
          </div>
        </section>

        {/* Worker Profile */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Worker Profile</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(worker, null, 2)}
            </pre>
          </div>
        </section>

        {/* Route Information */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Route Information</h2>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                pathname: location.pathname,
                search: location.search,
                hash: location.hash,
                state: location.state,
              }, null, 2)}
            </pre>
          </div>
        </section>

        {/* Analysis */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Status Analysis</h2>
          <ul className="space-y-2">
            {!user && (
              <li className="text-yellow-600">
                ⚠️ No user is authenticated. You should log in.
              </li>
            )}
            {user && !worker && (
              <li className="text-yellow-600">
                ⚠️ User is authenticated but has no worker profile.
              </li>
            )}
            {worker && !['Admin', 'Contract'].includes(worker.role) && (
              <li className="text-yellow-600">
                ⚠️ Worker has an unrecognized role: {worker.role}
              </li>
            )}
            {loading && (
              <li className="text-blue-600">
                ℹ️ Authentication state is still loading...
              </li>
            )}
            {user && worker?.role === 'Admin' && (
              <li className="text-green-600">
                ✅ You are an Admin user. You should be redirected to the admin dashboard.
              </li>
            )}
            {user && worker?.role === 'Contract' && (
              <li className="text-green-600">
                ✅ You are a Contract worker. You should be redirected to the worker dashboard.
              </li>
            )}
          </ul>
        </section>

        {/* Timestamp */}
        <footer className="text-center text-gray-500 text-sm">
          Generated at: {timestamp}
        </footer>
      </div>
    </div>
  );
}
