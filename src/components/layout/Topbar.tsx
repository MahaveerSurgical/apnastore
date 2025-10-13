import React from 'react';
import { logout } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';

export const Topbar = () => {
  const { worker } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-sm px-6 py-4">
      <h1 className="text-lg font-semibold">Welcome, {worker?.name}</h1>
      <button
        onClick={handleLogout}
        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};