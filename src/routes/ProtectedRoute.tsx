// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

/**
 * Protects routes that require any authenticated user (Admin or Worker)
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  console.log('[ProtectedRoute] Render with:', {
    pathname: location.pathname,
    user: user?.uid,
    loading
  });

  if (loading) {
    console.log('[ProtectedRoute] Loading...');
    return <Loading />;
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, checking login path');
    // Avoid redirect-to-self if we're already on the login page
    if (location.pathname === '/login') {
      console.log('[ProtectedRoute] Already on login, returning null');
      return null;
    }
    console.log('[ProtectedRoute] Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('[ProtectedRoute] Rendering protected content');
  return <>{children}</>;
};