// src/routes/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

/**
 * Protects routes accessible only to Admin users.
 * Redirects non-admin users to /worker-dashboard
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, worker, loading } = useAuthContext();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (worker?.role !== 'Admin') return <Navigate to="/worker-dashboard" replace />;

  return <>{children}</>;
};