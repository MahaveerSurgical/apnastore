// src/components/layout/WorkerLayout.tsx
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { logout } from '../../hooks/useAuth';

interface WorkerLayoutProps {
  children: React.ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const { worker } = useAuthContext();

  const handleLogout = async () => {
    try {
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
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Page content */}
      <main className="p-4 flex-1 overflow-auto">{children}</main>
    </div>
  );
}