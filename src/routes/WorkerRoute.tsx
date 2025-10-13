// src/routes/WorkerRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * Protects routes accessible only to Contract Worker users.
 * Redirects non-worker users to admin dashboard
 */
export const WorkerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, worker, loading } = useAuthContext();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (worker?.role !== 'Contract') return <Navigate to="/" replace />;

  return <>{children}</>;
};