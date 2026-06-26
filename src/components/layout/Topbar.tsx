import { logout } from '../../hooks/auth/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import  PrimaryButton from '../ui/PrimaryButton';

export const Topbar = () => {
  const { worker } = useAuthContext();

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    await logout();
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-sm px-6 py-4">
      <h1 className="text-lg font-semibold">Welcome, {worker?.name}</h1>
        <PrimaryButton
        onClick={handleLogout}variant="danger"
        >
        Logout
        </PrimaryButton>
    </header>
  );
};