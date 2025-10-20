import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthContext } from '../../contexts/AuthContext';
import { logout } from '../../hooks/useAuth';
import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  CubeIcon,
  CheckIcon,
  ClipboardIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export const Sidebar = () => {
  const { worker } = useAuthContext();

  const adminLinks = [
    { name: 'Dashboard', to: '/', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Customers', to: '/customers', icon: <UsersIcon className="w-6 h-6" /> },
    { name: 'Workers', to: '/workers', icon: <UserIcon className="w-6 h-6" /> },
    { name: 'Raw Materials', to: '/inventory/raw-materials', icon: <CubeIcon className="w-6 h-6" /> },
    { name: 'Ready Belts', to: '/inventory/ready-belts', icon: <CheckIcon className="w-6 h-6" /> },
    { name: 'Production Orders', to: '/orders/production', icon: <ClipboardIcon className="w-6 h-6" /> },
    { name: 'Sales Orders', to: '/orders/sales', icon: <ShoppingCartIcon className="w-6 h-6" /> },
  ];

  const workerLinks = [
    { name: 'Worker Dashboard', to: '/worker-dashboard', icon: <HomeIcon className="w-6 h-6" /> }
  ];

  const links = worker?.role === 'Admin' ? adminLinks : workerLinks;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white min-h-screen p-4 flex-col">
        <h2 className="text-xl font-bold mb-6">Mahaveer Surgical</h2>
        <nav className="flex flex-col space-y-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-2 rounded hover:bg-gray-800 flex items-center gap-2',
                  isActive ? 'bg-gray-800 font-semibold' : ''
                )
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around p-2 md:hidden shadow-inner">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center text-xs p-1',
                isActive ? 'text-primary-500' : 'text-gray-300'
              )
            }
          >
            {link.icon}
            <span className="hidden">{link.name}</span> {/* Optional for accessibility */}
          </NavLink>
        ))}
      </nav>
    </>
  );
};