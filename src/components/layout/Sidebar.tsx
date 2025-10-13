import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthContext } from '../../contexts/AuthContext';
import { logout } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { worker } = useAuthContext();

  const adminLinks = [
    { name: 'Dashboard', to: '/' },
    { name: 'Customers', to: '/customers' },
    { name: 'Workers', to: '/workers' },
    { name: 'Raw Materials', to: '/inventory/raw-materials' },
    { name: 'Ready Belts', to: '/inventory/ready-belts' },
    { name: 'Production Orders', to: '/orders/production' },
    { name: 'Sales Orders', to: '/orders/sales' }
  ];

  const workerLinks = [{ name: 'Worker Dashboard', to: '/worker-dashboard' }];

  const links = worker?.role === 'Admin' ? adminLinks : workerLinks;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Mahaveer Surgical</h2>
      <nav className="flex flex-col space-y-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'px-3 py-2 rounded hover:bg-gray-800',
                isActive ? 'bg-gray-800 font-semibold' : ''
              )
            }
          >
            {link.name}
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
  );
};