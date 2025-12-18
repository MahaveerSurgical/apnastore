// src/routes/AdminRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

/**
 * Protects routes accessible only to Admin users.
 * Redirects non-admin users to /worker-dashboard
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, worker, loading } = useAuthContext();
  const location = useLocation();

  console.group('%c🔒 AdminRoute', 'color: #4CAF50; font-weight: bold');
  console.log('📍 Path:', location.pathname);
  console.log('👤 Auth:', { uid: user?.uid, worker: worker?.role, loading });
  console.groupEnd();

  if (loading) {
    console.log('%c⏳ Loading...', 'color: #FFA500; font-weight: bold');
    return <Loading />;
  }
  
  if (!user) {
    console.log('%c❌ No user authenticated', 'color: #FF0000; font-weight: bold');
    if (location.pathname === '/login') {
      console.log('%c✋ Already on login page', 'color: #808080');
      return null;
    }
    console.log('%c🔄 Redirecting to login', 'color: #0000FF');
    return <Navigate to="/login" replace />;
  }

  // Handle different worker roles and unclassified users
  if (!worker || worker.role !== 'Admin') {
    console.log('%c⚠️ Access check', 'color: #FF4500; font-weight: bold', { role: worker?.role });
    
    // If worker exists but is Contract type, send to worker dashboard
    if (worker?.role === 'Contract') {
      if (location.pathname === '/worker-dashboard') {
        console.log('%c✋ Already on worker dashboard', 'color: #808080');
        return null;
      }
      console.log('%c🔄 Redirecting Contract worker to dashboard', 'color: #0000FF');
      return <Navigate to="/worker-dashboard" replace />;
    }
    
    // For unclassified users (no worker doc or unknown role), send to diagnostic page
    if (location.pathname === '/test') {
      console.log('%c✋ Already on diagnostic page', 'color: #808080');
      return null;
    }
    console.log('%c🔬 Redirecting to diagnostic page', 'color: #9C27B0');
    return <Navigate to="/test" replace />;
  }

  console.log('%c✅ Rendering admin content', 'color: #4CAF50; font-weight: bold');
  return <>{children}</>;
};