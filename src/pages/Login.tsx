// src/pages/Login.tsx
import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle, sendOTP, verifyOTP, setupRecaptcha } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { worker } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState<'email' | 'phone' | 'otp'>('email');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a stable reference to the RecaptchaVerifier instance
  const recaptchaRef = useRef<any>(null);

  // Redirect as soon as worker profile is available
  useEffect(() => {
    if (!worker) return;
    if (worker.role === 'Admin') navigate('/', { replace: true });
    else if (worker.role === 'Contract') navigate('/worker-dashboard', { replace: true });
  }, [worker, navigate]);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      try {
        recaptchaRef.current?.clear?.();
      } catch (_) {
        // ignore cleanup errors
      }
    };
  }, []);

  const isValidE164 = (value: string) => /^\+[1-9]\d{1,14}$/.test(value.trim());

  // Handle Email/Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle Phone login → send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const trimmed = phone.trim();
      if (!isValidE164(trimmed)) {
        throw new Error('Enter phone in E.164 format, e.g., +919876543210');
      }
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha('recaptcha-container');
      }
      const result = await sendOTP(trimmed, recaptchaRef.current);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await verifyOTP(confirmationResult, otp);
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

        {step === 'email' && (
          <>
            <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4">
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

            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={() => setStep('phone')}
              >
                Login with Phone
              </button>
            </div>
          </>
        )}

        {step === 'phone' && (
          <div className="flex flex-col space-y-4">
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <div id="recaptcha-container"></div>
            <button
              className="bg-primary-500 hover:bg-primary-600 text-grey py-2 rounded"
              onClick={handleSendOtp}
              disabled={loading || !isValidE164(phone)}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            {!isValidE164(phone) && phone && (
              <div className="text-sm text-red-500">Use E.164 format, e.g., +919876543210</div>
            )}
            <button
              className="mt-2 text-sm text-gray-500 underline"
              onClick={() => setStep('email')}
            >
              Back to Email Login
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <button
              className="bg-primary-500 hover:bg-primary-600 text-grey py-2 rounded"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              className="mt-2 text-sm text-gray-500 underline"
              onClick={() => setStep('phone')}
            >
              Back to Phone Input
            </button>
          </div>
        )}
      </div>
    </div>
  );
}