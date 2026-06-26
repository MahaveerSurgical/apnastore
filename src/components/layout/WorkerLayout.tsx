// src/components/layout/WorkerLayout.tsx
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { logout } from '../../hooks/auth/useAuth';
import PrimaryButton from '../ui/PrimaryButton';

interface WorkerLayoutProps {
  children: React.ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const { worker } = useAuthContext();

  const handleLogout = async () => {
    try {
      if (!window.confirm('Are you sure you want to log out?')) return;
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <span>Worker: {worker?.name}</span>
        <PrimaryButton
        onClick={handleLogout}variant="danger"        
        >
          Logout
        </PrimaryButton>
      </div>

      {/* Page content */}
      <main className="p-4 flex-1 overflow-auto">{children}</main>
    </div>
  );
}