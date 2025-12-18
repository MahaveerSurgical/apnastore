// src/routes/WorkerRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

/**
 * Protects routes accessible only to Contract Worker users.
 * Redirects non-worker users to admin dashboard
 */
export const WorkerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, worker, loading } = useAuthContext();
  const location = useLocation();

  console.log('[WorkerRoute] Render with:', {
    pathname: location.pathname,
    user: user?.uid,
    worker: worker?.role,
    loading
  });

  if (loading) {
    console.log('[WorkerRoute] Loading...');
    return <Loading />;
  }

  if (!user) {
    console.log('[WorkerRoute] No user, checking login path');
    if (location.pathname === '/login') {
      console.log('[WorkerRoute] Already on login, returning null');
      return null;
    }
    console.log('[WorkerRoute] Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Handle different worker roles and unclassified users
  if (!worker || worker.role !== 'Contract') {
    console.log('%c⚠️ Access check', 'color: #FF4500; font-weight: bold', { role: worker?.role });
    
    // If worker exists but is Admin type, send to admin dashboard
    if (worker?.role === 'Admin') {
      if (location.pathname === '/') {
        console.log('%c✋ Already on admin dashboard', 'color: #808080');
        return null;
      }
      console.log('%c🔄 Redirecting Admin to dashboard', 'color: #0000FF');
      return <Navigate to="/" replace />;
    }
    
    // For unclassified users (no worker doc or unknown role), send to diagnostic page
    if (location.pathname === '/test') {
      console.log('%c✋ Already on diagnostic page', 'color: #808080');
      return null;
    }
    console.log('%c🔬 Redirecting to diagnostic page', 'color: #9C27B0');
    return <Navigate to="/test" replace />;
  }

  console.log('[WorkerRoute] Rendering worker content');
  return <>{children}</>;
};