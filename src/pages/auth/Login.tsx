// src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, loginWithGoogle } from '../../hooks/auth/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { worker } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // ✅ New name field

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!worker) return;
    if (worker.role === 'Admin') navigate('/', { replace: true });
    else if (worker.role === 'Contract') navigate('/worker-dashboard', { replace: true });
  }, [worker, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, name); // ✅ Pass name
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary-700 mb-6 text-center">Login</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-grey py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login with Google'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}