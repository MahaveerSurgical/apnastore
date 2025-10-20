// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

/**
 * Protects routes that require any authenticated user (Admin or Worker)
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};